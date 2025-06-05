import { useState } from 'react'
import { useNavigate } from 'react-router'
import { z } from 'zod'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { useToast } from '../components/Toaster'
import { useAuth } from '../hooks/useAuth'
import { updateUsername } from '../lib/requests'

const usernameSchema = z
  .string()
  .min(3)
  .max(32)
  .regex(/^[a-zA-Z0-9._-]+$/)
  .trim()

export const PersonalizeAccountPage = () => {
  const navigate = useNavigate()
  const toast = useToast()
  const { user } = useAuth()

  const [username, setUsername] = useState('')
  const [usernameError, setUsernameError] = useState<string | null>(null)

  const validateUsername = () => {
    const { error } = usernameSchema.safeParse(username)
    if (error) {
      setUsernameError(error.errors[0].message)
    } else {
      setUsernameError(null)
    }
  }

  return (
    <main className="flex max-w-sm grow px-4 pt-40 pb-8 md:pb-20">
      <form
        onSubmit={async (event) => {
          event.preventDefault()

          validateUsername()
          if (usernameError) return

          const { success, error } = await updateUsername(username)

          if (success) {
            navigate('/')
          } else {
            toast.error(error)
          }
        }}
        className="flex grow flex-col justify-between md:items-end"
      >
        <div className="flex flex-col gap-8">
          <h1 className="text-2xl">
            Welcome{' '}
            <span className="font-bold">{user.givenName || 'gambler'}</span>,
            please pick you username!
          </h1>
          <Input
            value={username}
            onChange={(event) => {
              setUsername(event.target.value)
            }}
            onBlur={() => {
              validateUsername()
            }}
            label="Username"
            error={usernameError}
          />
        </div>
        <Button>Save username</Button>
      </form>
    </main>
  )
}
