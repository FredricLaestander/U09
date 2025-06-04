import { Link } from 'react-router'
import { Button } from '../components/Button'
import { Face } from '../components/Face'
import { Header } from '../components/Header'
import { Logo } from '../components/Logo'

export const LandingPage = () => {
  return (
    <>
      <Header>
        <Logo />
        <Button as={Link} to="/authenticate">
          Log in
        </Button>
      </Header>

      <main className="flex w-full grow flex-col items-center justify-center">
        <img
          src="/landing-background.svg"
          alt=""
          className="absolute top-3/4 -z-10 h-1/4 w-full object-cover"
        />
        <div className="flex w-full max-w-3xl grow flex-col items-center justify-end gap-8 px-6 md:gap-0">
          <Logo
            text
            size="lg"
            classname="md:absolute md:top-1/2 md:-translate-y-1/2"
          />
          <div className="flex w-full justify-between pb-[20vh]">
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
            className="absolute bottom-1/10 md:bottom-1/5"
          >
            Play now!
          </Button>
        </div>
      </main>
    </>
  )
}
