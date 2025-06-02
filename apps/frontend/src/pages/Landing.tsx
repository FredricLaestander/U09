import { Link } from 'react-router'
import { Button } from '../components/Button'
import { Face } from '../components/Face'
import { Logo } from '../components/Logo'

export const LandingPage = () => {
  return (
    <>
      <header className="fixed flex w-full items-center justify-between px-4 py-6 md:px-8 md:py-8">
        <Logo />
        <Button as={Link} to="/authenticate">
          Log in
        </Button>
      </header>
      <main className="flex w-full grow flex-col items-center justify-center bg-[url(/landing-background.svg)] bg-bottom bg-no-repeat 2xl:bg-[100%,auto]">
        <div className="flex w-full max-w-3xl grow flex-col items-center justify-end gap-8 px-6 md:gap-0">
          <Logo
            text
            size="lg"
            classname="md:absolute md:top-1/2 md:-translate-y-1/2"
          />
          <div className="flex w-full justify-between pb-56">
            <Face
              suit="heart"
              value="jack"
              classname="w-32 -scale-x-100 md:w-56"
            />
            <Face suit="spade" value="queen" classname="w-32 md:w-56" />
          </div>
          <Button
            as={Link}
            to="/authenticate"
            variant="blue"
            className="absolute bottom-40 md:bottom-54"
          >
            Play now!
          </Button>
        </div>
      </main>
    </>
  )
}
