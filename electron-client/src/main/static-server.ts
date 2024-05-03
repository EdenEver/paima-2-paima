import { resolve as resolvePath } from 'node:path'
import express from 'express'

// todo, add post deploy method to copy the public folder to the dist (and dist/*-unpacked) folder(s)

export const runStaticServer = () => {
  const app = express()
  const port = 4792

  // allow CORS
  app.use((_, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    next()
  })

  app.use(express.static(resolvePath(process.cwd(), 'public')))

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
}
