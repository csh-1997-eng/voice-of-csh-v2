"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { siteConfig } from "@/lib/site"

const navigation = [
  { name: "Home", href: "/" },
  { name: "Substack", href: "/blog" },
  { name: "Work", href: "/resume" },
  { name: "YouTube", href: "/youtube" },
  { name: "GitHub", href: "/github" },
]

export default function Header() {
  const pathname = usePathname()
  const isRecruiterSafeRoute = pathname === "/recruiter"
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const lastY = useRef(0)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 36)
      setHidden(y > 80)
      lastY.current = y
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  if (isRecruiterSafeRoute) {
    return (
      <header className="border-b border-[#E8E5E0]/10 bg-[#0A0A0A]">
        <div className="container flex items-center justify-between gap-4 py-4">
          <Link href="/" className="text-sm font-medium tracking-[0.08em] text-[#E8E5E0]">
            Cole Hoffman
          </Link>
          <nav className="flex flex-wrap items-center gap-4 text-xs uppercase tracking-[0.14em] text-[#d2ccc3]">
            <Link href="/resume" className="hover:text-[#C45A3C]">
              Work
            </Link>
            <Link href="/blog" className="hover:text-[#C45A3C]">
              Blog
            </Link>
            <a href="/content/resume_fde_se_csh.pdf" target="_blank" rel="noopener noreferrer" className="hover:text-[#C45A3C]">
              PDF Resume
            </a>
          </nav>
        </div>
      </header>
    )
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full py-3 transition-all duration-300 ${
        scrolled ? "py-2" : "py-3"
      } ${hidden ? "-translate-y-full" : "translate-y-0"}`}
    >
      <div className="container">
        <div
          className={`flex items-center justify-between px-1 md:px-2 transition-all duration-300 ${
            scrolled ? "h-14" : "h-16"
          }`}
        >
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2.5">
              <Image
                src="/branding/masthead_logo_transparent.png"
                alt="CH monogram"
                width={760}
                height={508}
                className="h-16 w-auto shrink-0"
                priority
              />
              <div className="flex flex-col leading-[0.85]">
                <span className="font-display text-xl tracking-[0.16em] text-[#E8E5E0] md:text-2xl">COLE</span>
                <span className="font-display text-xl tracking-[0.16em] text-[#E8E5E0] md:text-2xl">HOFFMAN</span>
              </div>
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center gap-5">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group relative inline-flex items-center text-xs uppercase tracking-[0.2em] transition-colors ${
                    isActive ? "text-[#C45A3C] nav-pulse-text" : "text-[#d2ccc3] hover:text-[#E8E5E0]"
                  }`}
                >
                  <span className="nav-shutter nav-glitch-word" data-text={item.name}>
                    {item.name}
                  </span>
                  <span
                    className={`absolute -bottom-1 left-0 h-[2px] rounded-full bg-[#C45A3C] transition-all duration-300 ${
                      isActive ? "w-full nav-pulse-line" : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              )
            })}
            <Link
              href={siteConfig.links.cal}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center text-xs uppercase tracking-[0.2em] text-[#C45A3C] transition-colors hover:text-[#E8E5E0]"
            >
              <span className="nav-shutter nav-glitch-word" data-text="Book Meeting">
                Book Meeting
              </span>
              <span className="absolute -bottom-1 left-0 h-[2px] w-0 rounded-full bg-[#C45A3C] transition-all duration-300 group-hover:w-full" />
            </Link>
          </nav>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle Menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-[#E8E5E0] hover:bg-[#E8E5E0]/10"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="container pt-2">
            <div className="panel rounded-2xl p-4 space-y-3">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block text-xs uppercase tracking-[0.18em] transition-colors hover:text-[#C45A3C] ${
                    pathname === item.href ? "text-[#C45A3C]" : "text-[#d2ccc3]"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                href={siteConfig.links.cal}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-xs uppercase tracking-[0.18em] text-[#C45A3C] transition-colors hover:text-[#E8E5E0]"
              >
                Book Meeting
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
