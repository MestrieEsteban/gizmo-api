import { Router, Request, Response } from 'express'
import { isEmpty } from 'lodash'
import { success } from '../../core/helpers/response'
import { CREATED, OK } from '../../core/constants/api'
import jwt from 'jsonwebtoken'

import User from '../../core/models/User'
import passport from 'passport'

const api = Router()

/**
 * @swagger
 * 
 * @swagger
   components:
     schemas:
       Book:
         type: object
         required:
           - title
           - author
           - finished
         properties:
           id:
             type: integer
             description: The auto-generated id of the book.
           title:
             type: string
             description: The title of your book.
           author:
             type: string
             description: Who wrote the book?
           finished:
             type: boolean
             description: Have you finished reading it?
           createdAt:
             type: string
             format: date
             description: The date of the record creation.
         example:
            title: The Pragmatic Programmer
            author: Andy Hunt / Dave Thomas
            finished: true

 * 	
 */
api.post('/signup', async (req: Request, res: Response) => {
	const fields = ['nickname', 'email', 'password', 'passwordConfirmation']

	try {
		const missings = fields.filter((field: string) => !req.body[field])

		if (!isEmpty(missings)) {
			const isPlural = missings.length > 1
			console.log(`Field${isPlural ? 's' : ''} [ ${missings.join(', ')} ] ${isPlural ? 'are' : 'is'} missing`)
			throw new Error(`Field${isPlural ? 's' : ''} [ ${missings.join(', ')} ] ${isPlural ? 'are' : 'is'} missing`)
		}

		const { nickname, email, password, passwordConfirmation } = req.body

		if (password !== passwordConfirmation) {
			throw new Error("Password doesn't match")
		}

		const user = new User()

		user.nickname = nickname
		user.email = email
		user.password = password

		await user.save()

		const payload = { id: user.id, nickname }
		const token = jwt.sign(payload, process.env.JWT_ENCRYPTION as string)
		res.status(CREATED.status).json(success(user, { token }))
	} catch (errorMessage) {
		res.send(errorMessage)
	}
})

api.post('/signin', async (req: Request, res: Response) => {
	const authenticate = passport.authenticate('local', { session: false }, (errorMessage, user) => {
		if (errorMessage) {
			res.send(errorMessage)
			return
		}

		const payload = { id: user.id, firstname: user.firstname }
		const token = jwt.sign(payload, process.env.JWT_ENCRYPTION as string)

		res.status(OK.status).json(success(user, { token }))
	})

	authenticate(req, res)
})

export default api
