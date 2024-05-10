import { RpcMoveData, RpcData } from "edenever"

export const isRpcMoveData = (data: RpcData): data is RpcMoveData => data.command === "move"
