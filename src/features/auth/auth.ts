import bcrypt from 'bcrypt'
import * as fs from 'fs'
import jwt, { JwtPayload } from 'jsonwebtoken'

interface User {
	name: string
	password: string
	accessToken?: string
	refreshToken?: string
}

const usersDataPath = './src/shared/database/users.json'

const generateTokens = (payload: JwtPayload) => {
	const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET!, {expiresIn: '30m'})
	const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {expiresIn: '30d'})
	return {accessToken, refreshToken}
}

const SaveNewUserToDB = async (newUser: User) => {
	const tokens = generateTokens({name: newUser.name})

	const hashedUser = {
		name: newUser.name,
		password: bcrypt.hashSync(newUser.password, 3),
		...tokens,
	}

	const users: User[] = JSON.parse(await fs.promises.readFile(usersDataPath, 'utf-8'))

	if (users.some(user => user.name === newUser.name)) {
		throw new Error('User already exists', {cause: 'user'})
	}

	users.push(hashedUser)

	await fs.promises.writeFile(usersDataPath, JSON.stringify(users, null, 2), 'utf-8')

	return {refreshToken: hashedUser.refreshToken, accessToken: hashedUser.accessToken}
}

const LogInUser = async (logInUser: User) => {
	const usersArray: User[] = JSON.parse(await fs.promises.readFile(usersDataPath, 'utf-8'))
	const userIndex = usersArray.findIndex(user => user.name === logInUser.name)
	const user = usersArray[userIndex]
	if (!user) {
		throw new Error('User doesnt exist', {cause: 'user'})
	} else if (!bcrypt.compareSync(logInUser.password, user.password)) {
		throw new Error('Wrong password', {cause: 'password'})
	} else {
		const refreshedTokens = generateTokens({name: user.name})
		usersArray[userIndex] = {...user, ...refreshedTokens}
		await fs.promises.writeFile(usersDataPath, JSON.stringify(usersArray, null, 2), 'utf-8')
		return {...refreshedTokens}
	}
}

const LogOut = async (name: string) => {
	const usersArray: User[] = JSON.parse(await fs.promises.readFile(usersDataPath, 'utf-8'))
	const newArr = usersArray.findIndex(user => user.name === name)
	if (newArr === -1) {
		throw new Error(`User doesnt exist`, {cause: 'user'})
	}
	const newUsersArray = usersArray.map(user => {
		if (user.name === name) {
			return {...user, accessToken: '', refreshToken: ''}
		} else {
			return user
		}
	})
	await fs.promises.writeFile(usersDataPath, JSON.stringify(newUsersArray, null, 2), 'utf-8')
}

const RefreshTokens = async (refreshToken: string) => {
	try {
		const usersArray: User[] = JSON.parse(await fs.promises.readFile(usersDataPath, 'utf-8').catch(() => '[]'))
		const userIndex = usersArray.findIndex(u => u.refreshToken === refreshToken)
		const user = usersArray[userIndex]!
		const tokens = generateTokens({name: user.name})
		const updatedUser = {...user, ...tokens}
		usersArray[userIndex] = updatedUser
		await fs.promises.writeFile(usersDataPath, JSON.stringify(usersArray, null, 2), 'utf-8')
		return updatedUser
	} catch (e) {}
}

export { SaveNewUserToDB, LogInUser, LogOut, RefreshTokens }
