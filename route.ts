import express from 'express'

const router = express.Router()

router.get('/', (_, res) => {
	res.setHeader('Access-Control-Allow-Origin', '*')
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')

	res.send('request send')
})

export { router }
