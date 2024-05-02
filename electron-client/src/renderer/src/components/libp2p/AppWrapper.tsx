import { PropsWithChildren, useEffect, useState } from 'react'
import { LibP2P, createLibp2p, libp2pContext } from '.'

let loaded = false

export function AppWrapper({ children }: PropsWithChildren<object>): React.ReactNode {
  const [libp2p, setLibp2p] = useState<LibP2P>()

  useEffect(() => {
    const init = async (): Promise<void> => {
      if (loaded) return

      try {
        loaded = true
        const libp2p = await createLibp2p()

        if (libp2p) {
          // @ts-expect-error - expose libp2p to window for global usage
          window.libp2p = libp2p

          setLibp2p(libp2p)
        }
      } catch (e) {
        console.error('failed to start libp2p', e)
      }
    }

    init()
  }, [])

  if (!libp2p) return null

  return <libp2pContext.Provider value={{ libp2p }}>{children}</libp2pContext.Provider>
}
