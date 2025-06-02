import type { Request } from 'express'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { prisma } from '../prisma/client'
import { AuthError } from './error'
import { validate } from './validate'

export const authenticate = async (cookies: Request['cookies']) => {
  const accessToken = validate(cookies['access-token'], z.string(), 'return')

  if (!accessToken) {
    throw new AuthError('access token missing', 401)
  }

  let decodedToken

  try {
    decodedToken = jwt.verify(accessToken, Bun.env.ACCESS_TOKEN_SECRET!)
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'invalid access token'
    throw new AuthError(message, 401)
  }

  const { id } = validate(decodedToken, z.object({ id: z.string() }))

  const user = await prisma.user.findUnique({ where: { id } })

  if (!user) {
    throw new AuthError('user does not exist', 401)
  }

  return id
}
