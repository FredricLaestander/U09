import { useMutation } from '@tanstack/react-query'
import { useToast } from '../components/Toaster'
import { queryClient } from '../providers/QueryClientProvider'
import type { User } from '../types/data'
import { updateStatistics } from './requests'

const key = ['user']

export const useUpdateStatisticsMutation = () => {
  const toast = useToast()

  return useMutation({
    mutationFn: updateStatistics,
    onMutate: async (outcome) => {
      await queryClient.cancelQueries({ queryKey: key })

      const user = queryClient.getQueryData<User>(key)!

      queryClient.setQueryData(key, (old: User) => {
        let updates = {}

        switch (outcome) {
          case 'win':
            updates = {
              wins: old.statistics.wins + 1,
              streak: old.statistics.streak + 1,
            }
            break
          case 'loss':
            updates = {
              losses: old.statistics.losses + 1,
              streak: 0,
            }
            break
          case 'tie':
            updates = {
              ties: old.statistics.ties + 1,
              streak: 0,
            }
            break
        }

        return { ...old, statistics: { ...old.statistics, ...updates } }
      })

      return { user }
    },
    onError: (error, _, context) => {
      queryClient.setQueryData(key, context?.user)
      toast.error(error.message)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: key })
    },
  })
}
