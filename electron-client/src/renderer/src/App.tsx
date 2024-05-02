// import Versions from './components/Versions'
// import electronLogo from './assets/electron.svg'

import { Message } from '@libp2p/interface'
import { useLibp2p } from '@comp/libp2p'
import { useEffect } from 'react'
import { Game } from '@comp/game'

const Content = (): React.ReactNode => {
  const { libp2p } = useLibp2p()

  useEffect(() => {
    const onMessage = (event: CustomEvent<Message>): void => {
      const { topic, data } = event.detail
      const msg = new TextDecoder().decode(data)

      if (topic === 'paima-test') {
        console.log(`Received message from ${topic} : ${msg}\n`)
      }
    }

    // NOTE(Alan): seems like you must add the event listener before subscribing
    libp2p.services.pubsub.addEventListener('message', onMessage)
    libp2p.services.pubsub.subscribe('paima-test')

    return (): void => {
      libp2p.services.pubsub.removeEventListener('message', onMessage)
      libp2p.services.pubsub.unsubscribe('paima-test')
    }
  }, [libp2p.services.pubsub])

  return (
    <div className="h-screen">
      <Game />
    </div>
  )
}

// function App(): JSX.Element {
//   const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

//   return (
//     <>
//       <img alt="logo" className="logo" src={electronLogo} />
//       <div className="creator">Powered by electron-vite</div>
//       <div className="text">
//         Build an Electron app with <span className="react">React</span>
//         &nbsp;and <span className="ts">TypeScript</span>
//       </div>
//       <p className="tip">
//         Please try pressing <code>F12</code> to open the devTool
//       </p>
//       <div className="actions">
//         <div className="action">
//           <a href="https://electron-vite.org/" target="_blank" rel="noreferrer">
//             Documentation
//           </a>
//         </div>
//         <div className="action">
//           <a target="_blank" rel="noreferrer" onClick={ipcHandle}>
//             Send IPC
//           </a>
//         </div>
//       </div>
//       <Versions></Versions>
//     </>
//   )
// }

export default Content // App
