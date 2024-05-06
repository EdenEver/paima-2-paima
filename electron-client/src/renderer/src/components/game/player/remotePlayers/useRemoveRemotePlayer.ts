import { useContext } from "react"

import { remotePlayersContext } from "@comp/game/player"

export const useRemoveRemotePlayer = () => {
  const { removePlayer } = useContext(remotePlayersContext)

  return removePlayer
}
