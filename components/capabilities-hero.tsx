"use client"

import Link from "next/link"
import FoldSection from "@/components/fold-section"
import { siteConfig } from "@/lib/site"

const HERO_VIDEO_MOV = "/media/61E606B0-0305-446B-B6A6-63273C36021B.mov"
const HERO_VIDEO_MP4 = "/media/video.mp4"
const HERO_VIDEO_M4V = "/media/hero-video.m4v"

export default function CapabilitiesHero() {
  return (
    <section className="relative overflow-hidden border-b border-[#E8E5E0]/10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_22%_12%,rgba(196,90,60,0.18),transparent_36%),linear-gradient(180deg,rgba(10,10,10,0.08)_0%,rgba(10,10,10,0.2)_44%,rgba(10,10,10,0.8)_100%)]" />

      <div className="container relative min-h-[175vh] py-10 md:min-h-[188vh] md:py-16">
        <FoldSection index={0} preset="aggressive" className="fold-cascade mt-[84vh] md:mt-[90vh]">
          <div className="relative overflow-hidden rounded-[2rem] border border-[#E8E5E0]/20 bg-[#0A0A0A]/78 shadow-[0_22px_56px_rgba(0,0,0,0.45)]">
            <video
              className="absolute inset-0 h-full w-full object-cover"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              poster="/references/koenigsegg_mesh.png"
              aria-hidden="true"
            >
              <source src={HERO_VIDEO_MP4} type="video/mp4" />
              <source src={HERO_VIDEO_M4V} type="video/x-m4v" />
              <source src={HERO_VIDEO_MOV} type="video/quicktime" />
            </video>

            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,0.24)_0%,rgba(10,10,10,0.56)_58%,rgba(10,10,10,0.88)_100%)]" />

            <div className="relative px-6 py-8 md:px-10 md:py-12">
              <h1 className="font-display mt-6 max-w-4xl text-5xl leading-[0.9] text-[#E8E5E0] md:text-7xl">
                Stategy, Systems, Execution
              </h1>
              <div className="mt-8 flex flex-wrap gap-6">
                <Link
                  href={siteConfig.links.cal}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative inline-flex items-center text-xs uppercase tracking-[0.2em] text-[#C45A3C] transition-colors hover:text-[#E8E5E0]"
                >
                  <span className="nav-shutter nav-glitch-word" data-text="Book a Meeting">Book a Meeting</span>
                  <span className="absolute -bottom-1 left-0 h-[2px] w-0 rounded-full bg-[#C45A3C] transition-all duration-300 group-hover:w-full" />
                </Link>
                <Link
                  href="/blog"
                  className="group relative inline-flex items-center text-xs uppercase tracking-[0.2em] text-[#d2ccc3] transition-colors hover:text-[#E8E5E0]"
                >
                  <span className="nav-shutter nav-glitch-word" data-text="Explore Substack">Explore Substack</span>
                  <span className="absolute -bottom-1 left-0 h-[2px] w-0 rounded-full bg-[#C45A3C] transition-all duration-300 group-hover:w-full" />
                </Link>
                <Link
                  href="/youtube"
                  className="group relative inline-flex items-center text-xs uppercase tracking-[0.2em] text-[#d2ccc3] transition-colors hover:text-[#E8E5E0]"
                >
                  <span className="nav-shutter nav-glitch-word" data-text="Watch Videos">Watch Videos</span>
                  <span className="absolute -bottom-1 left-0 h-[2px] w-0 rounded-full bg-[#C45A3C] transition-all duration-300 group-hover:w-full" />
                </Link>
              </div>
            </div>
          </div>
        </FoldSection>
      </div>
    </section>
  )
}
