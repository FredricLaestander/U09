import { Router } from 'express'

const auth = Router()
auth.post('/register', (_, res) => {
  res.send('post register')
})
auth.post('/log-in', (_, res) => {
  res.send('post log in')
})
auth.delete('/log-out', (_, res) => {
  res.send('delete log out')
})

const users = Router()
users.get('/me', (_, res) => {
  res.send('get me')
})
users.put('/me', (_, res) => {
  res.send('put me')
})
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
