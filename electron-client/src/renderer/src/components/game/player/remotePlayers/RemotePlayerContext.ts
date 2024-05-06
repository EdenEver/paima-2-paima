import { createContext } from "react"

import { KnightActionName } from "@comp/game/entities"

export interface RemotePlayerContext {
  action: KnightActionName
  setAction: (action: KnightActionName) => void
}

export const remotePlayerContext = createContext<RemotePlayerContext>({
  action: "Idle",
  setAction: null!,
})
