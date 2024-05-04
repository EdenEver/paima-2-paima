import { createContext } from "react"
import { Player } from "edenever"

import { KnightActionName } from "@comp/game/entities"

export interface PlayerContext {
  player: Player
  action: KnightActionName
  setAction: (action: KnightActionName) => void
}

export const playerContext = createContext<PlayerContext>({
  player: null!,
  action: "Idle",
  setAction: null!,
})
