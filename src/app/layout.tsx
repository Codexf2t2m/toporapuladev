import type { Metadata } from 'next'
import { Inter } from "next/font/google"
import './globals.css'
import ChatBot from '@/components/common/ChatBot'

export const metadata: Metadata = {
  title: 'AI Solutions',
  description: 'Building your ideas',
}

const inter = Inter({subsets: ["latin"], weight: ["100", "200", "300", "400", "500", "700"]})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (   
    <html lang="en">
      <body className={inter.className}>
        {children}
        <ChatBot />
      </body>
    </html>
  )
}
