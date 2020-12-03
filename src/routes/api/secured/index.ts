import { Router } from 'express'
import users from './routes.users'
import upload from './routes.upload'

const api = Router()

api.use('/users', users)
api.use('/upload', upload)

export default api
