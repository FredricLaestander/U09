import { DialogDescription, DialogTitle } from '@radix-ui/react-dialog'
import { Link } from 'react-router'
import { useModal } from '../../hooks/useModal'
import { Button } from '../Button'
import { Face } from '../Face'
import { Logo } from '../Logo'
import { Wrapper } from './Wrapper'

export const GameMenu = () => {
  const { close } = useModal()

  return (
    <Wrapper type="game-menu" classname="flex items-center flex-col gap-8">
      <DialogTitle className="sr-only">Game menu</DialogTitle>
      <DialogDescription className="sr-only">
        Take an action or continue playing
      </DialogDescription>

      <div className="flex items-center gap-4">
        <Logo text />
        <Face suit="heart" value="jack" />
      </div>
      <nav className="flex w-full flex-col gap-3">
        <Button onClick={close} variant="blue">
          Continue playing
        </Button>
        <Button as={Link} to="/">
          Quit
        </Button>
      </nav>
    </Wrapper>
  )
}
