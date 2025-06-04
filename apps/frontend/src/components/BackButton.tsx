import { MoveLeft } from 'lucide-react'
import { useNavigate } from 'react-router'
import { Button } from './Button'

export const BackButton = () => {
  const navigate = useNavigate()

  return (
    <Button onClick={() => navigate(-1)} icon={MoveLeft} size="sm">
      Back
    </Button>
  )
}
