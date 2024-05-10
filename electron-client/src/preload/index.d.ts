import { ElectronAPI } from "@electron-toolkit/preload"

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      onGameRpc: (cb: unknown) => void
      offGameRpc: (cb: unknown) => void
    }
  }
}
