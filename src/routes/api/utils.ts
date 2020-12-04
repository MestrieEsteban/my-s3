/* eslint-disable prettier/prettier */
import { Router, Request, Response } from 'express'
import { isEmpty } from 'lodash'
import User from '@/core/models/User'
import { CREATED } from '@/core/constants/api'

const sendMail = require('../../core/fixtures/template_mail')

const api = Router()

api.post('/resetpassword', async (req: Request, res : Response) => {

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
		const token = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 20)
		user.resetToken = token
		await User.save(user)
		sendMail.mailRestPassword(email, token)
		res.status(CREATED.status).json('Mail sended')

	}
})

api.post('/passToken', async (req: Request, res: Response) => {

	const fields = ['resettoken', 'password']

	try {
		const missings = fields.filter((field: string) => !req.body[field])

		if (!isEmpty(missings)) {
			const isPlural = missings.length > 1
			throw new Error(`Field${isPlural ? 's' : ''} [ ${missings.join(', ')} ] ${isPlural ? 'are' : 'is'} missing`)
		}
	} catch (err) {
		console.log(err)
	}
	const { password, resettoken } = req.body	
	const user = await User.findOne({ resetToken: resettoken })

	if (user) {
		user.password = password
		await User.save(user)
		res.status(CREATED.status).json('password updated')
	}
})

export default api