import type { ReactNode } from 'react'

export const Header = ({ children }: { children: ReactNode }) => {
  return (
    <header className="fixed inset-x-0 flex items-center justify-between px-4 py-6 md:p-8">
      {children}
    </header>
  )
}
