import express = require('express')
import http = require('http')
import { Server } from 'socket.io'
import cors = require('cors')
import { router } from './route'

import { addUser, findUser, createRoom, getUserCount, removeUser, getRoomsList } from './users'

const app = express()

app.use(cors({origin: '*'}))
app.use(router)

const server = http.createServer(app)

const io = new Server(server, {
	cors: {
		origin: '*',
		methods: ['GET', 'POST', 'PUT', 'DELETE'],
	},
})

io.on('connection', (socket) => {
	// we will store the current user's info on the socket for disconnect handling
	(socket.data as any) = {userName: undefined as string | undefined, roomName: undefined as string | undefined}

	socket.on('createRoom', ({roomName, password}, ack) => {
		const isRoomExist = getRoomsList().find(r => r.roomName === roomName)
		if (isRoomExist) {
			if (typeof ack === 'function') ack({message: 'Room is already exist', type: 'room'})
			return
		}
		createRoom({roomName: roomName, password, users: []})
		socket.join(roomName)
		if (typeof ack === 'function') ack(null)
	})

	socket.on('join', ({userName, roomName, password}, ack) => {
		const isRoomExist = getRoomsList().find(r => r.roomName === roomName)
		const isUserExist = findUser(userName, roomName)
		if (!isRoomExist) {
			if (typeof ack === 'function') ack({message: 'Room does not exist', type: 'room'})
			return
		}
		if (isUserExist) {
			if (typeof ack === 'function') ack({message: 'User already exists', type: 'user'})
			return
		}
		if (password && password !== isRoomExist.password) {
			if (typeof ack === 'function') ack({message: 'Wrong password', type: 'password'})
			return
		}
		socket.join(roomName)
		// save user/room to socket for later cleanup
		;(socket.data as any).userName = userName
		;(socket.data as any).roomName = roomName
		addUser(userName, password, roomName)

		socket.emit('message', {data: {userName: 'Admin', message: `Hey ${userName}`}})

		socket.broadcast.to(roomName).emit('message', {data: {userName: 'Admin', message: `${userName} has joined the room`}})

		io.to(roomName).emit('getUsersCount', {data: {usersCount: getUserCount(roomName)}})
		if (typeof ack === 'function') ack(null)
	})

	socket.on('sendMessage', ({userName, roomName, message}) => {
		const user = findUser(userName, roomName)
		if (user) {
			io.to(roomName).emit('message', {data: {userName, message}})
		}
	})

	socket.on('getRoomsList', () => {
		socket.emit('getRoomsList', {data: {roomsList: getRoomsList()}})
	})

	socket.on('leave', ({userName, roomName}) => {
		removeUser(userName, roomName)
		socket.leave(roomName)
		socket.broadcast.to(roomName).emit('message', {data: {userName: 'Admin', message: `${userName} has left the room`}})
		io.to(roomName).emit('getUsersCount', {data: {usersCount: getUserCount(roomName)}})
		// clear stored data
		;(socket.data as any).userName = undefined
		;(socket.data as any).roomName = undefined
	})

	// Handle page reloads or abrupt disconnects
	socket.on('disconnecting', () => {
		const {userName, roomName} = (socket.data as any) || {}
		if (userName && roomName) {
			removeUser(userName, roomName)
			// notify others in the room
			socket.broadcast.to(roomName).emit('message', {data: {userName: 'Admin', message: `${userName} has left the room`}})
			io.to(roomName).emit('getUsersCount', {data: {usersCount: getUserCount(roomName)}})
		}
	})

	io.on('disconnect', () => {
		console.log('Client disconnected')
	})
})

server.listen(3000, () => {
	console.log('Server started on port 3000')
})

