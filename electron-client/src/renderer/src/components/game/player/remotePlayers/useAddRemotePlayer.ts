import { useContext } from "react"

import { remotePlayersContext } from "@comp/game/player"

export const useAddRemotePlayer = () => {
  const { addPlayer } = useContext(remotePlayersContext)

  return addPlayer
}
