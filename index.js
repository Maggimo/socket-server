const express = require('express')
const http = require('http')
const {Server} = require('socket.io')
const cors = require('cors')
const route = require('./route')
const {addUser, findUser} = require('./users')
const {getUserCount} = require('./users')
const {removeUser} = require('./users')

const app = express()

app.use(cors({origin: '*'}))
app.use(route)

const server = http.createServer(app)

const io = new Server(server, {
	cors: {
		origin: '*',
		methods: ['GET', 'POST', 'PUT', 'DELETE'],
	},
})
io.on('connection', (socket) => {
	socket.on('join', ({name, room}) => {
		socket.join(room)

		const {user} = addUser({name, room})

		socket.emit('message', {data: {user: {name: 'Admin'}, message: `Hey ${name}`}})

		socket.broadcast.to(user.room).
			emit('message', {data: {user: {name: 'Admin'}, message: `${user.name} has joined the room`}})

		io.to(user.room).emit('getUsersCount', {data: {usersCount: getUserCount(user.room)}})
	})

	socket.on('sendMessage', ({message, params}) => {
		const user = findUser(params)
		if (user) {
			io.to(user.room).emit('message', {data: {user, message}})
		}
	})
	socket.on('leave', ({params}) => {
		removeUser(params)
		socket.leave(params.room)
		socket.broadcast.to(params.room).
			emit('message', {data: {user: {name: 'Admin'}, message: `${params.name} has left the room`}})
		io.to(params.room).emit('getUsersCount', {data: {usersCount: getUserCount(params.room)}})
	})
	io.on('disconnect', () => {
		console.log('Client disconnected')
	})
})

server.listen(3000, () => {
	console.log('Server started on port 3000')
})

