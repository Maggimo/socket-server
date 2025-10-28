import { server } from '../app'

const PORT = Number(process.env.PORT) || 3000
const HOST = process.env.HOST || '127.0.0.1'

export const startServer = () => {
	server.listen(PORT, HOST, () => {
		console.log('Server started on port 3000')
	})
}
