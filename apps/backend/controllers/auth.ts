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

  const accessToken = jwt.sign(
    { id: user.id },
    process.env.ACCESS_TOKEN_SECRET!,
    {
      expiresIn: '15m',
    },
  )

  res.cookie('access-token', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 15 * 60 * 1000, // 15 minutes
  })

  res.status(200).send()
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

export const auth = {
  google: {
    redirect: googleRedirect,
    callback: googleCallback,
  },
}
