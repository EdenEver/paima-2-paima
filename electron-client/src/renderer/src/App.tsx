import { useEffect } from "react"

import { Player, RpcJoinData, RpcLeaveData } from "edenever"

import { Game } from "@comp/game"
import { useAddRemotePlayer, usePlayer, useRemoveRemotePlayer, useUpdateRemotePlayerPath } from "@comp/game/player"
import { sendGameRpc } from "./components/electron"

import { RpcMessageCallback, subscribeToGameRpcMessages, unsubscribeToGameRpcMessages } from "@comp/electron"
import { isRpcJoinData, isRpcLeaveData, isRpcMoveData } from "./components/game/rpc"

const Content = (): React.ReactNode => {
  const player = usePlayer()

  const addRemotePlayer = useAddRemotePlayer()
  const removeRemotePlayer = useRemoveRemotePlayer()
  const updateRemotePlayerPath = useUpdateRemotePlayerPath()

  useEffect(() => {
    console.log("Hello")
    const handleGameRpc: RpcMessageCallback = (message) => {
      console.log("Hello message", message)
      const { from, data } = message

      if (isRpcJoinData(data)) {
        const player: Player = {
          ...data.player,
          name: from,
        }

        addRemotePlayer(from, player)

        return
      }

      if (isRpcLeaveData(data)) {
        removeRemotePlayer(from)

        return
      }

      if (isRpcMoveData(data)) {
        updateRemotePlayerPath(from, data.path)

        return
      }

      // message.command satisfies never // todo
    }

    subscribeToGameRpcMessages(handleGameRpc)

    return () => {
      unsubscribeToGameRpcMessages(handleGameRpc)
    }
  }, [])

  useEffect(() => {
    const join = () => {
      const data: RpcJoinData = {
        command: "join",
        player: {
          ...player,
        },
      }

      sendGameRpc(data)
    }

    const interval = setInterval(join, 10_000)
    const timeout = setTimeout(join, 1_000)

    return (): void => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [player])

  useEffect(() => {
    window.onbeforeunload = function () {
      const data: RpcLeaveData = {
        command: "leave",
      }

      sendGameRpc(data)
    }
  }, [])

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
