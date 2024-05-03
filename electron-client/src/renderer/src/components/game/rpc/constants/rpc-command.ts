export const RPC_COMMAND_MOVE = 'move'
export const RPC_COMMAND_JOIN = 'join'

export type RpcCommand = typeof RPC_COMMAND_MOVE | typeof RPC_COMMAND_JOIN
