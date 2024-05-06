import { Box, Capsule } from "@react-three/drei"

import { Player as PlayerInterface } from "edenever"

import { terrain, RecastNavmesh } from "@comp/game/terrain"
import { Player, RemotePlayer, useRemotePlayers } from "@comp/game/player"

export const Scene = () => {
  const remotePlayers = useRemotePlayers()

  return (
    <>
      <RecastNavmesh>
        {terrain.map(({ type, props, material, width, height, radius, length }, i) => {
          if (type === "box")
            return (
              <Box args={[width, height]} {...props} key={`terrain-${i}`}>
                <meshStandardMaterial color={material?.color ?? "#444"} />
              </Box>
            )

          if (type === "capsule")
            return (
              <Capsule args={[radius, length]} {...props} key={`terrain-${i}`}>
                <meshStandardMaterial color={material?.color ?? "#444"} />
              </Capsule>
            )

          return null
        })}
      </RecastNavmesh>

      <Player />

      {Object.entries(remotePlayers).map(([key, player]: [string, PlayerInterface]) => (
        <RemotePlayer key={`remote-player-${key}`} player={player} />
      ))}
    </>
  )
}
