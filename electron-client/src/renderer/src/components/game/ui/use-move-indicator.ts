import { atom, useAtom } from "jotai"
import { Vector3 } from "three"

const moveIndicatorAtom = atom<Vector3 | null>(null)

export const useMoveIndicator = () => {
  const [moveIndicator, setMoveIndicator] = useAtom(moveIndicatorAtom)

  return {
    moveIndicator,
    setMoveIndicator,
  }
}
