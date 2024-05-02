import { RpcCommand } from "./constants/rpc-command"

export interface RpcMessage {
  command: RpcCommand
  peerId: string
}
