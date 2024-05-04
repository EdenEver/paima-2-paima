import { atom, useAtom } from "jotai"
import { Player } from "@comp/game/player"

const otherPlayersAtom = atom<Player[]>([])

export const useOtherPlayers = () => {
  const [players, setPlayers] = useAtom(otherPlayersAtom)

  return {
    players,
    setPlayers,
  }
}
