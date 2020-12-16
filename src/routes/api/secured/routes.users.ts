import { Router, Request, Response } from 'express'

import User from '@/core/models/User'
import { error } from '@/core/helpers/response'
import { BAD_REQUEST, CREATED } from '@/core/constants/api'

const api = Router()

api.get('/:uuid', async (req: Request, res: Response) => {
  try {
    const { uuid } = req.params
    const user = await User.findOne({ id: uuid })
    res.status(CREATED.status).json(user)
  } catch (err) {
    res.status(BAD_REQUEST.status).json(error(BAD_REQUEST, err))
  }
})

api.put('/:uuid', async (req: Request, res: Response) => {
  const { uuid } = req.params
  const { nickname, email, password } = req.body
  const user = await User.findOne({ id: uuid })
  if (user) {
    user.nickname = nickname
    user.email = email
    user.password = password
    try {
      await user.save()
      res.status(CREATED.status).json('User modified')
    } catch (err) {
      res.send(err)
    }
  } else {
    res.status(BAD_REQUEST.status).json(error(BAD_REQUEST, new Error('User not existing')))
  }
})

api.delete('/:uuid', async (req: Request, res: Response) => {
  const { uuid } = req.params
  const user = await User.findOne({ id: uuid })
  if (user) {
    try {
      await user.remove()
      res.status(CREATED.status).json('User is remove')
    } catch (err) {
      res.send(err)
    }
  } else {
    res.status(BAD_REQUEST.status).json(error(BAD_REQUEST, new Error('User not existing')))
  }
})

export default api
