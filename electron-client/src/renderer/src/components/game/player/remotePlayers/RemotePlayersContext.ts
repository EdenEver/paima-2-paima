import { createContext } from "react"
import { Player } from "edenever"

export interface RemotePlayersContext {
  playerData: { [key: string]: Player }
  playersList: string[]
  addPlayer: (id: string, player: Player) => void
  removePlayer: (id: string) => void
}

export const remotePlayersContext = createContext<RemotePlayersContext>({
  addPlayer: null!,
  removePlayer: null!,
  playerData: {},
  playersList: [],
})
