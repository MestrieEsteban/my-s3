import express, { Express } from 'express'
import bodyParser from 'body-parser'
import passport from 'passport'

import { mlog } from '@/core/libs/utils'
import Database from '@/core/models/Database'

import '@/core/middlewares/passport'

import api from '@/routes/api'
import fs from 'fs'

import cors from 'cors';


export default class Server {
  private _host: string
  private _port: number
  private _app: Express | null = null

  public constructor(host: string, port: number) {
    this._host = host
    this._port = port
  }

  private async _initialize(): Promise<void> {
    const db = Database.getInstance()

    try {
      await db.authenticate()
      if (!fs.existsSync('./myS3DATA')) {
        await fs.mkdirSync('./myS3DATA')
        mlog('Folder myS3DATA created', 'success')
      }
    } catch (err) {
      mlog(err.message, 'error')
      process.exit(-1)
    }

    mlog('🤩 Database successfully authenticated', 'success')
	  this._app = express()
	  
	  this._app.use(cors());


    this._app.use(passport.initialize())
    this._app.use(bodyParser.json())
    this._app.use(bodyParser.urlencoded({ extended: true }))
    this._app.use('/api', api)
  }

  public async run(): Promise<void> {
    await this._initialize()

    this._app?.listen(this._port, () => {
      mlog(`🤠 Server is listening on ${this._host}:${this._port}`)
    })
  }
}
