import ChatbotWidget from "@/components/chatbot-widget"
import RecentBlogPosts from "@/components/recent-blog-posts"
import RecentVideos from "@/components/recent-videos"
import TweetsWidget from "@/components/x-feed"
import NeuralNetworkBackground from "@/components/neural-network-background"
import CapabilitiesHero from "@/components/capabilities-hero"
import FoldSection from "@/components/fold-section"
import GitHubView from "@/components/github-view"
import ProfileSection from "@/components/profile-section"

export default function Home() {
  return (
    <div className="relative bg-[#0A0A0A] text-[#E8E5E0]">
      <NeuralNetworkBackground />
      <div className="relative z-10">
        <CapabilitiesHero />

        <section className="border-y border-[#E8E5E0]/10 bg-[#111111]/80">
          <div className="container py-16">
            <FoldSection index={1} preset="aggressive" className="fold-cascade">
              <div className="chat-materialize panel rounded-3xl px-6 py-8 md:px-8 md:py-10">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-[#C45A3C]">01</p>
                  <h2 className="font-display mt-2 text-5xl leading-none md:text-6xl">Voice of Cole</h2>
                  <p className="mt-4 max-w-xl text-sm text-[#d2ccc3]">
                    A quiet interface for high-signal dialogue across strategy, systems, and current work.
                  </p>
                </div>
                <div className="mt-6">
                  <ChatbotWidget />
                </div>
              </div>
            </FoldSection>
          </div>
        </section>

        <section className="stack-overlap container py-16 md:py-20">
          <FoldSection index={2} preset="aggressive" className="fold-cascade">
            <div>
              <div className="mb-5">
                <p className="text-xs uppercase tracking-[0.24em] text-[#C45A3C]">02</p>
                <h2 className="font-display mt-2 text-5xl leading-none md:text-6xl">X Posts</h2>
              </div>
              <div className="relative z-30 isolate rounded-2xl border border-[#E8E5E0]/18 bg-[#0B0B0B] p-4 shadow-[0_18px_44px_rgba(0,0,0,0.42)] md:p-6">
                <TweetsWidget />
              </div>
            </div>
          </FoldSection>
        </section>

        <section className="stack-overlap container py-16 md:py-20">
          <FoldSection index={3} preset="aggressive" className="fold-cascade">
            <div className="panel rounded-3xl p-6 md:p-8">
              <p className="text-xs uppercase tracking-[0.24em] text-[#C45A3C]">03</p>
              <RecentBlogPosts limit={6} />
            </div>
          </FoldSection>
        </section>

        <section className="stack-overlap container py-16 md:py-20">
          <FoldSection index={4} preset="aggressive" className="fold-cascade">
            <div className="panel rounded-3xl p-6 md:p-8">
              <p className="text-xs uppercase tracking-[0.24em] text-[#C45A3C]">04</p>
              <RecentVideos limit={6} />
            </div>
          </FoldSection>
        </section>

        <section className="stack-overlap container py-16 md:py-20">
          <FoldSection index={5} preset="aggressive" className="fold-cascade">
            <GitHubView />
          </FoldSection>
        </section>

        <section className="stack-overlap container pb-20 pt-16 md:pt-20">
          <FoldSection index={6} preset="aggressive" className="fold-cascade">
            <div>
              <div className="mb-5">
                <p className="text-xs uppercase tracking-[0.24em] text-[#C45A3C]">06</p>
                <h2 className="font-display mt-2 text-5xl leading-none md:text-6xl">About Me</h2>
              </div>
              <ProfileSection />
            </div>
          </FoldSection>
        </section>
      </div>
    </div>
  )
}
