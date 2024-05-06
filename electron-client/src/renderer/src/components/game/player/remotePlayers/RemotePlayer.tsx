import { useRef } from "react"

import { Text } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { Group, Quaternion, Vector3 } from "three"
import { Player } from "edenever"

import { Knight } from "@comp/game/entities"
import { PLAYER_SPEED, useRemotePlayer, RemotePlayerProvider } from "@comp/game/player"

// todo, dedupe from Player.tsx
// todo, https://docs.pmnd.rs/react-three-fiber/advanced/scaling-performance
// todo, https://github.com/pmndrs/react-three-fiber/issues/133

const RemotePlayer = ({ player }: { player: Player }) => {
  const { action, setAction } = useRemotePlayer()

  const playerRef = useRef<Group>(null!)
  const textRef = useRef<Group>(null!)

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

  return (
    <>
      <group ref={textRef}>
        <Text
          color={"#000"}
          fontSize={0.35}
          rotation-y={Math.PI / 4}
          position-y={3.5 - (playerRef.current?.position.y || 0)}
        >
          {player.name}
        </Text>
      </group>

      <group ref={playerRef} position={player.position}>
        <group position-y={0.5 - (playerRef.current?.position.y || 0)}>
          <Knight action={action} />
          <Knight asShadow action={action} />
        </group>
      </group>
    </>
  )
}

const RemotePlayerController = ({ player }: { player: Player }) => {
  return (
    <RemotePlayerProvider>
      <RemotePlayer player={player} />
    </RemotePlayerProvider>
  )
}

export { RemotePlayerController as RemotePlayer }
