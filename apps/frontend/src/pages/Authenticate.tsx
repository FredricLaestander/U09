import { Link, useSearchParams } from 'react-router'
import { Button } from '../components/Button'
import { Logo } from '../components/Logo'

export const AuthenticatePage = () => {
  const [searchParams] = useSearchParams()
  const error = searchParams.get('error')

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
