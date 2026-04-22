import fs from 'fs'
import path from 'path'
import multer from 'multer'

const recipesUploadDir = path.join(process.cwd(), 'uploads', 'recipes')
fs.mkdirSync(recipesUploadDir, { recursive: true })

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, recipesUploadDir),
  filename: (_req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_')
    cb(null, `${Date.now()}-${safeName}`)
  },
})

function imageFileFilter(_req, file, cb) {
  if (!file.mimetype.startsWith('image/')) {
    cb(new Error('Only image files are allowed.'))
    return
  }

  cb(null, true)
}

export const uploadRecipeImage = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
})
