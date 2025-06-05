import { z } from 'zod'
import { HandlerError } from '../lib/error'
import { handle } from '../lib/handle'
import { validate } from '../lib/validate'
import { prisma } from '../prisma/client'

const getMe = handle(
  async ({ res, userId }) => {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        username: true,
        givenName: true,
        statistics: true,
      },
    })

    res.status(200).json(user)
  },
  { authenticate: true },
)

const update = handle(
  async ({ res, req, userId }) => {
    const updateUserSchema = z.object({
      username: z
        .string()
        .min(3)
        .max(32)
        .regex(/^[a-zA-Z0-9._-]+$/)
        .trim(),
    })

    const { username } = validate(req.body, updateUserSchema)

    const existingUser = await prisma.user.findUnique({ where: { username } })
    if (existingUser) {
      throw new HandlerError('Username already taken', 400)
    }

    await prisma.user.update({ where: { id: userId }, data: { username } })

    res.status(200).json({
      message: 'username updated',
    })
  },
  { authenticate: true },
)

const deleteUser = handle(
  async ({ res, userId }) => {
    await prisma.user.delete({ where: { id: userId } })

    res.status(200).json({ message: 'user deleted' })
  },
  { authenticate: true },
)

export const user = {
  getMe,
  update,
  delete: deleteUser,
}
