import "./assets/main.css"

import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"

import { Libp2pProvider } from "@comp/libp2p"
import { PlayerProvider } from "@comp/game/player"
import { RemotePlayersProvider } from "@comp/game/player"

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Libp2pProvider>
      <PlayerProvider>
        <RemotePlayersProvider>
          <App />
        </RemotePlayersProvider>
      </PlayerProvider>
    </Libp2pProvider>
  </React.StrictMode>,
)
