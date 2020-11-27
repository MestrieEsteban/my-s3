import 'reflect-metadata'

import { argv, prelude, mlog } from './core/libs/utils'
import Server from './Server'
import dotenv from 'dotenv'

const main = async (): Promise<void> => {
  try {
    prelude()

    dotenv.config()

    const port = argv[0] || (process.env.PORT as string)
    const host = argv[1] || (process.env.HOST as string)

    const server = new Server(host, parseInt(port, 10))
    await server.run()
  } catch (err) {
    mlog(err.message, 'error')
    process.exit(-1)
  }
}

main()
