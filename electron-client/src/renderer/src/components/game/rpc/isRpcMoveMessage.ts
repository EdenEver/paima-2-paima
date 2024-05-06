import { RpcMoveMessage, RpcMessage } from "edenever"

export const isRpcMoveMessage = (rpcMessage: RpcMessage): rpcMessage is RpcMoveMessage => rpcMessage.command === "move"
