import { atom, useAtom } from "jotai"

const numHoveredObjectsAtom = atom(0)

export const useNumHoveredObjects = () => {
  const [numHoveredObjects, setNumHoveredObjects] = useAtom(numHoveredObjectsAtom)

  return {
    numHoveredObjects,
    setNumHoveredObjects,
  }
}
