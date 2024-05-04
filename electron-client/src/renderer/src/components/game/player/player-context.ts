import { Player } from "edenever"
import { createContext } from "react"

export interface PlayerContext {
  player: Player
}

export const playerContext = createContext<PlayerContext>({
  player: null!,
})
