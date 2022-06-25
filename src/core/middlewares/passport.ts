import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

dotenv.config()

passport.use(
	new LocalStrategy(
		{
			usernameField: 'email',
			passwordField: 'motDePasse',
		},
		async (email, password, next) => {
			try {
				const user = await prisma.user.findUnique({
					where: {
						email
					}
				})

				if (!user) {
					next(`Sorry email ${email} dosen't exist`, null)
					return
				}

				if (!checkPassword(password, user.encryptedPassword)) {
					next(`Sorry password is incorrect`, null)
					return
				}

				next(null, user)
			} catch (err: any) {
				next(err.message)
			}
		}
	)
)

passport.use(
	new JwtStrategy(
		{
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: process.env.JWT_ENCRYPTION as string,
		},
		async (jwtPayload, next) => {
			try {
				const { id } = jwtPayload

				const user = await prisma.user.findUnique({
					where: {
						id
					}
				})

				if (!user) {
					next(`User ${id} doesn't exist`)
					return
				}

				next(null, user)
			} catch (err: any) {
				console.log(err)

				next(err.message)
			}
		}
	)
)

function checkPassword(uncryptedPassword: string, encryptedPassword: string): boolean {
	return bcrypt.compareSync(uncryptedPassword, encryptedPassword)
}