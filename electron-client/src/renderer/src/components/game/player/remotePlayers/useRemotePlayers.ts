import { useContext, useMemo } from "react"

import { remotePlayersContext } from "@comp/game/player"

export const useRemotePlayers = () => {
  const { playersList, playerData } = useContext(remotePlayersContext)

  const remotePlayers = useMemo(() => playersList.map((id) => playerData[id]), [playersList, playerData])

  return remotePlayers
}
