import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Certificate DApp',
  description: 'Issue and verify blockchain certificates with the power of Stacks',
  keywords: ['blockchain', 'certificates', 'stacks', 'web3', 'verification'],
  authors: [{ name: 'Certificate DApp Team' }],
  openGraph: {
    title: 'Certificate DApp',
    description: 'Issue and verify blockchain certificates with the power of Stacks',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Certificate DApp',
    description: 'Issue and verify blockchain certificates with the power of Stacks',
  },
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#7c3aed',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/logo.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#7c3aed" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <div id="root">
          {children}
        </div>
      </body>
    </html>
  )
}