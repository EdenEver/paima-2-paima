import { useContext } from 'react'
import { Libp2pContextInterface, libp2pContext } from '.'

export function useLibp2p(): Libp2pContextInterface {
  return useContext(libp2pContext)
}
