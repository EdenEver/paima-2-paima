import { RpcLeaveMessage, RpcMessage } from "edenever"

export const isRpcLeaveMessage = (rpcMessage: RpcMessage): rpcMessage is RpcLeaveMessage =>
  rpcMessage.command === "leave"
