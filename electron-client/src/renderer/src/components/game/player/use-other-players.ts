import { Player } from "edenever"
import { atom, useAtom } from "jotai"

const otherPlayersAtom = atom<Player[]>([])

export const useOtherPlayers = () => {
  const [players, setPlayers] = useAtom(otherPlayersAtom)

  return {
    players,
    setPlayers,
  }
}
