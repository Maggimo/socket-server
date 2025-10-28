import { router } from '../app/route'

export const createRoutes = () => {
	router.get('/', (_, res) => {
		res.setHeader('Access-Control-Allow-Origin', '*')
		res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
		res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')

		res.send('request send')
	})

	router.get('/public', (_, res) => {
		res.send('request send')
	})
}

