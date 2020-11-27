/* eslint-disable prettier/prettier */
import { createConnection, getConnection, createQueryBuilder } from 'typeorm'
import { Router, Request, Response } from 'express'
import { isEmpty } from 'lodash'
import { error, success } from '../../core/helpers/response'
import { BAD_REQUEST, CREATED, OK } from '../../core/constants/api'
import jwt from 'jsonwebtoken'
import User from '@/core/models/User'

const sendMail = require('../../core/fixtures/template_mail')

import passport from 'passport'
import { match } from 'assert'

const api = Router()

api.post('/resetpassword', async (req: Request, res: Response) => {

	const fields = ['email']

	try {
		const missings = fields.filter((field: string) => !req.body[field])

		if (!isEmpty(missings)) {
			const isPlural = missings.length > 1
			throw new Error(`Field${isPlural ? 's' : ''} [ ${missings.join(', ')} ] ${isPlural ? 'are' : 'is'} missing`)
		}
	} catch (err) {
		console.log(err)
	}
	const { email } = req.body
	const user = await User.findOne({ email: email })

	if (user) {
		const random = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 20)
		
		user.resetToken = random
		console.log(user);
		User.save(user)
	}
})

export default api