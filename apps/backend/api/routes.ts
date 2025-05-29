import { Router } from 'express'
import { auth as authController } from '../controllers/auth'
import { user } from '../controllers/user'

const auth = Router()
auth.get('/google', authController.google.redirect)
auth.get('/google/callback', authController.google.callback)
auth.delete('/log-out', (_, res) => {
  res.send('delete log out')
})

const users = Router()
users.get('/me', user.getMe)
users.put('/me', user.update)
users.delete('/me', (_, res) => {
  res.send('delete me')
})

const statistics = Router()
statistics.put('/', (_, res) => {
  res.send('put statistics')
})

export const router = Router()
router.use('/auth', auth)
router.use('/users', users)
router.use('/statistics', statistics)
