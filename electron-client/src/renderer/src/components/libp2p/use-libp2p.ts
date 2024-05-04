import { useContext } from "react"
import { Libp2pContext, libp2pContext } from "."

export function useLibp2p(): Libp2pContext {
  return useContext(libp2pContext)
}
