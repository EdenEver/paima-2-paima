import { RpcLeaveData, RpcData } from "edenever"

export const isRpcLeaveData = (data: RpcData): data is RpcLeaveData => data.command === "leave"
