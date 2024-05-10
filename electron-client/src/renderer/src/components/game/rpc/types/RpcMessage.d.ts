import { RpcCommand } from "../constants/RpcCommand"

declare module "edenever" {
  interface RpcData {
    command: RpcCommand
  }

  interface RpcJoinData extends RpcData {
    command: "join"
    player: Player
  }

  interface RpcLeaveData extends RpcData {
    command: "leave"
  }

  interface RpcMoveData extends RpcData {
    command: "move"
    path: [number, number, number][]
  }
}
