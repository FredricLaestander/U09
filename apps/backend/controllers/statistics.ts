import { z } from 'zod'
import { handle } from '../lib/handle'
import { validate } from '../lib/validate'
import { prisma } from '../prisma/client'

const update = handle(
  async ({ req, res, userId }) => {
    const { outcome } = validate(
      req.body,
      z.object({ outcome: z.enum(['win', 'loss', 'tie']) }),
    )

    const statistics = (await prisma.user.findUnique({
      where: { id: userId },
    }))!.statistics

    let updates: typeof statistics
    const updatedStreak = statistics.streak + 1

    switch (outcome) {
      case 'win':
        updates = {
          ...statistics,
          wins: statistics.wins + 1,
          streak: updatedStreak,
          longestStreak:
            updatedStreak > statistics.longestStreak
              ? updatedStreak
              : statistics.longestStreak,
        }
        break
      case 'loss':
        updates = {
          ...statistics,
          losses: statistics.losses + 1,
          streak: 0,
        }
        break
      case 'tie':
        updates = {
          ...statistics,
          ties: statistics.ties + 1,
          streak: 0,
        }
        break
    }

    await prisma.user.update({
      where: { id: userId },
      data: { statistics: updates },
    })

    res.status(200).json({ message: 'user statistics updated' })
  },
  { authenticate: true },
)

export const statistics = {
  update,
}
