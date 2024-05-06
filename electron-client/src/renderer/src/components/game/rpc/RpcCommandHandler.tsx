import { useEffect } from "react"

import { Message, SignedMessage } from "@libp2p/interface-pubsub"
import { Player } from "edenever"

import { useLibp2p } from "@comp/libp2p"
import { RPC_TOPIC } from "@comp/game/rpc"
import { objectFromUint8Array } from "@comp/util"
import { useAddRemotePlayer, useRemoveRemotePlayer, useUpdateRemotePlayerPath } from "@comp/game/player"
import { isRpcJoinMessage } from "./isRpcJoinMessage"
import { isRpcLeaveMessage } from "./isRpcLeaveMessage"
import { isRpcMoveMessage } from "./isRpcMoveMessage"

export const RpcCommandHandler = () => {
  const { libp2p } = useLibp2p()

  const addRemotePlayer = useAddRemotePlayer()
  const removeRemotePlayer = useRemoveRemotePlayer()
  const updateRemotePlayerPath = useUpdateRemotePlayerPath()

  useEffect(() => {
    const handleRpcMessage = (message: SignedMessage) => {
      const { data, from } = message

      const peerId = from.toString()
      const rpcMessage = objectFromUint8Array(data)

      console.log("rpcMessage", rpcMessage)

      if (isRpcJoinMessage(rpcMessage)) {
        const player: Player = {
          name: peerId,
          position: [0, 0, 0],
          path: [],
          rotationY: 0,
          target: null,
        }

        addRemotePlayer(peerId, player)
        return
      }

      if (isRpcLeaveMessage(rpcMessage)) {
        removeRemotePlayer(peerId)
        return
      }

      if (isRpcMoveMessage(rpcMessage)) {
        updateRemotePlayerPath(peerId, rpcMessage.path)
        return
      }

      // rpcMessage.command satisfies never // todo
    }

    const messageCBWrapper = async (e: Event) => {
      const evt = e as CustomEvent<Message>
      if (evt.detail?.type !== "signed") return

      switch (evt.detail.topic) {
        case RPC_TOPIC: {
          handleRpcMessage(evt.detail)
          break
        }
      }
    }

    libp2p.services.pubsub.addEventListener("message", messageCBWrapper)

    return () => {
      libp2p.services.pubsub.removeEventListener("message", messageCBWrapper)
    }
  }, [libp2p, addRemotePlayer, removeRemotePlayer])

  // return nothing, just a handler
  return null
}
