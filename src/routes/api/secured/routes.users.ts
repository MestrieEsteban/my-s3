import { Router, Request, Response } from 'express'

import User from '@/core/models/User'
import { error, success } from '@/core/helpers/response'
import { BAD_REQUEST, CREATED } from '@/core/constants/api'

const api = Router()

api.get('/getId', async (req: Request, res: Response) => {
  try {
    const { email } = req.body

    const user = await User.findOne({ email })
    const id = user?.id

    res.status(CREATED.status).json(id)
  } catch (err) {
    res.status(BAD_REQUEST.status).json(error(BAD_REQUEST, err))
  }
})

export default api
