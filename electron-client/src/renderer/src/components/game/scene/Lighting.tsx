import { useMemo, useRef } from 'react'

import { Group } from 'three'

import { usePlayer } from '@comp/game/player'

export const Lighting = () => {
  const player = usePlayer()

  const lightTarget = useRef(new Group())
  const playerPosition = useMemo(() => player.position, [player.position])

  return (
    <>
      <ambientLight intensity={1} rotation-x={5} />
      <hemisphereLight intensity={1} groundColor={'#080820'} position={[0, 5, 0]} />

      <group ref={lightTarget} position={playerPosition}>
        <directionalLight
          color="#FFE"
          target={lightTarget.current}
          position={[-1, 8, -0.5]}
          intensity={0.5}
          castShadow
          shadow-mapSize-width={8192}
          shadow-mapSize-height={8192}
          shadow-camera-near={0.1}
          shadow-camera-far={10}
          shadow-camera-left={-50}
          shadow-camera-right={50}
          shadow-camera-top={50}
          shadow-camera-bottom={-50}
        />
      </group>
    </>
  )
}
