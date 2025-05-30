import { z } from 'zod'
import { handle } from '../lib/handle'
import { validate } from '../lib/validate'
import { prisma } from '../prisma/client'

const getMe = handle(
  async ({ res, userId }) => {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
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

    const data = validate(req.body, updateUserSchema)
    await prisma.user.update({ where: { id: userId }, data })

    res.status(200).json({
      message: 'username updated',
    })
  },
  { authenticate: true },
)

export const user = {
  getMe,
  update,
}
