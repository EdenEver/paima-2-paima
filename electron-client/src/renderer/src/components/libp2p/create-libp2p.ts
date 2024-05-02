import { Libp2p, createLibp2p } from 'libp2p'
import { Identify, identify } from '@chainsafe/libp2p-identify'
import { webSockets } from '@libp2p/websockets'
import * as filters from '@libp2p/websockets/filters'
import { noise } from '@chainsafe/libp2p-noise'
import { yamux } from '@chainsafe/libp2p-yamux'
import { multiaddr } from '@multiformats/multiaddr'
import { PingService, ping } from '@libp2p/ping'
import { pubsubPeerDiscovery } from '@libp2p/pubsub-peer-discovery'
import { GossipsubEvents, gossipsub } from '@chainsafe/libp2p-gossipsub'
import { PubSub } from '@libp2p/interface'

export type LibP2P = Libp2p<{
  ping: PingService
  pubsub: PubSub<GossipsubEvents>
  identify: Identify
}>

let libp2p: LibP2P | null = null

const createNode = async (): Promise<LibP2P | null> => {
  if (libp2p) return libp2p

  try {
    libp2p = await createLibp2p({
      transports: [
        webSockets({
          filter: filters.all
        })
      ],
      connectionEncryption: [noise()],
      streamMuxers: [yamux()],
      connectionGater: {
        denyDialMultiaddr: () => false,
        denyDialPeer: () => false
        // denyInboundConnection: () => false,
        // denyInboundEncryptedConnection: () => false,
        // denyInboundRelayedConnection: () => false,
        // denyInboundRelayReservation: () => false,
        // denyInboundUpgradedConnection: () => false,
        // denyOutboundConnection: () => false,
        // denyOutboundEncryptedConnection: () => false,
        // denyOutboundRelayedConnection: () => false,
        // denyOutboundUpgradedConnection: () => false,
      },
      // TODO(Alan): When we have a static peer id, enable this
      // peerDiscovery: [
      //   bootstrap({
      //     list: [
      //       "/ip4/127.0.0.1/tcp/5173/ws",
      //     ]
      //   })
      // ],
      peerDiscovery: [
        pubsubPeerDiscovery({
          interval: 10_000,
          topics: ['_paima-edenever._peer-discovery._p2p._pubsub', '_peer-discovery._p2p._pubsub'],
          listenOnly: false
        })
      ],
      services: {
        ping: ping({
          protocolPrefix: 'paima-ping'
        }),
        pubsub: gossipsub({
          emitSelf: false
        }),
        identify: identify()
      }
    })

    const ma = multiaddr('/ip4/127.0.0.1/tcp/5173/ws')
    const conn = await libp2p.dial(ma)
    const latency = await libp2p.services.ping.ping(ma)

    console.log('created libp2p node :', libp2p.peerId.toString())
    console.log(`connected to : ${conn.remoteAddr.toString()}`)
    console.log(`latency : ${latency}`)

    // libp2p.services.pubsub.subscribe("paima-test")

    return libp2p
  } catch (e) {
    return null
    console.log(e)
  }
}

export { createNode as createLibp2p }