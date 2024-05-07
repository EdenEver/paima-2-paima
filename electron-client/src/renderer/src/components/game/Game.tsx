import { Suspense } from "react"

import { twMerge } from "tailwind-merge"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Preload } from "@react-three/drei"
import { RpcJoinMessage } from "edenever"
import { Perf } from "r3f-perf"

import { useLibp2p } from "@comp/libp2p"
import { CAMERA_NEAR, CAMERA_OFFSET, CAMERA_ZOOM } from "@comp/game"
import { RPC_TOPIC, RpcCommandHandler } from "@comp/game/rpc"
import { Scene, Lighting } from "@comp/game/scene"
import { useIsHoveringObject } from "@comp/game/ui"
import { uint8ArrayFromObject } from "@comp/util"
import { usePlayer } from "./player"

// let joined = false

export const Game = () => {
  const player = usePlayer()
  const { libp2p } = useLibp2p()

  const sendJoinEvent = async () => {
    try {
      const message: RpcJoinMessage = {
        command: "join",
        player: {
          ...player,
        },
      }

      const res = await libp2p.services.pubsub.publish(RPC_TOPIC, uint8ArrayFromObject(message))

      console.log("join res", res)
    } catch (e) {
      console.log("failed to join", e)
    }
  }

  const isHoveringObjects = useIsHoveringObject()

  const canvasClasses = twMerge(isHoveringObjects ? "cursor-pointer" : `cursor-crosshair`)

  return (
    <>
      <button className="absolute bottom-2 right-2 z-40 bg-white rounded py-1 px-2" onClick={sendJoinEvent}>
        send join event
      </button>

      <Canvas
        className={canvasClasses}
        style={{ background: "#222", height: "100%" }}
        shadows
        orthographic
        camera={{ zoom: CAMERA_ZOOM, near: CAMERA_NEAR, position: CAMERA_OFFSET }}
      >
        <Perf />

        <Preload all />

        <RpcCommandHandler />

        <Suspense fallback={null}>
          <Scene />
        </Suspense>

        <Lighting />

        <OrbitControls enableZoom={false} enableRotate={false} />
      </Canvas>
    </>
  )
}
