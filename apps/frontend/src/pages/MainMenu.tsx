import { Link } from 'react-router'
import { Button } from '../components/Button'
import { Face } from '../components/Face'
import { Logo } from '../components/Logo'

export const MainMenuPage = () => {
  return (
    <main className="flex h-full grow flex-col items-center justify-center gap-8 px-4">
      <div className="flex items-center gap-4">
        <Logo text />
        <Face suit="heart" value="jack" />
      </div>
      <nav className="flex w-full flex-col gap-3">
        <Button as={Link} to="/game" variant="blue">
          Play
        </Button>
        <Button as={Link} to="/profile">
          Profile
        </Button>
      </nav>
    </main>
  )
}
