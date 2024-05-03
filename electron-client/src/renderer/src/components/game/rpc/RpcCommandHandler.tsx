import { useEffect } from 'react'

import { Message, SignedMessage } from '@libp2p/interface-pubsub'

import { RPC_TOPIC, RpcCommand, RpcMessage } from '@comp/game/rpc'
import { useLibp2p } from '@renderer/components/libp2p'

export const RpcCommandHandler = () => {
  const { libp2p } = useLibp2p()

  // Effect hook to subscribe to pubsub events and update the message state hook
  // Effect hook to subscribe to pubsub events and update the message state hook
  useEffect(() => {
    const handleRpcMessage = (message: SignedMessage) => {
      const { data, from } = message

      const command = new TextDecoder().decode(data) as RpcCommand

      const rpcMessage: RpcMessage = {
        command,
        peerId: from.toString()
      }

      if (rpcMessage.command === 'join') {
        alert('another peer joined the game')
      }
    }

    const messageCBWrapper = async (e: Event) => {
      const evt = e as CustomEvent<Message>
      if (evt.detail?.type !== 'signed') return

      switch (evt.detail.topic) {
        case RPC_TOPIC: {
          handleRpcMessage(evt.detail)
          break
        }
      }
    }

    libp2p.services.pubsub.addEventListener('message', messageCBWrapper)

    return () => {
      libp2p.services.pubsub.removeEventListener('message', messageCBWrapper)
    }
  }, [libp2p])

  // return nothing, just a handler
  return null
}
