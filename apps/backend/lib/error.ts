import type { Response } from 'express'
import type { ZodError } from 'zod'

export class HandlerError extends Error {
  public status: number

  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

export class NotFoundError extends Error {
  public status = 404

  constructor(message: string) {
    super(message)
  }
}

export class ValidationError {
  public status = 400
  public message: {
    _errors: string[]
  }

  constructor(error: ZodError) {
    this.message = error.format()
  }
}

export class AuthError extends Error {
  public status: 401 | 403

  constructor(message: string, status: 401 | 403) {
    super(message)
    this.status = status
  }
}

export const handleError = ({
  error,
  res,
}: {
  error: unknown
  res: Response
}) => {
  if (error instanceof AuthError) {
    console.log(error.message)
  }

  if (
    error instanceof HandlerError ||
    error instanceof NotFoundError ||
    error instanceof ValidationError ||
    error instanceof AuthError
  ) {
    return res.status(error.status).json({ message: error.message })
  }

  console.error(error instanceof Error ? error.message : 'unknown error')
  return res.status(500).json({ message: 'something went wrong' })
}
