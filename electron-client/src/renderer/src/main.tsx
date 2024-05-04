import './assets/main.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { Libp2pProvider } from './components/libp2p'
import { PlayerProvider } from './components/game/player'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Libp2pProvider>
      <PlayerProvider>
        <App />
      </PlayerProvider>
    </Libp2pProvider>
  </React.StrictMode>
)
