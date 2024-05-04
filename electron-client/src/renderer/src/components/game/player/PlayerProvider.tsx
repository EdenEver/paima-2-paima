import { PropsWithChildren, useRef } from 'react'
import { Player, playerContext } from '@comp/game/player'

const usePlayerRef = () => {
  const ref = useRef<Player>({
    name: '',
    position: [0, 0, 0],
    rotationY: 0,
    path: [],
    target: null
  })

  return ref.current
}

export const PlayerProvider = ({ children }: PropsWithChildren<object>): React.ReactNode => {
  const player = usePlayerRef()

  if (!player) return null

  return <playerContext.Provider value={{ player }}>{children}</playerContext.Provider>
}
