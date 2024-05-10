import { Suspense } from "react"

import { twMerge } from "tailwind-merge"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Preload } from "@react-three/drei"
import { RpcJoinMessage } from "edenever"
import { Perf } from "r3f-perf"

import { CAMERA_NEAR, CAMERA_OFFSET, CAMERA_ZOOM } from "@comp/game"
import { RpcCommandHandler } from "@comp/game/rpc"
import { Scene, Lighting } from "@comp/game/scene"
import { useIsHoveringObject } from "@comp/game/ui"
import { usePlayer } from "./player"
import { sendGameRpc } from "../electron"

// let joined = false

export const Game = () => {
  const player = usePlayer()

  const sendJoinEvent = async () => {
    try {
      const message: RpcJoinMessage = {
        command: "join",
        player: {
          ...player,
        },
      }

      sendGameRpc(message)
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

        {/* <RpcCommandHandler /> */}

        <Suspense fallback={null}>
          <Scene />
        </Suspense>

        <Lighting />

        <OrbitControls enableZoom={false} enableRotate={false} />
      </Canvas>
    </>
  )
}
