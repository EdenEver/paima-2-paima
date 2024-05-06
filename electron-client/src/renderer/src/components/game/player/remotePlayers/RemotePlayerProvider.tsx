import { PropsWithChildren, useState } from "react"

import { KnightActionName } from "@comp/game/entities"
import { remotePlayerContext } from "@comp/game/player"

export const RemotePlayerProvider = ({ children }: PropsWithChildren<object>): React.ReactNode => {
  const [action, setAction] = useState<KnightActionName>("Idle")

  return <remotePlayerContext.Provider value={{ action, setAction }}>{children}</remotePlayerContext.Provider>
}
