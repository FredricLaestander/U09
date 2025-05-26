import type { z } from 'zod'
import { ValidationError } from './error'

export const validate = <T>(value: unknown, schema: z.Schema<T>) => {
  const { success, error, data } = schema.safeParse(value)

  if (!success) {
    throw new ValidationError(error)
  }

  return data
}
