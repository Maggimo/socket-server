import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export const VerifyAccessToken = (req: Request, res: Response, next: NextFunction) => {
	const authorizationHeader = req.headers.authorization
	if (!authorizationHeader) {
		return next(new Error(
			'Authorization header is not provided', {cause: 'auth'},
		))
	}
	const accessToken = authorizationHeader.split(' ')[1]
	if (!accessToken) {
		res.status(401)
		return next(new Error('Token is not provided', {cause: 'auth'}))
	}
	try {
		const decodedAccessToken = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET!)
	} catch (e) {
		res.status(401)
		return next(new Error('Access token is invalid', {cause: 'auth'}))
	}
	next()
}

export const VerifyRefreshToken = (req: Request, res: Response, next: NextFunction) => {
	const {refreshToken} = req.cookies
	try {
		const decodedRefreshToken = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!)
	} catch (e) {
		res.status(401)
		return next(new Error('Refresh token is invalid', {cause: 'auth'}))
	}
	next()
}
