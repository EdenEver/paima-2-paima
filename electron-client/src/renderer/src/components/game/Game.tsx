import { Suspense } from 'react'

import { twMerge } from 'tailwind-merge'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

import { CAMERA_NEAR, CAMERA_OFFSET, CAMERA_ZOOM } from '@comp/game'
import { useIsHoveringObject } from '@comp/game/ui'
import { Scene, Lighting } from '@comp/game/scene'
import { RpcCommandHandler } from '@comp/game/rpc'
// import { useLibp2p } from '../libp2p'

// let joined = false

// uint8 array from string
// const uint8ArrayFromString = (str: string) => new TextEncoder().encode(str)

export const Game = () => {
  // const { libp2p } = useLibp2p()
  // const { peerStats } = usePeerContext()

  // const sendJoinEvent = async () => {
  //   if (!peerStats.connected) return // || joined) return
  //   // joined = true

  //   try {
  //     const command = "join"

  //     const res = await libp2p.services.pubsub.publish(RPC_TOPIC, uint8ArrayFromString(command))

  //     console.log("join res", res)
  //   } catch {
  //     // joined = false
  //   }
  // }

  const isHoveringObjects = useIsHoveringObject()

  const canvasClasses = twMerge(isHoveringObjects ? 'cursor-pointer' : `cursor-crosshair`)

  return (
    <>
      <RpcCommandHandler />

      {/* <div className="absolute top-5 right-5 z-40">
        <button onClick={sendJoinEvent}>send join event</button>
      </div> */}

      <Canvas
        className={canvasClasses}
        style={{ background: '#222', height: '100%' }}
        shadows
        orthographic
        camera={{ zoom: CAMERA_ZOOM, near: CAMERA_NEAR, position: CAMERA_OFFSET }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>

        <Lighting />

        <OrbitControls enableZoom={false} enableRotate={false} />
      </Canvas>
    </>
  )
}
