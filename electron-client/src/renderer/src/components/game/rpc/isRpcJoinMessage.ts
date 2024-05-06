import { RpcJoinMessage, RpcMessage } from "edenever"

export const isRpcJoinMessage = (rpcMessage: RpcMessage): rpcMessage is RpcJoinMessage => rpcMessage.command === "join"
