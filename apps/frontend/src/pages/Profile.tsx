import { Link } from 'react-router'
import { BackButton } from '../components/BackButton'
import { Button } from '../components/Button'
import { StatisticCard } from '../components/StatisticCard'
import { useAuth } from '../hooks/useAuth'

export const ProfilePage = () => {
  const { user, logOut } = useAuth()

  // TODO: this should never happen because of the route protection
  // check if there is a way make the types aware of this
  if (!user) {
    return null
  }

  return (
    <>
      <header className="fixed inset-x-0 px-4 py-6 md:p-8">
        <BackButton />
      </header>
      <main className="flex w-full max-w-3xl grow flex-col gap-12 px-4 pt-40">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <h2 className="text-2xl font-black">{user.username}</h2>
          <div className="flex gap-3">
            <Button onClick={logOut}>Log out</Button>
            <Button as={Link} to="/edit-profile">
              Edit
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-2 md:flex-row md:gap-6 md:*:flex-1">
          <StatisticCard
            name="Longest streak"
            illustration="fire"
            value={String(user.statistics.longestStreak)}
          />
          <StatisticCard
            name="Wins"
            illustration="crown"
            value={String(user.statistics.wins)}
          />
          <StatisticCard
            name="Losses"
            illustration="cloud"
            value={String(user.statistics.losses)}
          />
        </div>
      </main>
    </>
  )
}
