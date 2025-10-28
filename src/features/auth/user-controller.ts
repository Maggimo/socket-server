import { Request, Response, NextFunction } from 'express'
import { LogInUser, LogOut, RefreshTokens, SaveNewUserToDB } from './auth'

class UserAuthController {
	async registration(req: Request, res: Response, next: NextFunction) {
		try {
			const tokens = await SaveNewUserToDB(req.body)
			res.cookie('refreshToken', tokens.refreshToken,
				{maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'lax'})
			return res.json(tokens.accessToken)
		} catch (e) {
			next(e)
		}
	}

	async login(req: Request, res: Response, next: NextFunction) {
		LogInUser(req.body).then(response => {
			const tokens = response
			res.cookie('refreshToken', tokens.refreshToken,
				{maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'lax'})
			return res.json(tokens.accessToken)
		}).catch(e => {
			res.status(404)
			return next(e)
		})
	}

	async logout(req: Request, res: Response) {
		try {
			const {name} = req.body
			await LogOut(name)
			return res.json({message: 'ok'})
		} finally {
		}
	}

	async refresh(req: Request, res: Response, next: NextFunction) {
		try {
			const {refreshToken} = req.cookies
			const updatedUser = await RefreshTokens(refreshToken)
			if (!updatedUser) {
				res.status(404)
				return next(new Error('Session expired. Please log in again'))
			}
			res.cookie('refreshToken', updatedUser.refreshToken,
				{maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'lax'})
			return res.json(updatedUser.accessToken)
		} catch (e) {
			res.status(500)
			return next(new Error('Failed to refresh tokens'))
		}
	}
}

export const userController = new UserAuthController()
