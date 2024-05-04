import { createContext } from 'react'
import { Player } from '@comp/game/player'

export interface PlayerContext {
  player: Player
}

export const playerContext = createContext<PlayerContext>({
  player: null!
})
