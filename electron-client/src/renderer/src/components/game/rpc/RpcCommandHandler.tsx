import { useEffect } from "react"

import { Message, SignedMessage } from "@libp2p/interface-pubsub"
import { useThree } from "@react-three/fiber"
import { Player } from "edenever"

import { useLibp2p } from "@comp/libp2p"
import { objectFromUint8Array } from "@comp/util"
import { RPC_TOPIC, isRpcJoinMessage, isRpcLeaveMessage, isRpcMoveMessage } from "@comp/game/rpc"
import { useAddRemotePlayer, useRemoveRemotePlayer, useUpdateRemotePlayerPath } from "@comp/game/player"

export const RpcCommandHandler = () => {
  const { libp2p } = useLibp2p()
  const { invalidate } = useThree()

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
          ...rpcMessage.player,
          name: peerId,
        }

        addRemotePlayer(peerId, player)

        invalidate()

        return
      }

      if (isRpcLeaveMessage(rpcMessage)) {
        removeRemotePlayer(peerId)

        invalidate()

        return
      }

      if (isRpcMoveMessage(rpcMessage)) {
        updateRemotePlayerPath(peerId, rpcMessage.path)

        invalidate()

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
