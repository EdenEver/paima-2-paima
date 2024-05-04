import { createContext } from 'react'
import { LibP2P } from '.'

export interface Libp2pContext {
  libp2p: LibP2P
}

export const libp2pContext = createContext<Libp2pContext>({
  libp2p: null!
})
