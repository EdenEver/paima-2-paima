import { useRemotePlayersData } from "@comp/game/player"
import { useCallback } from "react"

export const useUpdateRemotePlayerPath = () => {
  const playersData = useRemotePlayersData()

  const updateRemotePlayerPath = useCallback(
    (id: string, path: [number, number, number][]) => {
      if (playersData[id]) {
        playersData[id].path = path
      }
    },
    [playersData],
  )

  return updateRemotePlayerPath
}
