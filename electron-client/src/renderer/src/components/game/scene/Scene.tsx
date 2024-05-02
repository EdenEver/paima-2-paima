import React, { useEffect, useRef } from 'react'

import { Group, Quaternion, Vector3 } from 'three'
import { Box, Capsule, Line, Text } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'

import { CAMERA_OFFSET } from '@comp/game'
import { terrain, RecastNavmesh } from '@comp/game/terrain'
import { PLAYER_SPEED, Player, usePlayer } from '@comp/game/player'
import { Knight, KnightActionName } from '@comp/game/entities'

export const Scene = () => {
  const playerRef = useRef<Group>(null!)
  const text = useRef<Group>(null!)

  const { camera } = useThree()
  const cameraTarget = useRef<Vector3>(new Vector3())

  const { player, setPlayer } = usePlayer()

  useFrame(() => {
    if (!playerRef.current) return

    // NOTE Assuming the camera is direct child of the Scene
    const objectPosition = new Vector3()
    playerRef.current.getWorldPosition(objectPosition)

    cameraTarget.current.lerp(objectPosition, 0.15)
    cameraTarget.current.y += 0.2
    camera.position.copy(cameraTarget.current).add(CAMERA_OFFSET)
    camera.lookAt(cameraTarget.current)
  })

  useFrame((_, delta) => {
    if (!player.path?.length) return

    const nextEl = player.path[0]
    const next = new Vector3(nextEl[0], nextEl[1], nextEl[2])

    const direction = next.clone().sub(playerRef.current.position).normalize()

    // have player slowly turn towards direction
    playerRef.current.quaternion.slerp(
      new Quaternion().setFromUnitVectors(
        new Vector3(0, 0, 1),
        new Vector3(direction.x, 0, direction.z).normalize()
      ),
      0.125
    )

    const nextPosition = playerRef.current.position
      .clone()
      .add(direction.multiplyScalar(delta * PLAYER_SPEED))

    playerRef.current.position.lerp(nextPosition, 1.1)

    const position: [number, number, number] = [
      playerRef.current.position.x,
      playerRef.current.position.y,
      playerRef.current.position.z
    ]
    const rotation: [number, number, number] = [
      playerRef.current.rotation.x,
      playerRef.current.rotation.y,
      playerRef.current.rotation.z
    ]

    if (playerRef.current.position.distanceTo(next) < 0.1) {
      setPlayer(
        (prev: Player): Player => ({
          ...prev,
          position,
          rotationY: rotation[1],
          path: player.path ? prev.path.slice(1) : []
        })
      )
    } else {
      setPlayer(
        (prev: Player): Player => ({
          ...prev,
          position,
          rotationY: rotation[1]
        })
      )
    }
  })

  useFrame(() => {
    if (!playerRef.current || !text.current) return

    text.current.position.copy(playerRef.current.position)
  })

  const [action, setCharacterAction] = React.useState<KnightActionName>('Idle')

  useEffect(() => {
    if (player.path.length > 0) {
      setCharacterAction('Running_A')
      return
    }

    if (!player.target) {
      setCharacterAction('Idle')
      return
    }
  }, [player.path, player.target])

  const closestChest = useRef<{ position: [number, number, number]; opacity: number } | null>(null)

  return (
    <>
      <group ref={text}>
        <Text
          color={'#000'}
          fontSize={0.35}
          rotation-y={Math.PI / 4}
          position-y={3.5 - (playerRef.current?.position.y || 0)}
        >
          Player Name
        </Text>
      </group>

      <RecastNavmesh>
        {terrain.map(({ type, props, material, width, height, radius, length }, i) => {
          if (type === 'box')
            return (
              <Box args={[width, height]} {...props} key={`terrain-${i}`}>
                <meshStandardMaterial color={material?.color ?? '#444'} />
              </Box>
            )

          if (type === 'capsule')
            return (
              <Capsule args={[radius, length]} {...props} key={`terrain-${i}`}>
                <meshStandardMaterial color={material?.color ?? '#444'} />
              </Capsule>
            )

          return null
        })}
      </RecastNavmesh>

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
            new Vector3(closestChest.current.position[0], 0.5, closestChest.current.position[2])
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
