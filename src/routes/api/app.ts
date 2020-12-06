import { Router, Request, Response } from 'express'
import auth from './authenticate'
import utils from './utils'
import secured from './secured/index'
import passport from 'passport'

const app = Router()

app.get('/', (req: Request, res: Response) => {
  res.json({
    hello: 'My-s3 Api',
    meta: {
      status: 'running',
      version: '1.0.0',
    },
  })
})
export default app
