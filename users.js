const users = []

const findUser = (user) => {
	const userName = user.name
	const userRoom = user.room
	return users.find(user => user.room === userRoom && user.name === userName)
}

const addUser = (user) => {
	const isExist = findUser(user)

	!isExist && users.push(user)

	const currentUser = isExist || user

	return {isRoomExist: !!isExist, user: currentUser}
}

const removeUser = (user) => {
	const userToRemove = findUser(user)
	users.splice(users.indexOf(userToRemove), 1)
}

const getUserCount = (room) => {
	return users.reduce((acc, user) => user.room === room ? acc + 1 : acc, 0)
}

module.exports = {addUser, findUser, removeUser, getUserCount}


