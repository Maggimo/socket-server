interface User {
	name: string
}

interface Room {
	roomName: string
	password: string
	users: User[]
}

let rooms: Room[] = []

const createRoom = (room: Room) => {
	rooms.push(room)
}

const addUser = (userName: string, password: string | undefined, roomName: string) => {
	const searchedRoomIndex = findRoom(roomName)
	const isPasswordCorrect = rooms[searchedRoomIndex]?.password === password
	if (!rooms || !isPasswordCorrect || searchedRoomIndex === -1) return
	rooms = rooms.map(
		room => room.roomName === roomName ? {
			...room, users: [...room.users, {name: userName},
			],
		} : room)

	return {user: userName}
}

const findUser = (userName: string, roomName: string) => {
	const searchedRoomIndex = findRoom(roomName)
	if (searchedRoomIndex === -1 || !rooms) return
	return rooms[searchedRoomIndex]?.users.find((u: User) => u.name === userName)
}
const findRoom = (roomName: string) => {
	return rooms.findIndex(r => r.roomName === roomName)
}

const removeUser = (userName: string, roomName: string) => {
	const userToRemove = findUser(userName, roomName)
	if (!userToRemove) return
	const searchedRoomIndex = findRoom(roomName)
	const searchedUsersArray = rooms[searchedRoomIndex]?.users
	searchedUsersArray?.splice(searchedUsersArray.indexOf(userToRemove), 1)
	getUserCount(roomName)
}

const getUserCount = (roomName: string) => {
	const searchedRoomIndex = findRoom(roomName)
	return rooms[searchedRoomIndex]?.users.length
}

const getRoomsList = (): Room[] => {
	return rooms.map(room => ({
		roomName: room.roomName,
		password: room.password ?? '',
		users: room.users,
	}))
}

export { createRoom, addUser, findUser, removeUser, getUserCount, getRoomsList, findRoom }


