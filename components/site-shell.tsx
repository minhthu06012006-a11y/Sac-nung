'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowRight, Menu, X } from 'lucide-react'
import { useState } from 'react' // <--- Thêm lại dòng này ở đây!

const navItems = [
  { href: '/', label: 'Tìm hiểu chung' },
  { href: '/trang-phuc', label: 'Trang phục' },
]

// Cấu hình đường dẫn trỏ thẳng vào các file ảnh bạn đã bỏ trong thư mục public
export const referenceImages = {
  overview: '/ruong-bac-thang.jpg',
  people: '/khong-gian-nung.jpg',
  food: '/am-thuc-nung.jpg',
  spirit: '/trang-phuc-nung.jpg',
}

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  return <div className="min-h-screen bg-background text-foreground">
    <header className="sticky top-0 z-50 border-b border-primary/15 bg-primary text-primary-foreground">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <span>
            <span className="block font-serif text-xl leading-none">Sắc Nùng</span>
            <span className="mt-1 block font-mono text-[9px] uppercase tracking-[0.3em] text-primary-foreground/55">Một miền văn hóa</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex" aria-label="Điều hướng chính">{navItems.map((item) => <Link key={item.href} href={item.href} className={`border-b-2 py-2 text-sm ${pathname === item.href ? 'border-accent text-accent' : 'border-transparent text-primary-foreground/70 hover:text-primary-foreground'}`}>{item.label}</Link>)}</nav>
        <Link href="/thay-do" className="hidden items-center gap-2 rounded-sm border border-accent bg-accent px-5 py-3 text-sm font-bold text-accent-foreground md:flex">Thử thay đồ <ArrowRight data-icon="inline-end" /></Link>
        <button type="button" className="inline-flex size-10 items-center justify-center border border-primary-foreground/30 md:hidden" aria-label={open ? 'Đóng menu' : 'Mở menu'} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
      </div>
      {open && <nav className="flex flex-col gap-2 border-t border-primary-foreground/15 px-5 py-4 md:hidden" aria-label="Menu di động">{navItems.map((item) => <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="px-3 py-3 text-sm">{item.label}</Link>)}<Link href="/thay-do" onClick={() => setOpen(false)} className="mt-2 flex items-center justify-center gap-2 bg-accent px-5 py-3 text-sm font-bold text-accent-foreground">Thử thay đồ <ArrowRight /></Link></nav>}
    </header>{children}<footer className="bg-primary px-5 py-12 text-primary-foreground lg:px-8"><div className="mx-auto flex max-w-7xl flex-col gap-6 border-t border-primary-foreground/20 pt-6 md:flex-row md:justify-between"><div><p className="font-serif text-2xl">Sắc Nùng</p><p className="mt-2 max-w-sm text-sm leading-6 text-primary-foreground/60">Một không gian kể chuyện về con người, ký ức và bản sắc Nùng.</p></div><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary-foreground/45">Tìm hiểu · Tôn trọng · Lan tỏa</p></div></footer>
  </div>
}

export function PageFrame({ children }: { children: React.ReactNode }) { return <SiteShell><main>{children}</main></SiteShell> }
export function SectionKicker({ children }: { children: React.ReactNode }) { return <p className="mb-4 font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-accent">{children}</p> }
export function Ornament() { return <div aria-hidden="true" className="flex items-center gap-3 text-accent"><span className="h-px flex-1 bg-accent/50" /><span className="ornament-diamond" /><span className="h-px flex-1 bg-accent/50" /></div> }
export function ImageFrame({ src, alt, className = '' }: { src: string; alt: string; className?: string }) { return <figure className={`image-frame relative overflow-hidden border border-primary-foreground/20 bg-primary/20 ${className}`}><img src={src} alt={alt} referrerPolicy="no-referrer" className="absolute inset-0 size-full object-cover" /><figcaption className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary/80 to-transparent px-4 pb-3 pt-10 font-mono text-[9px] uppercase tracking-[0.12em] text-primary-foreground/75">Tư liệu hình ảnh</figcaption></figure> }
export function ArrowLink({ href, children }: { href: string; children: React.ReactNode }) { return <Link href={href} className="inline-flex items-center gap-2 border-b border-accent pb-2 text-sm font-bold text-primary hover:text-accent">{children}<ArrowRight data-icon="inline-end" /></Link> }
export function PagePattern({ children }: { children: React.ReactNode }) { return <div className="slide-pattern">{children}</div> }

export function BrandFrame({ children }: { children: React.ReactNode }) { return <div className="brand-frame">{children}</div> }

export const sourceNote = 'Ảnh tham khảo do người dùng cung cấp; nguồn lưu trữ: Thư mục cục bộ.'

export function InfoLine({ label, children }: { label: string; children: React.ReactNode }) { 
  return (
    <div className="border-t border-primary/20 py-4">
      <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-accent font-bold">{label}</p>
      {/* Sửa text-primary-foreground/80 thành text-primary để chữ hiện màu tối sắc nét trên nền sáng */}
      <p className="mt-1 text-sm leading-6 text-primary">{children}</p> 
    </div>
  ) 
}

export function ImageCredit() { return <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">{sourceNote}</p> }

export function HomeLink() { return <Link href="/" className="text-sm font-semibold text-primary hover:text-accent">← Về trang chính</Link> }

export function PrimaryButton({ href, children }: { href: string; children: React.ReactNode }) { return <Link href={href} className="inline-flex items-center gap-3 bg-accent px-6 py-4 font-bold text-accent-foreground hover:brightness-95">{children}<ArrowRight /></Link> }

export function ImageMosaic({ large, small, alt }: { large: string; small: string; alt: string }) { return <div className="image-mosaic"><img src={large} alt={alt} referrerPolicy="no-referrer" /><img src={small} alt="Chi tiết tư liệu văn hóa Nùng" referrerPolicy="no-referrer" /></div> }

export function TextQuote({ children }: { children: React.ReactNode }) { return <blockquote className="border-l-2 border-accent pl-5 font-serif text-2xl italic leading-9 text-primary">{children}</blockquote> }

export function ContentSection({ children, className = '' }: { children: React.ReactNode; className?: string }) { return <section className={`mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28 ${className}`}>{children}</section> }

export function MapLabel({ children }: { children: React.ReactNode }) { return <span className="inline-flex items-center border border-accent/50 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-accent">{children}</span> }

export function PlayDecor() { return <div className="play-decor" aria-hidden="true"><span>▶</span></div> }

export function SiteTitle({ children }: { children: React.ReactNode }) { return <h1 className="font-serif text-5xl leading-[.98] tracking-tight text-primary md:text-7xl">{children}</h1> }

export function QuoteBar({ children }: { children: React.ReactNode }) { return <div className="border-y border-accent/40 py-5 text-center font-serif text-xl italic text-primary">{children}</div> }

export function DataBadge({ children }: { children: React.ReactNode }) { return <span className="border border-primary/25 bg-background px-3 py-2 font-mono text-[9px] uppercase tracking-[0.14em] text-primary">{children}</span> }

export function DecorativeRule() { return <div className="my-8 flex items-center gap-3"><span className="h-px w-16 bg-accent" /><span className="size-2 rotate-45 border border-accent" /><span className="h-px flex-1 bg-border" /></div> }

export function Caption({ children }: { children: React.ReactNode }) { return <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">{children}</p> }

export function Numbered({ number, children }: { number: string; children: React.ReactNode }) { return <div className="flex gap-4"><span className="font-mono text-xs text-accent">{number}</span><div>{children}</div></div> }

export function AccentHeading({ children }: { children: React.ReactNode }) { return <h2 className="font-serif text-4xl leading-tight text-primary md:text-5xl">{children}</h2> }

export function Tag({ children }: { children: React.ReactNode }) { return <span className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">{children}</span> }

export function HeaderBand({ children }: { children: React.ReactNode }) { return <div className="border-y border-accent/30 bg-primary py-3 text-center font-mono text-[9px] uppercase tracking-[0.3em] text-primary-foreground/65">{children}</div> }

export function Stat({ number, label }: { number: string; label: string }) { return <div><p className="font-serif text-3xl text-accent">{number}</p><p className="mt-1 max-w-32 text-xs leading-5 text-primary-foreground/60">{label}</p></div> }

export function SlideMeta({ children }: { children: React.ReactNode }) { return <div className="flex items-center justify-between border-t border-primary-foreground/20 pt-4 font-mono text-[9px] uppercase tracking-[0.18em] text-primary-foreground/50">{children}</div> }

export function RichImage({ src, alt, className = '' }: { src: string; alt: string; className?: string }) { return <img src={src} alt={alt} referrerPolicy="no-referrer" className={`block size-full object-cover ${className}`} /> }

export function PageAnchor({ id }: { id: string }) { return <span id={id} className="scroll-mt-24" /> }

export function MetaPill({ children }: { children: React.ReactNode }) { return <span className="border-l-2 border-accent pl-3 text-xs text-muted-foreground">{children}</span> }

export function AudioHint() { return <span className="inline-flex items-center gap-2 text-xs text-muted-foreground"><span className="size-2 rounded-full bg-accent" /> Lắng nghe câu chuyện vùng cao</span> }

export function TimelineItem({ title, children }: { title: string; children: React.ReactNode }) { return <article className="relative border-l border-accent/50 pl-6"><span className="absolute -left-1.5 top-1 size-3 rotate-45 border border-accent bg-background" /><h3 className="font-serif text-2xl text-primary">{title}</h3><p className="mt-2 text-sm leading-7 text-muted-foreground">{children}</p></article> }

export function SourceFooter() { return <p className="mt-12 border-t border-border pt-4 font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">Nội dung biên soạn phục vụ mục đích giới thiệu văn hóa · Cần đối chiếu thêm với cộng đồng địa phương.</p> }