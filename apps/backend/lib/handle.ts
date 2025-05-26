import type { NextFunction, Request, Response } from 'express'
import { handleError } from './error'

type Callback = ({
  req,
  res,
  next,
}: {
  req: Request
  res: Response
  next: NextFunction
}) => Promise<void> | void

export const handle = (callback: Callback) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await callback({ req, res, next })
    } catch (error) {
      handleError({ error, res })
    }
  }
}
