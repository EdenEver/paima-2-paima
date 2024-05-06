import { RpcCommand } from "../constants/RpcCommand"

declare module "edenever" {
  interface RpcMessage {
    command: RpcCommand
  }

  interface RpcJoinMessage extends RpcMessage {
    command: "join"
    player: Player
  }

  interface RpcLeaveMessage extends RpcMessage {
    command: "leave"
  }

  interface RpcMoveMessage extends RpcMessage {
    command: "move"
    path: [number, number, number][]
  }
}
