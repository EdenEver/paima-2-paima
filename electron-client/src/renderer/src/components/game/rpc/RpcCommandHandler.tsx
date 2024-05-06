import { useEffect } from "react"

import { Message, SignedMessage } from "@libp2p/interface-pubsub"
import { Player } from "edenever"

import { useLibp2p } from "@comp/libp2p"
import { RPC_TOPIC, RpcCommand } from "@comp/game/rpc"
import { useAddRemotePlayer, useRemoveRemotePlayer } from "@comp/game/player"

export const RpcCommandHandler = () => {
  const { libp2p } = useLibp2p()

  const addRemotePlayer = useAddRemotePlayer()
  const removeRemotePlayer = useRemoveRemotePlayer()

  useEffect(() => {
    const handleRpcMessage = (message: SignedMessage) => {
      const { data, from } = message

      const peerId = from.toString()
      const command = new TextDecoder().decode(data) as RpcCommand

      switch (command) {
        case "join": {
          const player: Player = {
            name: peerId,
            position: [0, 0, 0],
            path: [],
            rotationY: 0,
            target: null,
          }

          addRemotePlayer(peerId, player)
          break
        }
        case "move": {
          // if (remotePlayers[peerId]) {
          //   remotePlayers[peerId].path = [] // JSON.parse(new TextDecoder().decode(data))
          // }
          break
        }
        case "leave": {
          removeRemotePlayer(peerId)
          break
        }
        default: {
          command satisfies never
          break
        }
      }
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
