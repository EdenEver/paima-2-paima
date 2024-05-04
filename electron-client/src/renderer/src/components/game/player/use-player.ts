import { useContext } from 'react'
import { playerContext } from './player-context'

export const usePlayer = () => {
  const ctx = useContext(playerContext)

  return ctx.player
}
