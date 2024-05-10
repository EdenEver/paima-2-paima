import { RpcJoinData, RpcData } from "edenever"

export const isRpcJoinData = (data: RpcData): data is RpcJoinData => data.command === "join"
