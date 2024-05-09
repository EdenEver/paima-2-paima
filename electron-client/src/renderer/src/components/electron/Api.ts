import { RpcData } from "edenever"

export type RpcMessageCallback = (message: { from: string; data: RpcData }) => void

export const subscribeToGameRpcMessages = (cb: RpcMessageCallback): void => {
  window.api.onGameRpc(cb)
}

export const unsubscribeToGameRpcMessages = (cb: RpcMessageCallback): void => {
  window.api.offGameRpc(cb)
}

export const sendGameRpc = (data: RpcData): void => {
  window.electron.ipcRenderer.send("game-rpc", data)
}
