import { Router, Request, Response } from 'express'

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
