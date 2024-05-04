import { PropsWithChildren, useRef, useState } from "react"
import { Player } from "edenever"
import { playerContext } from "@comp/game/player"
import { KnightActionName } from "@comp/game/entities"

const usePlayerRef = () => {
  const ref = useRef<Player>({
    name: "",
    position: [0, 0, 0],
    rotationY: 0,
    path: [],
    target: null,
  })

  return ref.current
}

export const PlayerProvider = ({ children }: PropsWithChildren<object>): React.ReactNode => {
  const player = usePlayerRef()

  const [action, setAction] = useState<KnightActionName>("Idle")

  if (!player) return null

  return <playerContext.Provider value={{ player, action, setAction }}>{children}</playerContext.Provider>
}
