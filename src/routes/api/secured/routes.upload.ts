import { Request, Response, Router } from 'express'
import multer from 'multer'
const path = require('path')

import fs from 'fs'
import { error, success } from '@/core/helpers/response'
import { BAD_REQUEST, CREATED } from '@/core/constants/api'
import Bucket from '@/core/models/Bucket'
import { addListener } from 'process'
import Blob from '@/core/models/Blob'

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
    destination: async (req, file, callback) => {
      const { uuid, id } = req.params
      const bucket = await Bucket.findOne({
        where: { bucketId: id },
      })
      if (bucket) {
        const path = `./myS3DATA/${uuid}/${bucket.bucketName}`
        callback(null, path)
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
    const path = `./myS3DATA/${uuid}/${bucket.bucketName}`
    const blob = new Blob()
    blob.blobName = req.file.originalname
    blob.blobPath = path + '/' + req.file.filename
    blob.bucketId = req.params.id
    blob.blobSize = req.file.size
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
    await fs.mkdirSync(dir)
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
      await fs.renameSync(
        `./myS3DATA/${bucket.uuid}/${bucket.bucketName}`,
        `./myS3DATA/${bucket.uuid}/${newBucketName}`
      )
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
      await fs.rmdirSync(`./myS3DATA/${bucket.uuid}/${bucket.bucketName}`, { recursive: true })
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

api.head('/verifBucket', (req: Request, res: Response) => {
  const { uuid, bucketName } = req.body
  const dir = `./myS3DATA/${uuid}/${bucketName}/`
  itExist(dir) ? res.send(200) : res.send(400)
})

api.copy('/copyBlob', (req: Request, res: Response) => {
  const { uuid, bucketName, fileName } = req.body
  const dir = `./myS3DATA/${uuid}/${bucketName}/${fileName}`
  const ext = path.extname(dir).substr(1)
  const file = fileName.substr(0, fileName.length - ext.length - 1)
  const copy = `./myS3DATA/${uuid}/${bucketName}/${file}.copy.${ext}`
  try {
    fs.copyFileSync(dir, copy, fs.constants.COPYFILE_EXCL)
    res.status(CREATED.status).json('Copy created')
  } catch (err) {
    res.send(err)
  }
})

api.get('/downloadBlob', (req: Request, res: Response) => {
  const { uuid, bucketName, fileName } = req.body
  const dir = `./myS3DATA/${uuid}/${bucketName}/${fileName}`
  if (itExist(dir)) {
    res.download(dir)
  } else {
    res.status(BAD_REQUEST.status).json(error(BAD_REQUEST, new Error('No such file or directory')))
  }
})
export default api
