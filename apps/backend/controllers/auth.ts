import type { Response } from 'express'
import { OAuth2Client } from 'google-auth-library'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { AuthError } from '../lib/error'
import { handle } from '../lib/handle'
import { validate } from '../lib/validate'
import { prisma } from '../prisma/client'

const googleAuthClient = new OAuth2Client({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: `${process.env.BASE_URL}/auth/google/callback`,
})

const googleRedirect = handle(({ res }) => {
  const url = googleAuthClient.generateAuthUrl({ scope: 'openid' })
  res.redirect(url)
})

const googleCallback = handle(async ({ req, res }) => {
  const code = validate(req.query.code, z.string())

  const { tokens } = await googleAuthClient.getToken(code)
  googleAuthClient.setCredentials(tokens)

  if (!tokens.id_token) {
    throw new AuthError('missing id_token', 401)
  }

  const ticket = await googleAuthClient.verifyIdToken({
    idToken: tokens.id_token,
  })
  const payload = ticket.getPayload()

  if (!payload) {
    throw new AuthError('missing payload', 401)
  }

  const user = await findOrCreateUser(payload.sub)

  await tokenResponse({ id: user.id, res })
})

const findOrCreateUser = async (sub: string) => {
  const user = await prisma.user.findUnique({
    where: { googleSub: sub },
  })

  if (user) {
    return user
  }

  return await prisma.user.create({
    data: {
      googleSub: sub,
      statistics: {},
    },
  })
}

const hashToken = (token: string) => {
  const hasher = new Bun.CryptoHasher('sha256')
  hasher.update(token)
  return hasher.digest('hex')
}

const tokenResponse = async ({ id, res }: { id: string; res: Response }) => {
  const accessToken = jwt.sign(
    { id, jwtid: Bun.randomUUIDv7() },
    process.env.ACCESS_TOKEN_SECRET!,
    {
      expiresIn: '15m',
    },
  )

  const refreshToken = jwt.sign(
    { id, jwtid: Bun.randomUUIDv7() },
    process.env.REFRESH_TOKEN_SECRET!,
    {
      expiresIn: '7d',
    },
  )

  const hashedRefreshToken = hashToken(refreshToken)
  await prisma.refreshToken.create({
    data: { tokenHash: hashedRefreshToken, userId: id },
  })

  res.cookie('access-token', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 15 * 60 * 1000, // 15 minutes
  })
  res.cookie('refresh-token', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  })

  res.status(200).send()
}

const refreshToken = handle(async ({ req, res }) => {
  const refreshToken = validate(
    req.cookies['refresh-token'],
    z.string(),
    'return',
  )

  if (!refreshToken) {
    throw new AuthError('refresh token missing', 401)
  }

  const tokenHash = hashToken(refreshToken)

  if (
    !(await prisma.refreshToken.findUnique({
      where: { tokenHash },
    }))
  ) {
    throw new AuthError('refresh token not found', 401)
  }

  let decodedToken

  try {
    decodedToken = jwt.verify(refreshToken, Bun.env.REFRESH_TOKEN_SECRET!)
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'invalid refresh token'

    throw new AuthError(message, 401)
  }

  const { id } = validate(decodedToken, z.object({ id: z.string() }))

  await prisma.refreshToken.delete({ where: { tokenHash } })
  await tokenResponse({ id, res })
})

export const auth = {
  google: {
    redirect: googleRedirect,
    callback: googleCallback,
  },
  refreshToken,
}
