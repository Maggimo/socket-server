import express, { ErrorRequestHandler } from 'express'
import * as http from 'node:http'
import cors from 'cors'
import { router } from './route'
import cookieParser from 'cookie-parser'

const app = express()

const errorHandler: ErrorRequestHandler = (err, req, res, _) => {
	const status = res.statusCode !== 200 ? res.statusCode : 500
	return res.status(status).json({
		message: err.message || 'Internal Server Error',
		cause: (err).cause || null,
	})
}

app.use(express.json())
app.use(cookieParser())
app.use(cors({origin: 'http://127.0.0.1:5173', credentials: true}))
app.use('/api', router)
app.use(errorHandler)

export const server = http.createServer(app)

