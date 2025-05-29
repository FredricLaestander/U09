import type { NextFunction, Request, Response } from 'express'
import { authenticate } from './authenticate'
import { handleError } from './error'

type Callback<Authenticate> = ({
  req,
  res,
  next,
}: {
  req: Request
  res: Response
  next: NextFunction
  userId: UserId<Authenticate>
}) => Promise<void> | void

type UserId<T> = T extends true ? string : null

export const handle = <Authenticate extends boolean = false>(
  callback: Callback<Authenticate>,
  options?: {
    authenticate?: Authenticate
  },
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = options?.authenticate
        ? await authenticate(req.cookies)
        : null

      await callback({ req, res, next, userId: userId as UserId<Authenticate> })
    } catch (error) {
      handleError({ error, res })
    }
  }
}
