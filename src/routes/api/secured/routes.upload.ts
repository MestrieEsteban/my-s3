import { Router, Request, Response } from 'express'
import multer from 'multer'
const path = require('path')

import fs from 'fs'
import { success } from '@/core/helpers/response'
import { CREATED } from '@/core/constants/api'

const api = Router()
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
  try {
    fs.mkdirSync(`./upload/${uuid}/${bucketName}`)
    res.send('Bucket created')
  } catch (err) {
    res.send(err)
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
  const { uuid, bucketName } = req.body
  const dir = `./upload/${uuid}`
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

api.delete('/deleteFile', (req, res) => {
  const { uuid, bucketName, fileName } = req.body
  try {
    fs.unlinkSync(`./upload/${uuid}/${bucketName}/${fileName}`)
    res.send('file deleted')
  } catch (err) {
    res.send(err)
  }
})

api.head('/verifBucket', (req, res) => {
  const { uuid, bucketName } = req.body
  const dir = `./upload/${uuid}/${bucketName}/`
  if (fs.existsSync(dir)) {
    res.send(200)
  } else {
    res.send(400)
  }
})

api.copy('/copyBlob', (req, res) => {
  const { uuid, bucketName, fileName } = req.body
  const dir = `./upload/${uuid}/${bucketName}/`
  fs.existsSync(dir) ? res.send(200) : res.send(400)
})

api.get('/downloadBlob', (req, res) => {
  const id = req.user ? req.user?.id : 0
  console.log(id)
  const { uuid, bucketName, fileName } = req.body
  const dir = `./upload/${uuid}/${bucketName}/${fileName}`
  res.download(dir)
})

export default api
