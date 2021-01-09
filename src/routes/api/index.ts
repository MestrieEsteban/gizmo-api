/**
 * If your routes are in the secured folder, a token will have to be sent to access the route
 */

import { Router, Request, Response } from 'express'
import auth from './authenticate'
import secured from './secured/index'
import passport from 'passport'


export const argv: string[] = process.argv.slice(2)


const api = Router()

api.get('/', (req: Request, res: Response) => {
  res.json({
    hello: ' Api',
    meta: {
      status: 'running',
      version: '1.0.0',
    },
  })
})

api.use('/authenticate', auth) 
api.use('/', passport.authenticate('jwt', { session: false }), secured)

/**
 *
 * /api
 * /api/authenticate/signin
 * /api/authenticate/signup
 * /api/users/[:id] GET | POST | PUT | DELETE
 * /api/users/:userId/posts/[:id] GET | POST | PUT | DELETE
 *
 */
export default api
