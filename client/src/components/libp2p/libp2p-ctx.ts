import { createContext } from "react"
import { LibP2P } from "."

interface Libp2pContextInterface {
  libp2p: LibP2P
}

export const libp2pContext = createContext<Libp2pContextInterface>({
  libp2p: null!,
})
