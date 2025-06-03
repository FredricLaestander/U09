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

const authenticateUrl = `${process.env.FRONTEND_URL}/authenticate`

const googleCallback = handle(async ({ req, res }) => {
  try {
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

    await setTokens({ id: user.id, res })
    res.redirect(authenticateUrl)
  } catch (error) {
    const message = encodeURIComponent(
      error instanceof Error ? error.message : 'authentication failed',
    )
    res.redirect(`${authenticateUrl}?error=${message}`)
  }
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

const accessTokenOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  maxAge: 15 * 60 * 1000, // 15 minutes
}

const refreshTokenOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
}

const setTokens = async ({ id, res }: { id: string; res: Response }) => {
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

  res.cookie('access-token', accessToken, accessTokenOptions)
  res.cookie('refresh-token', refreshToken, refreshTokenOptions)
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

  await setTokens({ id, res })
  res.status(200).json({ message: 'token cookies have been set' })
})

const logOut = handle(
  async ({ req, res }) => {
    const rawToken = validate(
      req.cookies['refresh-token'],
      z.string(),
      'return',
    )

    if (rawToken) {
      const tokenHash = hashToken(rawToken)
      await prisma.refreshToken.delete({ where: { tokenHash } })
    }

    res.clearCookie('access-token', accessTokenOptions)
    res.clearCookie('refresh-token', refreshTokenOptions)

    res.status(200).json({ message: 'user logged out' })
  },
  { authenticate: true },
)

export const auth = {
  google: {
    redirect: googleRedirect,
    callback: googleCallback,
  },
  refreshToken,
  logOut,
}
