import { useContext } from "react"
import { libp2pContext } from "."

export function useLibp2p() {
  return useContext(libp2pContext)
}
