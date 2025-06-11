import { isAxiosError } from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { z } from 'zod'
import { BackButton } from '../components/BackButton'
import { Button } from '../components/Button'
import { Header } from '../components/Header'
import { Input } from '../components/Input'
import { useToast } from '../components/Toaster'
import { useAuth } from '../hooks/useAuth'
import { deleteUser, updateUsername } from '../lib/requests'
import { queryClient } from '../providers/QueryClientProvider'

const usernameSchema = z
  .string()
  .min(3)
  .max(32)
  .regex(/^[a-zA-Z0-9._-]+$/)
  .trim()

export const EditProfilePage = () => {
  const navigate = useNavigate()
  const toast = useToast()
  const { user } = useAuth()

  const [username, setUsername] = useState(user.username || '')
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
    <>
      <Header>
        <BackButton />
        <h2 className="absolute w-full text-center text-2xl font-black">
          Edit profile
        </h2>
      </Header>
      <main className="flex w-full grow flex-col items-center px-4">
        <form
          action="submit"
          onSubmit={async (event) => {
            event.preventDefault()

            validateUsername()
            if (usernameError) return

            const { success, error } = await updateUsername(username)

            if (success) {
              await queryClient.invalidateQueries({ queryKey: ['user'] })
              navigate('/profile')
            } else {
              toast.error(error)
            }
          }}
          className="flex w-full grow flex-col justify-between pt-40 pb-20 md:max-w-sm"
        >
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
          <div className="flex flex-col gap-3 md:flex-row md:justify-end">
            <Button
              type="button"
              variant="red"
              size="md"
              onClick={async () => {
                try {
                  await deleteUser()
                  queryClient.invalidateQueries({ queryKey: ['user'] })
                  navigate('/')
                } catch (error) {
                  const message = isAxiosError(error)
                    ? error.response?.data.message
                    : 'something went wrong when logging out'

                  toast.error(message)
                }
              }}
            >
              Delete account
            </Button>
            <Button size="md">Save</Button>
          </div>
        </form>
      </main>
    </>
  )
}
