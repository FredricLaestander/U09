import type { z } from 'zod'
import { ValidationError } from './error'

// function overloads for proper return typing
export function validate<Data>(
  value: unknown,
  schema: z.Schema<Data>,
  behaviour?: 'throw',
): Data
export function validate<Data>(
  value: unknown,
  schema: z.Schema<Data>,
  behaviour?: 'return',
): Data | null

export function validate<Data>(
  value: unknown,
  schema: z.Schema<Data>,
  behaviour: 'throw' | 'return' = 'throw',
) {
  const { success, error, data } = schema.safeParse(value)

  if (!success) {
    if (behaviour === 'throw') {
      throw new ValidationError(error)
    }

    if (behaviour === 'return') {
      return null
    }
  }

  return data
}
