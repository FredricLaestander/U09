import { Link, Navigate, useSearchParams } from 'react-router'
import { Button } from '../components/Button'
import { Logo } from '../components/Logo'
import { useUser } from '../hooks/useAuth'

export const AuthenticatePage = () => {
  const { data: user } = useUser()
  const [searchParams] = useSearchParams()
  const error = searchParams.get('error')

  if (user) {
    return <Navigate to="/" />
  }

  return (
    <main className="flex grow flex-col items-center justify-center gap-6">
      <Logo text />
      <Button as={Link} to={`${import.meta.env.VITE_BACKEND_URL}/auth/google`}>
        <img src="/google.svg" alt="Google logo" />
        Continue with Google
      </Button>
      {error && <span className="text-sm text-red">{error}</span>}
    </main>
  )
}
