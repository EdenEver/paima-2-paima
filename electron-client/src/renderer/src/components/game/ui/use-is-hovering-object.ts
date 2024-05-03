import { useNumHoveredObjects } from '@comp/game/ui'

export const useIsHoveringObject = () => {
  const { numHoveredObjects } = useNumHoveredObjects()

  return numHoveredObjects > 0
}
