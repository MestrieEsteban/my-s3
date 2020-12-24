import { Request, Response, Router } from 'express'
const path = require('path')

import fs from 'fs'
import { error } from '@/core/helpers/response'
import { BAD_REQUEST, CREATED } from '@/core/constants/api'
import Bucket from '@/core/models/Bucket'
import Blob from '@/core/models/Blob'

import multer from 'multer'
import AWS from 'aws-sdk'
const multerS3 = require('multer-s3')

AWS.config.update({
  accessKeyId: process.env.accessKeyId,
  secretAccessKey: process.env.secretAccessKey,
  region: 'eu-west-3',
  signatureVersion: 'v4'
})
const s3 = new AWS.S3()

const api = Router()

async function deleteBlobs(blobs: any): Promise<void> {
  blobs.forEach(async (element) => {
    const blob = await Blob.findOne({
      where: { blobId: element.blobId },
    })
    const bucket = await Bucket.findOne({ where: { id: blob?.bucketId } })
    if (blob && bucket) {
      try {
        const params = {
          Bucket: 'my-s3-efrei',
          Key: `${bucket.uuid}/${bucket.awsBucketName}/${blob.blobName}.${blob.blobExt}`,
        }
        s3.deleteObject(params, function (err, data) {
          if (err) console.log(err, err.stack)
          else console.log(data)
        })
        blob.remove()
      } catch (error) {}
    }
  })
}

const cloudStorage = multerS3({
  s3: s3,
  bucket: 'my-s3-efrei',
  acl: 'public-read',
  metadata: async (req, file, callback) => {
    callback(null, { fieldname: file.fieldname })
  },
  key: async (req, file, callback) => {
    const { uuid, id } = req.params
    const bucket = await Bucket.findOne({
      where: { bucketId: id },
    })
    if (bucket) {
      const newFileName = `${uuid}/${bucket.awsBucketName}/${file.originalname}`
      callback(null, newFileName)
    }
  },
})
const upload = multer({
  storage: cloudStorage,
})

api.post('/blob/:uuid/:id', upload.single('file'), async (req: Request, res: Response) => {
  const { id } = req.params
  const bucket = await Bucket.findOne({
    where: { bucketId: id },
  })
  if (bucket) {
    const extension: string = path.extname(req.file.originalname).substr(1)
    const file: string = req.file.originalname.substr(0, req.file.originalname.length - extension.length - 1)
    const blob = new Blob()
    blob.blobName = file
    blob.blobPath = req.file.location
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
  const { bucketName, bucketColor } = req.body
  const { uuid } = req.params

  const params = {
    Bucket: 'my-s3-efrei',
    Key: `${uuid}/${bucketName}/`,
    ACL: 'public-read',
    Body: 'body does not matter',
  }
  s3.upload(params, async function (err: any, data: any) {
    if (err) {
      console.log('Error creating the folder: ', err)
    } else {
      const b = await Bucket.findOne({ bucketName, uuid })
      if (b) {
        res.status(BAD_REQUEST.status).json(error(BAD_REQUEST, new Error('Bucket already existing')))
      } else {
        const bucket = new Bucket()
        bucket.bucketName = bucketName
        bucket.awsBucketName = bucketName
        bucket.bucketPath = data.Location
		bucket.uuid = uuid
		if (bucketColor == 'red') {
			bucket.bgColor = '#FEEEEE'
			bucket.textColor = '#DC3545'
			bucket.typeColor = 'danger'
		} else if (bucketColor == 'blue'){
			bucket.bgColor = '#EEF7FE'
			bucket.textColor = '#007BFF'
			bucket.typeColor = 'primary'
		} else if (bucketColor == 'yellow'){
			bucket.bgColor = '#FFFBEC'
			bucket.textColor = '#ffc107'
			bucket.typeColor = 'warning'
		}
        try {
          await bucket.save()
          res.status(CREATED.status).json('Bucket created')
        } catch (error) {
          res.status(BAD_REQUEST.status).json(error(BAD_REQUEST, error))
        }
      }
    }
  })
})

api.put('/buckets/:id', async (req: Request, res: Response) => {
  const { id } = req.params
  const { newBucketName } = req.body
  const bucket = await Bucket.findOne({
    where: { bucketId: id },
  })
  if (bucket) {
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
  const blobs = await Blob.find({ where: { bucketId: id } })
  await deleteBlobs(blobs)
  if (bucket) {
    try {
      const params = {
        Bucket: 'my-s3-efrei',
        Key: `${bucket.uuid}/${bucket.awsBucketName}/`,
      }
      s3.deleteObject(params, function (err, data) {
        if (err) console.log(err, err.stack)
        else console.log(data)
      })
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
  const bucket = await Bucket.findOne({ where: { id: blob?.bucketId } })
  if (blob && bucket) {
    try {
      const params = {
        Bucket: 'my-s3-efrei',
        Key: `${bucket.uuid}/${bucket.awsBucketName}/${blob.blobName}.${blob.blobExt}`,
      }
      s3.deleteObject(params, function (err, data) {
        if (err) console.log(err, err.stack)
        else console.log(data)
      })
      blob.remove()
      res.status(CREATED.status).json('blob removed')
    } catch (error) {
      res.send(error)
    }
  } else {
    res.status(BAD_REQUEST.status).json(error(BAD_REQUEST, new Error('Blobs not existing')))
  }
})

api.get('/blobs/:id/copy', async (req: Request, res: Response) => {
	console.log('oui');
	const { id } = req.params
	const blob: Blob | undefined = await Blob.findOne({
		where: { blobId: id },
	})
	const bucket: Bucket | undefined = await Bucket.findOne({
		where: {bucketId: blob?.bucketId}
	})
	if (blob && bucket) {
		const allBlobByName = await Blob.find({
			where: { blobName: blob.blobName },
		})
		const count = allBlobByName ? allBlobByName.length : 0
		const newBlob: Blob = new Blob()
		const extension = `.copy.${count}.${blob.blobExt}`
		const b = await Bucket.findOne({ where: { bucketId: blob.bucketId } })
		if (b) {
			newBlob.blobName = blob.blobName
			newBlob.blobExt  = extension
			newBlob.blobSize = blob.blobSize
			newBlob.bucketId = blob.bucketId
			newBlob.blobPath = `https://my-s3-efrei.s3.eu-west-3.amazonaws.com/${bucket.uuid}/${bucket.awsBucketName}/${blob.blobName}${extension}`
			await newBlob.save()
			try {
				var params = {
					Bucket: "my-s3-efrei",
					CopySource: `my-s3-efrei/${bucket.uuid}/${bucket.awsBucketName}/${blob.blobName}.${blob.blobExt}`,
					Key: `${bucket.uuid}/${bucket.awsBucketName}/${blob.blobName}${extension}`,
					ACL: 'public-read',
				};
				s3.copyObject(params, function (err, data) {
					if (err) console.log(err, err.stack);
					else console.log(data);      
				});
				res.status(CREATED.status).json('Copy created')
			} catch (err) {
				res.send(err)
			}
		}
	}
})

// api.post('/blobs/:id/copy', async (req: Request, res: Response) => {	
//   const { id } = req.params
//   const blob: Blob | undefined = await Blob.findOne({
//     where: { blobId: id },
//   })
//   if (blob) {
//     const allBlobByName = await Blob.find({
//       where: { blobName: blob.blobName },
//     })
//     const count = allBlobByName ? allBlobByName.length : 0
//     const newBlob: Blob = new Blob()
//     const extension = `.copy.${count}.${blob.blobExt}`
//     const b = await Bucket.findOne({ where: { bucketId: blob.bucketId } })
//     if (b) {
//       const path = `${b.bucketPath}${blob.blobName}`
//       newBlob.blobName = blob.blobName
//       newBlob.blobExt = extension
//       newBlob.blobSize = blob.blobSize
//       newBlob.bucketId = blob.bucketId
//       newBlob.blobPath = path + extension
//       await newBlob.save()
//       try {
//         // fs.copyFileSync(path + '.' + blob.blobExt, path + extension, fs.constants.COPYFILE_EXCL)
//         res.status(CREATED.status).json('Copy created')
//       } catch (err) {
//         res.send(err)
//       }
//     }
//   }
// })

api.get('/blobs/:id', async (req: Request, res: Response) => {
  const { id } = req.params
  const blob: Blob | undefined = await Blob.findOne({
    where: { blobId: id },
  })
  if (blob) {
    const getParams = {
      Bucket: 'my-s3-efrei',
      Key: '',
    }
    s3.getObject(getParams, function (err, data) {
      res.send(data)
    })
  }
})

api.get('/blobs/:id/share', async (req: Request, res: Response) => {
  const { id } = req.params
	const blob: Blob | undefined = await Blob.findOne({
		where: { blobId: id },
	})
	const bucket: Bucket | undefined = await Bucket.findOne({
		where: { bucketId: blob?.bucketId }
	})
	if (blob && bucket) {
		const url = s3.getSignedUrl('getObject', {
			Bucket: 'my-s3-efrei',
			Key: `${bucket.uuid}/${bucket.awsBucketName}/${blob.blobName}.${blob.blobExt}`,
			Expires: 10,
		});
   		res.send(url)
  }
})

export default api
