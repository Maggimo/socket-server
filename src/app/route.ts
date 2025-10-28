import express from 'express'
import { userController } from '../features'
import { VerifyAccessToken, VerifyRefreshToken } from '../features/auth/auth-middleware'

const router = express.Router()

router.post('/registration', userController.registration)

router.post('/login', userController.login)

router.post('/logout', VerifyAccessToken, userController.logout)

// const upload = multer({dest: 'uploads/'})

// router.post('/upload', upload.single('document'), (req, res) => {
// 	// req.file содержит информацию о загруженном файле
// 	console.log(req.file)
//
// 	// req.body содержит любые текстовые поля
// 	console.log(req.body)
//
// 	res.send('File uploaded successfully')
// })

// router.post('/upload_avatar', userController.uploadAvatar)

router.get('/refresh', VerifyRefreshToken, userController.refresh)

export { router }
