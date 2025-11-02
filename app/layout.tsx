import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { TallyModalProvider } from "@/contexts/tally-modal-context"

const poppins = Poppins({ subsets: ['latin'], weight: ['400','500','600','700'] });

export const metadata: Metadata = {
  title: 'Nordrive',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={poppins.className + ' font-sans antialiased'}>
        <TallyModalProvider>
          {children}
        </TallyModalProvider>
        <Analytics />
      </body>
    </html>
  )
}
