import { atom, useAtom } from 'jotai'
import { Player } from '@comp/game/player'

const playerAtom = atom<Player>({
  name: '',
  position: [0, 0, 0],
  rotationY: 0,
  path: [],
  target: null
})

export const usePlayer = () => {
  const [player, setPlayer] = useAtom(playerAtom)

  return {
    player,
    setPlayer
  }
}
