import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: '字有意思 · 四年级语文', description: '跟着课文学字，把每个意思真正读懂。', icons: { icon: '/favicon.svg' } };
export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}
