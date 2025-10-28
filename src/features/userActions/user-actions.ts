// import { NextFunction, Request, Response } from 'express'
// import { SaveNewUserToDB } from '../auth/auth'
//
// class UserActionsController {
//
// 	async uploadAvatar(req: Request, res: Response, next: NextFunction) {
// 		try {
// 			const userWithTokens = await SaveNewUserToDB(req.body)
// 			res.cookie('refreshToken', userWithTokens.refreshToken,
// 				{maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'lax'})
// 			return res.json(userWithTokens)
// 		} catch (e) {
// 			next(e)
// 		}
// 	}
// }
