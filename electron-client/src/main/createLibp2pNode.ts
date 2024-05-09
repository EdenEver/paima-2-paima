import "dotenv"

import { Libp2p, createLibp2p } from "libp2p"
import { Identify, identify } from "@chainsafe/libp2p-identify"
import { GossipsubEvents, gossipsub } from "@chainsafe/libp2p-gossipsub"
import { webSockets } from "@libp2p/websockets"
// import { tcp } from "@libp2p/tcp"
import { noise } from "@chainsafe/libp2p-noise"
import { yamux } from "@chainsafe/libp2p-yamux"
import { PingService, ping } from "@libp2p/ping"
// import { pubsubPeerDiscovery } from "@libp2p/pubsub-peer-discovery"
import { multiaddr } from "@multiformats/multiaddr"
import { PubSub } from "@libp2p/interface-pubsub"
import { pubsubPeerDiscovery } from "@libp2p/pubsub-peer-discovery"

// read this: https://github.com/attestate/kiwistand/blob/main/src/config.mjs

export type Libp2pNode = Libp2p<{
  ping: PingService
  pubsub: PubSub<GossipsubEvents>
  identify: Identify
}>

export const createLibp2pNode = async (): Promise<Libp2pNode> => {
  const libp2p = await createLibp2p({
    addresses: {
      listen: ["/ip4/0.0.0.0/tcp/0/ws"],
    },
    transports: [webSockets()],
    connectionEncryption: [noise()],
    streamMuxers: [yamux()],
    connectionGater: {
      denyDialMultiaddr: () => false,
      denyDialPeer: () => false,
    },
    connectionManager: {
      maxConnections: 1000,
      minConnections: 50,
    },
    peerDiscovery: [
      pubsubPeerDiscovery({
        interval: 10_000,
        topics: ["_paima-edenever._peer-discovery._p2p._pubsub", "_peer-discovery._p2p._pubsub"],
        listenOnly: false,
      }),
    ],
    services: {
      ping: ping({
        protocolPrefix: "paima-ping",
      }),
      pubsub: gossipsub({
        emitSelf: false,
        doPX: true,
        allowPublishToZeroTopicPeers: true,
      }),
      identify: identify(),
    },
  })

  libp2p.services.pubsub.subscribe("paima-test")
  libp2p.services.pubsub.subscribe("game-rpc")

  const ma = multiaddr("/ip4/127.0.0.1/tcp/4987/ws")
  const conn = await libp2p.dial(ma)
  const latency = await libp2p.services.ping.ping(ma)

  console.log("created libp2p node :", libp2p.peerId.toString())
  console.log(`connected to : ${conn.remoteAddr.toString()}`)
  console.log(`latency : ${latency}`)
  console.log(
    `listening on : ${libp2p
      .getMultiaddrs()
      .map((ma) => ma.toString())
      .join(", ")}`,
  )
  console.log(`listening on topics : ${libp2p.services.pubsub.getTopics().join(", ")}`)

  return libp2p as unknown as Libp2pNode
}
