import "./assets/main.css"

import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"

import { PlayerProvider } from "@comp/game/player"
import { RemotePlayersProvider } from "@comp/game/player"

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <PlayerProvider>
      <RemotePlayersProvider>
        <App />
      </RemotePlayersProvider>
    </PlayerProvider>
  </React.StrictMode>,
)
