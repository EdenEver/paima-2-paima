import { useContext } from "react"

import { remotePlayerContext } from "@comp/game/player"

export const useRemotePlayer = () => {
  const remotePlayer = useContext(remotePlayerContext)

  return remotePlayer
}
