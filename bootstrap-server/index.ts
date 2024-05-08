import "dotenv"

import { createLibp2p } from "libp2p"
import { identify } from "@chainsafe/libp2p-identify"
import { gossipsub } from "@chainsafe/libp2p-gossipsub"
import { webSockets } from "@libp2p/websockets"
import { noise } from "@chainsafe/libp2p-noise"
import { yamux } from "@chainsafe/libp2p-yamux"
import { ping } from "@libp2p/ping"
import { pubsubPeerDiscovery } from "@libp2p/pubsub-peer-discovery"

const node = await createLibp2p({
  addresses: {
    listen: ["/ip4/0.0.0.0/tcp/5173/ws"],
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
      interval: 1_000,
      // topics: ["_paima-edenever._peer-discovery._p2p._pubsub", "_peer-discovery._p2p._pubsub"],
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
    }),
    identify: identify(),
  },
})

const newLine = (times = 1) => {
  for (let i = 0; i < times; i++) {
    console.log("")
  }
}

console.log("libp2p node", node.status, ":", node.peerId.toString())
newLine(2)

node.addEventListener("peer:discovery", ({ detail: peer }) => {
  console.log("Peer Discovered : ", peer.id.toString())

  if (peer.multiaddrs.length > 0) {
    newLine()
    console.log("Addresses : ")
    console.log(peer.multiaddrs.map((multiaddr) => `- ${multiaddr.toString()}`).join("\n"))
  }

  newLine(2)
})

// node.addEventListener("peer:identify", ({ detail: peer }) => {
//   console.log("Peer Identified:", peer.protocols.toString())
//   newLine(2)
// })

node.addEventListener("peer:connect", ({ detail: peerId }) => {
  console.log("Peer Connected:", peerId.toString())
  newLine(2)
})

node.addEventListener("peer:disconnect", ({ detail: peerId }) => {
  console.log("Peer Disconnected:", peerId.toString())
  newLine(2)
})

node.addEventListener("self:peer:update", ({ detail: { peer } }) => {
  const multiaddrs = peer.addresses.map(({ multiaddr }) => multiaddr)

  const peerId = peer.id.toString()

  console.log("Listening on addresses : ")
  newLine()

  console.log(multiaddrs.map((addr) => `- ${addr.toString()}/${peerId}`).join("\n"))
  newLine(2)
})

node.services.pubsub.subscribe("paima-test")
node.services.pubsub.subscribe("rpc")

console.log("topics", node.services.pubsub.getTopics())

// node.services.pubsub.addEventListener("message", (event) => {
//   const topic = event.detail.topic
//   const message = new TextDecoder().decode(event.detail.data)

//   console.log(`Received message from ${topic} : ${message}`)
//   newLine(2)
// })

// NOTE(Alan): export needed for top-level await
export {}
