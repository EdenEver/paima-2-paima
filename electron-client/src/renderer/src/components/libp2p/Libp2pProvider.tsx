import { PropsWithChildren, useEffect, useState } from "react"
import { LibP2P, createLibp2p, libp2pContext } from "."

let loaded = false

interface Api {
  onInitPeer: (cb: (data: { multiaddrs: string[] }) => void) => void
  offInitPeer: (cb: (data: { multiaddrs: string[] }) => void) => void
}

export const Libp2pProvider = ({ children }: PropsWithChildren<object>): React.ReactNode => {
  const [libp2p, setLibp2p] = useState<LibP2P>()

  useEffect(() => {
    const onInitPeer = async ({ multiaddrs }: { multiaddrs: string[] }) => {
      if (loaded) return
      loaded = true

      try {
        const libp2p = await createLibp2p(multiaddrs)

        if (libp2p) {
          // @ts-expect-error - expose libp2p to window for global usage
          window.libp2p = libp2p

          setLibp2p(libp2p)
        }
      } catch (e) {
        console.error("failed to start libp2p", e)
      }
    }

    ;(window.api as Api)?.onInitPeer(onInitPeer)

    return () => {
      ;(window.api as Api)?.offInitPeer(onInitPeer)
    }
  }, [])

  if (!libp2p) return null

  return <libp2pContext.Provider value={{ libp2p }}>{children}</libp2pContext.Provider>
}
