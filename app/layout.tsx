import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import Script from 'next/script'
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
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "tzsebm8lb5");
          `}
        </Script>
      </body>
    </html>
  )
}
