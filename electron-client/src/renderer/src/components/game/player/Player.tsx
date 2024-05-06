import { useEffect, useRef } from "react"

import { Group, Quaternion, Vector3 } from "three"
import { Line, Text } from "@react-three/drei"
import { useFrame, useThree } from "@react-three/fiber"

import { CAMERA_OFFSET } from "@comp/game"
import { PLAYER_SPEED, usePlayer, usePlayerAction } from "@comp/game/player"
import { Knight } from "@comp/game/entities"

export const Player = () => {
  const { camera } = useThree()
  const cameraTarget = useRef<Vector3>(new Vector3())

  const player = usePlayer()
  const { action, setAction } = usePlayerAction()
  
  const playerRef = useRef<Group>(null!)
  const textRef = useRef<Group>(null!)

  useFrame(() => {
    if (!playerRef.current) return

    // NOTE Assuming the camera is direct child of the Scene

    // eslint-disable-next-line @react-three/no-new-in-loop
    const objectPosition = new Vector3()
    playerRef.current.getWorldPosition(objectPosition)

    cameraTarget.current.lerp(objectPosition, 0.15)
    cameraTarget.current.y += 0.2
    camera.position.copy(cameraTarget.current).add(CAMERA_OFFSET)
    camera.lookAt(cameraTarget.current)
  })

  useFrame((_, delta) => {
    if (!player.path?.length) {
      if (action !== "Idle") setAction("Idle")

      return
    }

    if (action !== "Running_A") setAction("Running_A")

    const nextEl = player.path[0]

    // eslint-disable-next-line @react-three/no-new-in-loop
    const next = new Vector3(nextEl[0], nextEl[1], nextEl[2])

    // eslint-disable-next-line @react-three/no-clone-in-loop
    const direction = next.clone().sub(playerRef.current.position).normalize()

    // have player slowly turn towards direction

    playerRef.current.quaternion.slerp(
      // eslint-disable-next-line @react-three/no-new-in-loop
      new Quaternion().setFromUnitVectors(
        // eslint-disable-next-line @react-three/no-new-in-loop
        new Vector3(0, 0, 1),
        // eslint-disable-next-line @react-three/no-new-in-loop
        new Vector3(direction.x, 0, direction.z).normalize(),
      ),
      0.125,
    )

    const nextPosition = playerRef.current.position
      // eslint-disable-next-line @react-three/no-clone-in-loop
      .clone()
      .add(direction.multiplyScalar(delta * PLAYER_SPEED))

    playerRef.current.position.lerp(nextPosition, 1.1)

    const position: [number, number, number] = [
      playerRef.current.position.x,
      playerRef.current.position.y,
      playerRef.current.position.z,
    ]
    const rotation: [number, number, number] = [
      playerRef.current.rotation.x,
      playerRef.current.rotation.y,
      playerRef.current.rotation.z,
    ]

    player.position = position
    player.rotationY = rotation[1]

    if (playerRef.current.position.distanceTo(next) < 0.1) {
      player.path = player.path.length > 0 ? player.path.slice(1) : []
    }
  })

  useFrame(() => {
    if (!playerRef.current || !textRef.current) return

    textRef.current.position.copy(playerRef.current.position)
  })

  useEffect(() => {
    if (player.path.length > 0) {
      setAction("Running_A")
      return
    }

    if (!player.target) {
      setAction("Idle")
      return
    }
  }, [player.path, player.target])

  const closestChest = useRef<{ position: [number, number, number]; opacity: number } | null>(null)

  return (
    <>
      <group ref={textRef}>
        <Text
          color={"#000"}
          fontSize={0.35}
          rotation-y={Math.PI / 4}
          position-y={3.5 - (playerRef.current?.position.y || 0)}
        >
          Player Name
        </Text>
      </group>

      <group ref={playerRef} position={player.position}>
        <group position-y={0.5 - (playerRef.current?.position.y || 0)}>
          <Knight action={action} />
          <Knight asShadow action={action} />
        </group>
      </group>

      {closestChest.current && (
        <Line
          points={[
            new Vector3(playerRef.current.position.x, 0.5, playerRef.current.position.z),
            new Vector3(closestChest.current.position[0], 0.5, closestChest.current.position[2]),
          ]}
          opacity={closestChest.current.opacity}
          transparent
          color="darkgreen"
          lineWidth={7.5}
          segments // If true, renders a THREE.LineSegments2. Otherwise, renders a THREE.Line2
          dashed={true}
          dashScale={2}
        />
      )}
    </>
  )
}
