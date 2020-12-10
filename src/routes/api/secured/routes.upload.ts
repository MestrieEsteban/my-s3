import { Request, Response, Router } from 'express'
import multer from 'multer'
const path = require('path')

import fs from 'fs'
import { error } from '@/core/helpers/response'
import { BAD_REQUEST, CREATED } from '@/core/constants/api'
import Bucket from '@/core/models/Bucket'
import Blob from '@/core/models/Blob'

const api = Router()

const upload = multer({
  storage: multer.diskStorage({
    destination: async (req, file, callback) => {
      const { uuid, id } = req.params
      const bucket = await Bucket.findOne({
        where: { bucketId: id },
      })
      if (bucket) {
        const pathBlob = `./myS3DATA/${uuid}/${bucket.bucketName}`
        callback(null, pathBlob)
      }
    },
    filename: (req, file, callback) => {
      callback(null, file.originalname)
    },
  }),
})
api.post('/blob/:uuid/:id', upload.single('file'), async (req: Request, res: Response) => {
  const { uuid, id } = req.params
  const bucket = await Bucket.findOne({
    where: { bucketId: id },
  })
  if (bucket) {
    const extension: string = path.extname(req.file.filename).substr(1)
    const file: string = req.file.filename.substr(0, req.file.filename.length - extension.length - 1)

    const pathBlob = `./myS3DATA/${uuid}/${bucket.bucketName}`
    const blob = new Blob()
    blob.blobName = file
    blob.blobPath = pathBlob + '/' + req.file.filename
    blob.bucketId = req.params.id
    blob.blobSize = req.file.size
    blob.blobExt = extension
    try {
      await blob.save()
      res.status(CREATED.status).json(req.file)
    } catch (error) {
      res.status(BAD_REQUEST.status).json(error(BAD_REQUEST, error))
    }
  }
})

api.post('/:uuid/buckets', async (req: Request, res: Response) => {
  const { bucketName } = req.body
  const { uuid } = req.params

  const dir = `./myS3DATA/${uuid}/${bucketName}/`
  const b = await Bucket.findOne({ bucketName, uuid })
  if (b) {
    res.status(BAD_REQUEST.status).json(error(BAD_REQUEST, new Error('Bucket already existing')))
  } else {
    fs.mkdirSync(dir)
    const bucket = new Bucket()
    bucket.bucketName = bucketName
    bucket.bucketPath = dir
    bucket.uuid = uuid
    try {
      await bucket.save()
      res.status(CREATED.status).json('Bucket created')
    } catch (error) {
      res.status(BAD_REQUEST.status).json(error(BAD_REQUEST, error))
    }
  }
})

api.put('/buckets/:id', async (req: Request, res: Response) => {
  const { id } = req.params
  const { newBucketName } = req.body
  const bucket = await Bucket.findOne({
    where: { bucketId: id },
  })
  if (bucket) {
    try {
      fs.renameSync(`./myS3DATA/${bucket.uuid}/${bucket.bucketName}`, `./myS3DATA/${bucket.uuid}/${newBucketName}`)
    } catch (err) {
      res.send(err)
    }

    bucket.bucketName = newBucketName
    try {
      await bucket.save()
      res.status(CREATED.status).json('Bucket updated')
    } catch (error) {
      res.status(BAD_REQUEST.status).json(error(BAD_REQUEST, error))
    }
  } else {
    res.status(BAD_REQUEST.status).json(error(BAD_REQUEST, new Error('Bucket not existing')))
  }
})

api.delete('/buckets/:id', async (req: Request, res: Response) => {
  const { id } = req.params
  const bucket = await Bucket.findOne({
    where: { bucketId: id },
  })
  if (bucket) {
    try {
      fs.rmdirSync(`./myS3DATA/${bucket.uuid}/${bucket.bucketName}`, { recursive: true })
    } catch (err) {
      res.send(err)
    }

    try {
      await bucket.remove()
      res.status(CREATED.status).json('Bucket removed')
    } catch (error) {
      res.status(BAD_REQUEST.status).json(error(BAD_REQUEST, error))
    }
  } else {
    res.status(BAD_REQUEST.status).json(error(BAD_REQUEST, new Error('Bucket not existing')))
  }
})
api.head('/buckets/:id', async (req: Request, res: Response) => {
  const { id } = req.params
  const bucket = await Bucket.findOne({
    where: { bucketId: id },
  })
  bucket ? res.send(200) : res.send(400)
})

api.get('/:user_uuid/buckets', async (req: Request, res: Response) => {
  const { user_uuid } = req.params
  const bucket = await Bucket.find({
    where: { uuid: user_uuid },
  })
  if (bucket) {
    res.status(CREATED.status).json(bucket)
  } else {
    res.status(BAD_REQUEST.status).json(error(BAD_REQUEST, new Error('Buckets not existing')))
  }
})

api.get('/buckets/:bucket_id/blobs', async (req: Request, res: Response) => {
  const { bucket_id } = req.params
  const blob = await Blob.find({
    where: { bucketId: bucket_id },
  })
  if (blob) {
    res.status(CREATED.status).json(blob)
  } else {
    res.status(BAD_REQUEST.status).json(error(BAD_REQUEST, new Error('Blobs not existing')))
  }
})

api.delete('/blobs/:id', async (req: Request, res: Response) => {
  const { id } = req.params
  const blob = await Blob.findOne({
    where: { blobId: id },
  })
  if (blob) {
    try {
      fs.unlinkSync(blob.blobPath)
      blob.remove()
      res.status(CREATED.status).json('blob removed')
    } catch (error) {
      res.send(error)
    }
  } else {
    res.status(BAD_REQUEST.status).json(error(BAD_REQUEST, new Error('Blobs not existing')))
  }
})

api.copy('/blobs/:id', async (req: Request, res: Response) => {
  const { id } = req.params
  const blob: Blob | undefined = await Blob.findOne({
    where: { blobId: id },
  })
  if (blob) {
    const allBlobByName = await Blob.find({
      where: { blobName: blob.blobName },
    })
    const count = allBlobByName ? allBlobByName.length : 0
    const newBlob: Blob = new Blob()
    const extension = `.copy.${count}.${blob.blobExt}`
    const b = await Bucket.findOne({ where: { bucketId: blob.bucketId } })
    if (b) {
      const path = `${b.bucketPath}${blob.blobName}`
      newBlob.blobName = blob.blobName
      newBlob.blobExt = extension
      newBlob.blobSize = blob.blobSize
      newBlob.bucketId = blob.bucketId
      newBlob.blobPath = path + extension
      await newBlob.save()
      try {
        fs.copyFileSync(path + '.' + blob.blobExt, path + extension, fs.constants.COPYFILE_EXCL)
        res.status(CREATED.status).json('Copy created')
      } catch (err) {
        res.send(err)
      }
    }
  }
})

api.get('/blobs/:id', async (req: Request, res: Response) => {
  const { id } = req.params
  const blob: Blob | undefined = await Blob.findOne({
    where: { blobId: id },
  })
  if (blob) {
    res.download(blob.blobPath)
  }
})

export default api
