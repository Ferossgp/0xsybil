import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '0xSybil',
  description: '0xSybil is a decentralized protocol for sybil detection.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="flex min-h-screen flex-col items-center justify-between p-6">
          <div className="flex flex-col flex-1 w-full bg-white rounded-3xl shadow-sm p-6">
            {children}
          </div>
        </main>
      </body>
    </html>
  )
}
