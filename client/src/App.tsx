import "./App.css"

import { useEffect } from "react"
import { Message } from "@libp2p/interface"
import { AppWrapper, useLibp2p } from "./components/libp2p"

const Content = () => {
  const { libp2p } = useLibp2p()

  useEffect(() => {
    const onMessage = (event: CustomEvent<Message>) => {
      const { topic, data } = event.detail
      const msg = new TextDecoder().decode(data)

      if (topic === "paima-test") {
        console.log(`Received message from ${topic} : ${msg}\n`)
      }
    }

    // NOTE(Alan): seems like you must add the event listener before subscribing
    libp2p.services.pubsub.addEventListener("message", onMessage)
    libp2p.services.pubsub.subscribe("paima-test")
    return () => {
      libp2p.services.pubsub.removeEventListener("message", onMessage)
      libp2p.services.pubsub.unsubscribe("paima-test")
    }
  }, [libp2p.services.pubsub])

  return <>Lib p2p</>
}

function App() {
  return (
    <AppWrapper>
      <Content />
    </AppWrapper>
  )
}

export default App
