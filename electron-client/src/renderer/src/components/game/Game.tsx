import { Suspense } from 'react'

import { twMerge } from 'tailwind-merge'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Preload } from '@react-three/drei'
import { Perf } from 'r3f-perf'

import { useLibp2p } from '@comp/libp2p'
import { CAMERA_NEAR, CAMERA_OFFSET, CAMERA_ZOOM } from '@comp/game'
import { RPC_TOPIC, RpcCommandHandler } from '@comp/game/rpc'
import { Scene, Lighting } from '@comp/game/scene'
import { useIsHoveringObject } from '@comp/game/ui'

// let joined = false

const uint8ArrayFromString = (str: string) => new TextEncoder().encode(str)

export const Game = () => {
  const { libp2p } = useLibp2p()

  const sendJoinEvent = async () => {
    try {
      // const data = {
      //   command: 'join',
      //   position

      // }

      const res = await libp2p.services.pubsub.publish(RPC_TOPIC, uint8ArrayFromString('join'))

      console.log('join res', res)
    } catch (e) {
      console.log('failed to join', e)
    }
  }

  const isHoveringObjects = useIsHoveringObject()

  const canvasClasses = twMerge(isHoveringObjects ? 'cursor-pointer' : `cursor-crosshair`)

  return (
    <>
      <RpcCommandHandler />

      <button
        className="absolute bottom-2 right-2 z-40 bg-white rounded py-1 px-2"
        onClick={sendJoinEvent}
      >
        send join event
      </button>

      <Canvas
        className={canvasClasses}
        style={{ background: '#222', height: '100%' }}
        shadows
        orthographic
        camera={{ zoom: CAMERA_ZOOM, near: CAMERA_NEAR, position: CAMERA_OFFSET }}
      >
        <Perf />

        <Preload all />

        <Suspense fallback={null}>
          <Scene />
        </Suspense>

        <Lighting />

        <OrbitControls enableZoom={false} enableRotate={false} />
      </Canvas>
    </>
  )
}
