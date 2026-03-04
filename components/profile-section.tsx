import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { siteConfig } from "@/lib/site"

export default function ProfileSection() {
  return (
    <Card className="relative overflow-hidden border-[#E8E5E0]/15 bg-[#111111]/70">
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-45"
        style={{ backgroundImage: "url('/media/laguna.jpeg')" }}
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/62 via-[#0A0A0A]/72 to-[#0A0A0A]/86" aria-hidden="true" />
      <CardContent className="relative z-10 p-6">
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
          <div className="relative h-32 w-32 overflow-hidden rounded-full border border-[#E8E5E0]/20">
            <img src="/media/headshot.JPG" alt="Cole Hoffman headshot" className="h-full w-full object-cover object-center" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="font-display text-4xl mb-2">{siteConfig.shortName}</h1>
            <p className="text-[#d2ccc3] mb-4">Contrarian | Builder | Investor</p>
            <p className="mb-4 max-w-2xl text-[#d2ccc3]">
              Life&apos;s like poker, you don&apos;t pick your hand, you just learn to play it better. I invest, I build,
              and I believe the best lessons are usually the oldest ones. Always working towards something bigger.
            </p>
            <div className="flex flex-wrap gap-6 justify-center md:justify-start">
              <Link href="/resume" className="group relative inline-flex items-center text-xs uppercase tracking-[0.2em] text-[#C45A3C] transition-colors hover:text-[#E8E5E0]">
                <span className="nav-shutter nav-glitch-word" data-text="Resume">Resume</span>
                <span className="absolute -bottom-1 left-0 h-[2px] w-0 rounded-full bg-[#C45A3C] transition-all duration-300 group-hover:w-full" />
              </Link>
              <Link href={siteConfig.links.email} className="group relative inline-flex items-center text-xs uppercase tracking-[0.2em] text-[#d2ccc3] transition-colors hover:text-[#E8E5E0]">
                <span className="nav-shutter nav-glitch-word" data-text="Contact">Contact</span>
                <span className="absolute -bottom-1 left-0 h-[2px] w-0 rounded-full bg-[#C45A3C] transition-all duration-300 group-hover:w-full" />
              </Link>
              <Link href={siteConfig.links.github} target="_blank" rel="noopener noreferrer" className="group relative inline-flex items-center text-xs uppercase tracking-[0.2em] text-[#d2ccc3] transition-colors hover:text-[#E8E5E0]">
                <span className="nav-shutter nav-glitch-word" data-text="GitHub">GitHub</span>
                <span className="absolute -bottom-1 left-0 h-[2px] w-0 rounded-full bg-[#C45A3C] transition-all duration-300 group-hover:w-full" />
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
