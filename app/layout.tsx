import { Analytics } from '@vercel/analytics/next'
import { Be_Vietnam_Pro, Libre_Bodoni, Geist_Mono } from 'next/font/google'
import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import './globals.css'

const vietnamese = Be_Vietnam_Pro({ subsets: ['latin', 'vietnamese'], weight: ['400', '600', '700'], variable: '--font-vietnamese' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })

// Sử dụng Libre Bodoni: Nét thanh nét đậm y hệt DM Serif nhưng hỗ trợ tiếng Việt hoàn hảo
const libreBodoni = Libre_Bodoni({ 
  subsets: ['latin', 'vietnamese'], 
  weight: ['400', '500', '600', '700'], 
  variable: '--font-serif'
})

export const metadata: Metadata = {
  title: 'Sắc Nùng – Một miền văn hóa',
  description: 'Khám phá trang phục, ẩm thực, phong tục và đời sống tinh thần dân tộc Nùng.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
    ],
  },
}

export const viewport: Viewport = {
  themeColor: '#1A222D', // Cập nhật màu theme trên điện thoại thành Navy Đậm
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html 
      lang="vi" 
      suppressHydrationWarning 
      className={`${vietnamese.variable} ${geistMono.variable} ${libreBodoni.variable}`}
    >
      <body 
        // Thay đổi bg-[#071510] thành bg-[#1A222D] (Navy Đậm)
        // Thay đổi text-[#f4eee2] thành text-[#EAE5D9] (Kem Trắng)
        className="font-sans antialiased bg-[#1A222D] text-[#EAE5D9]" 
        suppressHydrationWarning
      >
        <Script src="https://unpkg.com/ml5@0.12.2/dist/ml5.min.js" strategy="beforeInteractive" />
        
        {children}
        <Analytics />
      </body>
    </html>
  )
}