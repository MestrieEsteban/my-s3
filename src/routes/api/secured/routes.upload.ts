import { Router, Request, Response } from 'express'
import multer from 'multer'
const path = require('path')

import fs from 'fs'
import { error, success } from '@/core/helpers/response'
import { BAD_REQUEST, CREATED, OK } from '@/core/constants/api'

const api = Router()

function itExist(dir: string): boolean {
  if (fs.existsSync(dir)) {
    return true
  } else {
    return false
  }
}
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, callback) => {
      const { uuid, bucketName } = req.params
      const path = `./upload/${uuid}/${bucketName}`
      callback(null, path)
    },
    filename: (req, file, callback) => {
      //originalname is the uploaded file's name with extn
      callback(null, file.originalname)
    },
  }),
})
api.post('/uploadFile/:uuid/:bucketName', upload.single('file'), (req, res) => {
  try {
    res.send(req.file)
  } catch (err) {
    res.send(err)
  }
})

api.post('/createBucket', (req, res) => {
  const { uuid, bucketName } = req.body
  const dir = `./upload/${uuid}/${bucketName}/`
  if (!itExist(dir)) {
    fs.mkdirSync(dir)
    res.status(CREATED.status).json('Bucket created')
  } else {
    res.status(BAD_REQUEST.status).json(error(BAD_REQUEST, new Error('Bucket already existing')))
  }
})

api.put('/updateBucket', (req, res) => {
  const { uuid, bucketName, newBucketName } = req.body
  try {
    fs.renameSync(`./upload/${uuid}/${bucketName}`, `./upload/${uuid}/${newBucketName}`)
    res.send('Bucket Updated')
  } catch (err) {
    res.send(err)
  }
})

api.delete('/deleteBucket', (req, res) => {
  const { uuid, bucketName } = req.body
  try {
    fs.rmdirSync(`./upload/${uuid}/${bucketName}`, { recursive: true })
    res.send('Bucket deleted')
  } catch (err) {
    res.send(err)
  }
})

api.get('/getBlob', (req, res) => {
  const { uuid, bucketName } = req.body
  const dir = `./upload/${uuid}/${bucketName}/`
  const allFiles: any[][] = []
  try {
    const files = fs.readdirSync(dir)
    files.forEach((file) => {
      const fileStats = fs.statSync(dir + file)
      allFiles.push([file, fileStats.birthtime, fileStats.size, path.extname(dir + file).substr(1), dir + file])
    })
    res.status(CREATED.status).json(allFiles)
  } catch (err) {
    console.log(err)
  }
})

api.get('/getBucket', (req, res) => {
  const { uuid } = req.body
  const dir = `./upload/${uuid}`
  const allFiles: any[][] = []
  try {
    const files = fs.readdirSync(dir)
    files.forEach((file) => {
      const fileStats = fs.statSync(dir + '/' + file)
      allFiles.push([file, fileStats.birthtime, fileStats.size, dir + '/' + file])
    })
    res.status(CREATED.status).json(allFiles)
  } catch (err) {
    console.log(err)
  }
})

api.delete('/deleteFile', (req, res) => {
  const { uuid, bucketName, fileName } = req.body
  const dir = `./upload/${uuid}/${bucketName}/${fileName}`
  try {
    fs.unlinkSync(dir)
    res.send('file deleted')
  } catch (err) {
    res.send(err)
  }
})

api.head('/verifBucket', (req, res) => {
  const { uuid, bucketName } = req.body
  const dir = `./upload/${uuid}/${bucketName}/`
  itExist(dir) ? res.send(200) : res.send(400)
})

api.copy('/copyBlob', (req, res) => {
  const { uuid, bucketName, fileName } = req.body
  const dir = `./upload/${uuid}/${bucketName}/${fileName}`
  const ext = path.extname(dir).substr(1)
  const file = fileName.substr(0, fileName.length - ext.length - 1)
  const copy = `./upload/${uuid}/${bucketName}/${file}.copy.${ext}`
  try {
    fs.copyFileSync(dir, copy, fs.constants.COPYFILE_EXCL)
    res.status(CREATED.status).json('Copy created')
  } catch (err) {
    res.send(err)
  }
})

api.get('/downloadBlob', (req, res) => {
  const { uuid, bucketName, fileName } = req.body
  const dir = `./upload/${uuid}/${bucketName}/${fileName}`
  if (itExist(dir)) {
    res.download(dir)
  } else {
    res.status(BAD_REQUEST.status).json(error(BAD_REQUEST, new Error('No such file or directory')))
  }
})
export default api
