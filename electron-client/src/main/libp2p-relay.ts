import { createLibp2p } from "libp2p"
import { webSockets } from "@libp2p/websockets"
import * as filters from "@libp2p/websockets/filters"
import { noise } from "@chainsafe/libp2p-noise"
import { yamux } from "@chainsafe/libp2p-yamux"
import { mplex } from "@libp2p/mplex"
import { identify } from "@chainsafe/libp2p-identify"
import { circuitRelayServer } from "@libp2p/circuit-relay-v2"

// do: read https://github.com/libp2p/js-libp2p/blob/main/doc/CONFIGURATION.md#setup-with-relay

export const startLibp2pRelayServer = async () => {
  const server = await createLibp2p({
    addresses: {
      listen: ["/ip4/127.0.0.1/tcp/0/ws"],
    },
    transports: [
      webSockets({
        filter: filters.all,
      }),
    ],
    connectionEncryption: [noise()],
    streamMuxers: [yamux(), mplex()],
    services: {
      identify: identify(),
      relay: circuitRelayServer({
        reservations: {
          maxReservations: Infinity,
        },
      }),
    },
    connectionManager: {
      minConnections: 0,
    },
    connectionGater: {
      denyDialMultiaddr: () => false,
      denyDialPeer: () => false,
    },
  })

  return server.getMultiaddrs().map((ma) => ma.toString())
}
