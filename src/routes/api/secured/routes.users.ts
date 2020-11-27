import { Router, Request, Response } from 'express'

import User from '@/core/models/User'
import { error, success } from '@/core/helpers/response'
import { BAD_REQUEST, CREATED } from '@/core/constants/api'

const api = Router()

api.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const user = await User.findOne(id, { relations: ['levelId', 'mealId', 'goalId'] })

    res.status(CREATED.status).json(success(user))
  } catch (err) {
    res.status(BAD_REQUEST.status).json(error(BAD_REQUEST, err))
  }
})

export default api
