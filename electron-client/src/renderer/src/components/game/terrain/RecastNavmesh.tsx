import { PropsWithChildren, memo, useCallback, useEffect, useRef } from "react"

import { last } from "lodash"
import { suspend } from "suspend-react"
import { Box3, Group, Mesh, Sphere, Vector3 } from "three"
import { ThreeEvent, useFrame } from "@react-three/fiber"
import { NavMesh, NavMeshQuery, TileCache, init as initRecast } from "recast-navigation"
import { threeToTileCache } from "recast-navigation/three"
import { RpcMoveMessage, Target } from "edenever"

import { navMeshConfig } from "@comp/game/terrain"
import { useMoveIndicator } from "@comp/game/ui"
import { usePlayer } from "@comp/game/player"
import { sendGameRpc } from "@renderer/components/electron"

// import { Model as WallGated } from '@client/components/objects/WallGated';

// https://github.com/isaac-mason/recast-navigation-js/blob/main/packages/recast-navigation/.storybook/stories/crowd.stories.tsx

type NavmeshProps = PropsWithChildren<object>

const Navmesh = ({ children }: NavmeshProps) => {
  const navMesh = useRef<NavMesh | null>(null)
  const tileCache = useRef<TileCache | null>(null)

  const player = usePlayer()

  const { moveIndicator, setMoveIndicator } = useMoveIndicator()

  const group = useRef<Group>(null!)

  const indicatorRef = useRef<number>(0)

  useFrame((_, delta) => {
    if (indicatorRef.current > 0) {
      indicatorRef.current -= delta * 200
    }

    if (indicatorRef.current < 0) {
      indicatorRef.current = 0
    }
  })

  const onPointerUp = useCallback(
    (event: ThreeEvent<PointerEvent>) => {
      if (!navMesh.current) return

      const point = last(event.intersections)?.point

      if (!point) return

      setMoveIndicator(null)
      player.path = []
      player.target = null

      const startPosition = new Vector3(...player.position)

      let targetPos: Vector3 | null = null
      let target: Target | null = null

      if (event.intersections.length > 1) {
        const obj = event.intersections[0]!.object

        if (obj.userData.interactive) {
          const box = new Box3().setFromObject(event.intersections[0]!.object)
          const center = new Vector3()
          box.getCenter(center)

          const sphere = box.getBoundingSphere(new Sphere(center))

          const position = new Vector3(...player.position)

          const distance = position.distanceTo(sphere.center)

          if (distance <= sphere.radius * 1.5 + 0.2) return

          const direction = sphere.center.clone().sub(position).normalize()

          // get point at distance from center in direction
          targetPos = sphere.center.clone().sub(direction.multiplyScalar(sphere.radius * 1.5))
          target = {
            id: obj.userData.id,
            health: obj.userData.health,
            position: targetPos.toArray(),
            type: "chest",
          }

          player.target = target
        }
      }

      if (targetPos) {
        point.x = targetPos.x
        point.z = targetPos.z
      }

      setMoveIndicator(point)

      indicatorRef.current = 50

      const navMeshQuery = new NavMeshQuery({ navMesh: navMesh.current })

      const { success, path: newPath } = navMeshQuery.computePath(startPosition, point)

      if (!success) return

      // NOTE(Alan): Remove n first points if they are too close to the player
      //             avoids stuttering when repeatedly clicking in the same direction
      while (true) {
        if (newPath?.length < 2) break

        const next = new Vector3(newPath[0].x, newPath[0].y, newPath[0].z)

        if (startPosition.distanceTo(next) >= 0.1) break

        newPath.shift()
      }

      player.path = newPath.map((p) => [p.x, p.y, p.z])

      const message: RpcMoveMessage = {
        command: "move",
        path: player.path,
      }

      sendGameRpc(message)
    },
    [setMoveIndicator, player, navMesh, player.path, player.position, player.target],
  )

  const init = useCallback(() => {
    if (navMesh.current) {
      navMesh.current.destroy()
      navMesh.current = null as NavMesh | null
    }

    if (tileCache.current) {
      tileCache.current.destroy()
      tileCache.current = null as TileCache | null
    }

    const meshes: Mesh[] = []

    group.current.traverse((child) => {
      if (child.type === "Mesh") {
        meshes.push(child as Mesh)
      }
    })

    const { success, navMesh: newNawMesh } = threeToTileCache(meshes, navMeshConfig)

    if (!success) {
      if (navMesh.current) {
        navMesh.current.destroy()
        navMesh.current = null as NavMesh | null
      }

      return
    }

    navMesh.current = newNawMesh
  }, [])

  useEffect(() => {
    init()
  }, [init])

  return (
    <group ref={group} onPointerUp={onPointerUp}>
      {children}

      {/* need to */}
      {/* <group position-x={10} rotation-y={Math.PI / 4}>
        <WallGated />
      </group> */}

      {/* todo, this is not working since last change, add additional taget specific for this */}
      {moveIndicator && (
        <mesh position={moveIndicator.toArray()}>
          <sphereGeometry args={[0.2]} />
          <meshBasicMaterial color="black" opacity={indicatorRef.current / 100} transparent />
        </mesh>
      )}
    </group>
  )
}

const RecastInit = (props: { children: JSX.Element }) => {
  suspend(() => initRecast(), [])

  return props.children
}

const MemoizedNavmesh = memo(Navmesh, () => true)

export const RecastNavmesh = ({ children }: NavmeshProps) => {
  return (
    <RecastInit>
      <MemoizedNavmesh>{children}</MemoizedNavmesh>
    </RecastInit>
  )
}
