import { handle } from '../lib/handle'
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

export const user = {
  getMe,
}
