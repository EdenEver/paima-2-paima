import { PropsWithChildren, useCallback, useRef, useState } from "react"
import { Player } from "edenever"

import { remotePlayersContext } from "@comp/game/player"

const usePlayerData = () => {
  const ref = useRef<{ [key: string]: Player }>({})

  return ref.current
}

export const RemotePlayersProvider = ({ children }: PropsWithChildren<object>): React.ReactNode => {
  const [playersList, setPlayersList] = useState<string[]>([])
  const playerData = usePlayerData()

  const addPlayer = useCallback(
    (id: string, player: Player) => {
      if (playerData[id] || playersList.includes(id)) {
        return
      }

      playerData[id] = player
      setPlayersList([...playersList, id])
    },
    [playerData, playersList],
  )

  const removePlayer = useCallback(
    (id: string) => {
      if (playerData[id]) {
        delete playerData[id]
      }

      setPlayersList(playersList.filter((playerId) => playerId !== id))
    },
    [playerData, playersList],
  )

  return (
    <remotePlayersContext.Provider value={{ playersList, playerData, addPlayer, removePlayer }}>
      {children}
    </remotePlayersContext.Provider>
  )
}
