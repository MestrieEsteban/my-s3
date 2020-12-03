import { Router, Request, Response } from 'express'
import { isEmpty } from 'lodash'
import { error, success } from '../../core/helpers/response'
import { BAD_REQUEST, CREATED, OK } from '../../core/constants/api'
import jwt from 'jsonwebtoken'
import fs from 'fs'
const sendMail = require('../../core/fixtures/template_mail')

import User from '../../core/models/User'
import passport from 'passport'

const api = Router()

api.post('/signup', async (req: Request, res: Response) => {
  const fields = ['nickname', 'email', 'password', 'passwordConfirmation']

  try {
    const missings = fields.filter((field: string) => !req.body[field])

    if (!isEmpty(missings)) {
      const isPlural = missings.length > 1
      throw new Error(`Field${isPlural ? 's' : ''} [ ${missings.join(', ')} ] ${isPlural ? 'are' : 'is'} missing`)
    }

    const { nickname, email, password, passwordConfirmation } = req.body

    if (password !== passwordConfirmation) {
      throw new Error("Password doesn't match")
    }

    const user = new User()

    user.nickname = nickname
    user.email = email
    user.password = password

    await user.save()

    const payload = { id: user.id, nickname }
    const token = jwt.sign(payload, process.env.JWT_ENCRYPTION as string)
    sendMail.mailRegister(email, nickname)
    fs.mkdirSync(`./upload/${user.id}`)
    res.status(CREATED.status).json(success(user, { token }))
  } catch (err) {
    res.status(BAD_REQUEST.status).json(error(BAD_REQUEST, err))
  }
})

api.post('/signin', async (req: Request, res: Response) => {
  const authenticate = passport.authenticate('local', { session: false }, (errorMessage, user) => {
    if (errorMessage) {
      res.status(BAD_REQUEST.status).json(error(BAD_REQUEST, new Error(errorMessage)))
      return
    }

    const payload = { id: user.id, firstname: user.firstname }
    const token = jwt.sign(payload, process.env.JWT_ENCRYPTION as string)

    res.status(OK.status).json(success(user, { token }))
  })

  authenticate(req, res)
})

export default api
