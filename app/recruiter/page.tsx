import type { Metadata } from "next"
import Link from "next/link"
import { siteConfig } from "@/lib/site"

export const metadata: Metadata = {
  title: `Recruiter-Safe | ${siteConfig.shortName}`,
  description:
    "Low-complexity, recruiter-safe overview of Cole Hoffman with resume links and core experience highlights.",
}

const resumeLinks = [
  {
    label: "Forward Deployed / Founding Engineer Resume",
    href: "/content/resume_fde_se_csh.pdf",
  },
  {
    label: "Quant / ML Systems Resume",
    href: "/content/resume_qde_csh.pdf",
  },
]

const highlights = [
  "$50M+ annual alpha opportunity tied to internal MBS prepayment modeling",
  "28K products forecasted across 36 brands through rebuilt forecasting infrastructure",
  "Production-style GenAI and RAG systems shipped for internal research and PM workflows",
  "Experience spanning data engineering, ML engineering, product execution, and stakeholder-facing delivery",
]

const roles = [
  "Senior Applied AI Engineer / Tech Lead, Vanguard (2024 to present)",
  "Applied AI Engineer, Vanguard (2023 to 2024)",
  "Full-Stack Engineer, Vanguard (2022 to 2023)",
  "Machine Learning Engineer, Vanguard (2022)",
  "Data Engineer, Vanguard (2021 to 2022)",
]

export default function RecruiterPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-10 text-[#E8E5E0] md:px-8 md:py-14">
      <div className="space-y-8">
        <header className="space-y-4 border-b border-white/10 pb-8">
          <p className="text-xs uppercase tracking-[0.2em] text-[#C45A3C]">Recruiter-Safe Version</p>
          <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">Cole Hoffman</h1>
          <p className="max-w-3xl text-base leading-7 text-[#d2ccc3] md:text-lg">
            Forward deployed applied AI engineer focused on ambiguous, high-stakes problems across AI systems,
            research enablement, product delivery, and technical leadership.
          </p>
          <p className="max-w-3xl text-sm leading-6 text-[#d2ccc3]">
            This page is intentionally simple for locked-down corporate browsers. If your environment blocks the
            main site or renders it poorly, use this page or the direct PDF resume links below.
          </p>
        </header>

        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#C45A3C]">Resume Links</h2>
          <ul className="space-y-2">
            {resumeLinks.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base text-[#E8E5E0] underline underline-offset-4 hover:text-[#C45A3C]"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#C45A3C]">Selected Highlights</h2>
          <ul className="space-y-2 text-sm leading-6 text-[#d2ccc3] md:text-base">
            {highlights.map((item) => (
              <li key={item}>- {item}</li>
            ))}
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#C45A3C]">Recent Roles</h2>
          <ul className="space-y-2 text-sm leading-6 text-[#d2ccc3] md:text-base">
            {roles.map((role) => (
              <li key={role}>- {role}</li>
            ))}
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#C45A3C]">Links</h2>
          <ul className="space-y-2 text-sm leading-6 text-[#d2ccc3] md:text-base">
            <li>
              LinkedIn:{" "}
              <a
                href={siteConfig.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 hover:text-[#C45A3C]"
              >
                {siteConfig.links.linkedin}
              </a>
            </li>
            <li>
              GitHub:{" "}
              <a
                href={siteConfig.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 hover:text-[#C45A3C]"
              >
                {siteConfig.links.github}
              </a>
            </li>
            <li>
              Substack:{" "}
              <a href="/blog" className="underline underline-offset-4 hover:text-[#C45A3C]">
                /blog
              </a>
            </li>
            <li>
              Full work page:{" "}
              <Link href="/resume" className="underline underline-offset-4 hover:text-[#C45A3C]">
                /resume
              </Link>
            </li>
          </ul>
        </section>
      </div>
    </div>
  )
}
