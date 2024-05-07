import { useEffect } from "react"

import { RpcJoinMessage, RpcLeaveMessage } from "edenever"

import { Game } from "@comp/game"
import { useLibp2p } from "@comp/libp2p"
import { RPC_TOPIC } from "@comp/game/rpc"
import { usePlayer } from "@comp/game/player"
import { uint8ArrayFromObject } from "@comp/util"

const Content = (): React.ReactNode => {
  const { libp2p } = useLibp2p()
  const player = usePlayer()

  useEffect(() => {
    libp2p.services.pubsub.subscribe(RPC_TOPIC)

    return (): void => {
      libp2p.services.pubsub.unsubscribe(RPC_TOPIC)
    }
  }, [libp2p.services.pubsub])

  useEffect(() => {
    const join = () => {
      const message: RpcJoinMessage = {
        command: "join",
        player: {
          ...player,
        },
      }

      libp2p.services.pubsub.publish(RPC_TOPIC, uint8ArrayFromObject(message))
    }

    const interval = setInterval(join, 10_000)
    const timeout = setTimeout(join, 1_000)

    window.onbeforeunload = function () {
      const message: RpcLeaveMessage = {
        command: "leave",
      }

      libp2p.services.pubsub.publish(RPC_TOPIC, uint8ArrayFromObject(message))
    }

    return (): void => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [libp2p.services.pubsub, player])

  return (
    <div className="h-screen relative">
      <button
        className="absolute bottom-12 right-2 p-2 py-1 bg-white rounded z-10"
        onClick={() => fetch("http://localhost:4200/123")}
      >
        Fetch
      </button>

      <Game />
    </div>
  )
}

// function App(): JSX.Element {
//   const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

//   return (
//     <>
//       <img alt="logo" className="logo" src={electronLogo} />
//       <div className="creator">Powered by electron-vite</div>
//       <div className="text">
//         Build an Electron app with <span className="react">React</span>
//         &nbsp;and <span className="ts">TypeScript</span>
//       </div>
//       <p className="tip">
//         Please try pressing <code>F12</code> to open the devTool
//       </p>
//       <div className="actions">
//         <div className="action">
//           <a href="https://electron-vite.org/" target="_blank" rel="noreferrer">
//             Documentation
//           </a>
//         </div>
//         <div className="action">
//           <a target="_blank" rel="noreferrer" onClick={ipcHandle}>
//             Send IPC
//           </a>
//         </div>
//       </div>
//       <Versions></Versions>
//     </>
//   )
// }

export default Content // App
