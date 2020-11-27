import { Router, Request, Response } from 'express'
import auth from './authenticate'
import utils from './utils'
import secured from './secured/index'
import passport from 'passport'
import multer from 'multer'

const api = Router()

api.get('/', (req: Request, res: Response) => {
  res.json({
    hello: 'My-s3 Api',
    meta: {
      status: 'running',
      version: '1.0.0',
    },
  })
})

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './upload')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  },
})
const upload = multer({ storage: storage })
api.post('/single', upload.single('profile'), (req, res) => {
  try {
    res.send(req.file)
  } catch (err) {
    res.send(400)
  }
})

api.use('/authenticate', auth)
api.use('/utils', utils)
api.use('/', passport.authenticate('jwt', { session: false }), secured)

/**
 *
 * /api
 * /api/authenticate/signin
 * /api/authenticate/signup
 * /api/users/[:id] GET | POST | PUT | DELETE
 * /api/users/:userId/posts/[:id] GET | POST | PUT | DELETE
 *
 */
export default api
