import { Request, Response } from 'express'
import { isEmpty } from 'lodash'
import jwt from 'jsonwebtoken'
import passport from 'passport'
import bcrypt from 'bcryptjs'

import { PrismaClient } from '@prisma/client'
import { missings } from '@/core/libs/utils'
import { BAD_REQUEST, CREATED, OK } from '../core/constants/api'

const prisma = new PrismaClient()


class AuthController {
	static async signup(req: Request, res: Response): Promise<Response> {
		let fields: Array<string> = ['email', 'password', 'passwordConfirmation', 'firstname', 'lastname'];
		try {
			missings(fields, req);
			const { email, password, passwordConfirmation, firstname, lastname } = req.body

			if (password !== passwordConfirmation) {
				throw "Password doesn't match"
			}
			let encryptedPassword = bcrypt.hashSync(password, 8)
			const user = await prisma.user.create({
				data: {
					email,
					encryptedPassword,
					firstname,
					lastname
				}
			})

			const payload = { id: user.id, email }
			const token = jwt.sign(payload, process.env.JWT_ENCRYPTION as string)
			return res.status(CREATED.status).json({ user, token })
		} catch (errorMessage: any) {
			if (errorMessage.meta) {
				return res.status(BAD_REQUEST.status).json({ error: 'Email already exists' })
			}
			return res.status(BAD_REQUEST.status).json({ "error": errorMessage })
		}
	}
	static async signin(req: Request, res: Response): Promise<Response | undefined> {
		const fields: Array<string> = ['email', 'motDePasse'];
		try {
			missings(fields, req);
			const authenticate = passport.authenticate('local', { session: false }, (errorMessage, user) => {
				if (errorMessage) {
					return res.status(OK.status).json({ "error": errorMessage })
				}
				const payload = { id: user.id, firstname: user.firstname }
				const token = jwt.sign(payload, process.env.JWT_ENCRYPTION as string)

				return res.status(CREATED.status).json({ user, token })
			})
			authenticate(req, res)

		} catch (errorMessage) {
			return res.status(BAD_REQUEST.status).json({ "error": errorMessage })
		}
	}
}
export default AuthController
