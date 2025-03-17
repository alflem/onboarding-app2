import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'OnboardingApp',
  description: 'Created by AlbinF',
  generator: 'AlbinF',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
