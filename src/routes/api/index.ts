import AuthController from '@/controllers/AuthController'
import { Router, Request, Response } from 'express'
import passport from 'passport'

import secured from './secured/index'

export const argv: string[] = process.argv.slice(2)

const api = Router()

api.get('/', (req: Request, res: Response) => {
  res.json({
    hello: 'Gizmo Api',
    meta: {
      status: 'running',
      version: '2.0.0',
    },
  })
})

//Users
api.post('/auth/signup', AuthController.signup)
api.post('/auth/signin', AuthController.signin)

//Secured api
api.use('/', passport.authenticate('jwt', { session: false }), secured)

export default api
