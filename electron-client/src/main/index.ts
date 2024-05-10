import { runStaticServer } from "./static-server"
import { app, shell, BrowserWindow, ipcMain } from "electron"
import { join } from "path"
import { electronApp, optimizer, is } from "@electron-toolkit/utils"
import icon from "../../resources/icon.png?asset"
import { Libp2pNode, createLibp2pNode } from "./createLibp2pNode"
import { Message } from "@libp2p/interface-pubsub"

function createWindow(libp2pNode: Libp2pNode) {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    // width: 900,
    // height: 670,
    show: false,
    fullscreen: true,
    autoHideMenuBar: true,
    ...(process.platform === "linux" ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      sandbox: false,
    },
  })

  mainWindow.once("ready-to-show", () => {
    mainWindow.show()

    libp2pNode.services.pubsub.addEventListener("message", (e: Event) => {
      const evt = e as CustomEvent<Message>
      if (evt.detail?.type !== "signed") return

      try {
        const from = evt.detail.from.toString()
        const data = JSON.parse(new TextDecoder().decode(evt.detail.data))

        const message = { from, data }
        console.log("incoming libp2p message", message)

        mainWindow.webContents.send("game-rpc", message)
      } catch (e) {
        // if (e instanceof ErrorEvent) console.error(e.error)
        if (e instanceof Error) console.error(e.message)
        else console.error(e)
      }
    })

    ipcMain.on("game-rpc", (_, message: unknown) => {
      console.log("outgoing libp2p message", message)

      libp2pNode.services.pubsub.publish("game-rpc", new TextEncoder().encode(JSON.stringify(message)))
    })
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: "deny" }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"])
  } else {
    mainWindow.loadFile(join(__dirname, "../renderer/index.html"))
  }

  return mainWindow
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  runStaticServer()

  const libp2p = await createLibp2pNode()

  // Set app user model id for windows
  electronApp.setAppUserModelId("com.electron")

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on("ping", () => console.log("pong"))

  createWindow(libp2p)

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow(libp2p)
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
