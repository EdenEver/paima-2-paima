import { useContext } from "react"
import { playerContext } from "./player-context"

export const usePlayerAction = () => {
  const ctx = useContext(playerContext)

  return {
    action: ctx.action,
    setAction: ctx.setAction,
  }
}
