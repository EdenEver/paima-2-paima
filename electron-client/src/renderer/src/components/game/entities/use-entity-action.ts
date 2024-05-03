import { useEffect, useState } from 'react'
import { AnimationAction } from 'three'

type Actions = {
  [x: string]: AnimationAction | null
}

export const useEntityAction = (actions: Actions, action?: keyof Actions) => {
  const [currentAction, setCurrentAction] = useState<keyof Actions>()

  useEffect(() => {
    if (currentAction !== action) {
      if (currentAction && actions[currentAction]) actions[currentAction]?.fadeOut(0.25)
      if (action && actions[action]) actions[action]?.reset().fadeIn(0.25).play()
      // else mixer.stopAllAction()

      setCurrentAction(action)
    }
  }, [actions, action, currentAction])

  return currentAction
}
