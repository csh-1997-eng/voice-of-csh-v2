import type { Metadata } from "next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { siteConfig } from "@/lib/site"

export const metadata: Metadata = {
  title: `Work | ${siteConfig.shortName}`,
  description: "Narrative-driven overview of Cole Hoffman's impact across quantitative systems, product execution, and technical leadership.",
}

type ResumeVariant = {
  label: string
  href: string
  blurb: string
}

type ImpactStat = {
  stat: string
  label: string
}

type CaseStudy = {
  title: string
  problem: string
  solution: string
  outcome: string
  why: string
  tags: string[]
}

type CareerStep = {
  period: string
  title: string
  team: string
  summary: string
}

const resumeVariants: ResumeVariant[] = [
  {
    label: "Forward Deployed / Founding Engineer",
    href: "/content/resume_fde_se_csh.pdf",
    blurb: "For teams that need founder-style execution, stakeholder ownership, product judgment, and technical range.",
  },
  {
    label: "Quant / ML Systems",
    href: "/content/resume_qde_csh.pdf",
    blurb: "For roles centered on research systems, quantitative modeling, MLOps, and investment infrastructure.",
  },
]

const impactStats: ImpactStat[] = [
  { stat: "$50M+", label: "Annual alpha opportunity from MBS prepayment modeling" },
  { stat: "28K", label: "Products forecasted across 36 brands" },
  { stat: "<14 days", label: "Cloneable systematic investment pipeline delivered" },
  { stat: "300x", label: "Backtesting workflow acceleration" },
  { stat: "5", label: "Concurrent internal client engagements" },
  { stat: "3", label: "Business units supported as an SME" },
]

const caseStudies: CaseStudy[] = [
  {
    title: "MBS Prepayment Modeling",
    problem: "The firm was paying for YieldBook licenses to model conditional prepayment rates.",
    solution: "Built TB scale data pipelines and ran experiments across CatBoost, XGBoost, and TensorFlow.",
    outcome: "Delivered a 20 model ensemble that beat the incumbent vendor in 18 months, tied to a $50M+ annual alpha opportunity.",
    why: "Replaced a paid external dependency with a stronger internal modeling capability tied directly to trading decisions and alpha generation.",
    tags: ["CatBoost", "XGBoost", "TensorFlow", "MLflow", "SHAP"],
  },
  {
    title: "Fund Cash Flow Forecasting",
    problem: "A custom TensorFlow and Keras model lived across five notebooks with a five day training cycle.",
    solution: "Re architected the workflow into two SageMaker pipelines for production inference and distributed backtesting, with processing rewritten in Polars.",
    outcome: "Ran 360 models in parallel, completed a full 1996 to 2024 backtest in four days, and supported forecasts across 28K products and 36 brands.",
    why: "Converted a slow research workflow into production grade infrastructure that improved speed, scale, and decision support.",
    tags: ["TensorFlow", "Keras", "SageMaker", "Polars"],
  },
  {
    title: "SEC 10 K RAG Platform",
    problem: "Portfolio managers needed a faster way to work across SEC filings by company, year, quarter, and section.",
    solution: "Built end to end EDGAR ingestion, SEC XML parsing, vector storage in Pinecone, and LLM powered retrieval with intelligent query decomposition.",
    outcome: "Handed the platform off to the ML engineering team for production scaling and drove adoption across 5+ teams.",
    why: "Turned unstructured filings into a usable research workflow and created reusable infrastructure for broader internal adoption.",
    tags: ["RAG", "Pinecone", "EDGAR", "Internal GTM"],
  },
  {
    title: "GenAI Interpretability Layer",
    problem: "Researchers were losing days to manual experiment interpretation and hypothesis review.",
    solution: "Built an agentic system that ingests evaluation metrics, SHAP outputs, pipeline code, and researcher axioms, then produces executive ready reports and structured review workflows.",
    outcome: "Improved research velocity and was adopted across a 14 person research team.",
    why: "Compressed manual interpretation work into a repeatable system that improved research speed, clarity, and team-wide consistency.",
    tags: ["AWS Bedrock", "Agentic workflows", "Interpretability", "Research enablement"],
  },
]

const careerSteps: CareerStep[] = [
  {
    period: "09/2024 to Present",
    title: "Senior Applied AI Engineer / Tech Lead",
    team: "Global Investment Systems, Vanguard",
    summary: "Now leading high ambiguity applied AI work across research, product delivery, stakeholder management, and team execution.",
  },
  {
    period: "08/2023 to 09/2024",
    title: "Applied AI Engineer",
    team: "Global Investment Systems, Vanguard",
    summary: "Shifted into internal consulting, turning research prototypes into production AI systems and stakeholder facing products.",
  },
  {
    period: "12/2022 to 08/2023",
    title: "Full-Stack Engineer",
    team: "Equity Investment Systems, Vanguard",
    summary: "Expanded into product delivery with analytics platforms and benchmark tooling for portfolio managers.",
  },
  {
    period: "04/2022 to 11/2022",
    title: "Machine Learning Engineer",
    team: "Enterprise Advice, Vanguard",
    summary: "Moved into applied ML with personalization, tax optimization, and early MLOps foundations.",
  },
  {
    period: "08/2021 to 04/2022",
    title: "Data Engineer",
    team: "Chief Data Analytics Office, Vanguard",
    summary: "Built the data foundations: enterprise ETL, metadata systems, and compliance workflows at scale.",
  },
]

const toolbox = [
  "Python",
  "SQL",
  "R",
  "TypeScript",
  "Next.js",
  "TensorFlow",
  "CatBoost",
  "XGBoost",
  "scikit-learn",
  "SHAP",
  "Time series forecasting",
  "Survival modeling",
  "Factor modeling",
  "Portfolio optimization",
  "Risk modeling",
  "SageMaker",
  "AWS Bedrock",
  "MLflow",
  "Azure OpenAI",
  "RAG",
  "Agentic workflows",
  "Pinecone",
  "Qdrant",
  "Polars",
  "Spark",
  "EMR",
  "Glue",
  "Athena",
  "S3",
  "Postgres",
  "GeoPandas",
  "Docker",
  "Terraform",
  "CI/CD",
  "Unreal Engine",
  "Blender",
]

export default function ResumePage() {
  return (
    <div className="container py-10 md:py-14">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="grid gap-6 lg:grid-cols-[1.35fr_0.95fr] lg:items-start">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.24em] text-[#C45A3C]">Work</p>
            <div className="space-y-3">
              <h1 className="max-w-4xl font-display text-4xl leading-[1.02] sm:text-5xl md:text-6xl md:leading-[1.02]">
                Forward Deployed Applied AI Engineer
              </h1>
              <p className="max-w-3xl text-lg leading-relaxed text-[#E8E5E0] md:text-xl">
                High ownership execution across ambiguous, high stakes problems spanning applied AI, product delivery, stakeholder management, and adoption.
              </p>
              <p className="max-w-3xl text-sm leading-relaxed text-[#d2ccc3] md:text-base">
                Best fit for teams that need a builder who can find the wedge, work directly with users, ship quickly, and turn early momentum into durable systems.
              </p>
            </div>
            <p className="text-sm text-[#d2ccc3]">
              For code, experiments, and side projects, visit{" "}
              <a
                href={siteConfig.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#C45A3C] underline-offset-2 hover:underline"
              >
                GitHub
              </a>
              .
            </p>
          </div>

          <Card className="border-[#E8E5E0]/15 bg-[#111111]/80">
            <CardHeader className="pb-4">
              <CardTitle className="text-xs uppercase tracking-[0.2em] text-[#C45A3C]">Resume Cuts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-2xl border border-[#E8E5E0]/12 bg-[#0A0A0A] p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-[#C45A3C]">Best fit</p>
                <p className="mt-2 text-sm leading-relaxed text-[#d2ccc3]">
                  Founding engineer, forward deployed engineer, applied AI lead, and quant ML systems roles.
                </p>
              </div>
              {resumeVariants.map((variant) => (
                <a
                  key={variant.label}
                  href={variant.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-2xl border border-[#E8E5E0]/12 bg-[#0A0A0A] p-4 transition-colors hover:border-[#C45A3C]/60"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-[#E8E5E0]">{variant.label}</p>
                      <p className="mt-1 text-xs leading-relaxed text-[#d2ccc3]">{variant.blurb}</p>
                    </div>
                    <span className="shrink-0 text-xs uppercase tracking-[0.16em] text-[#C45A3C]">Open PDF</span>
                  </div>
                </a>
              ))}
            </CardContent>
          </Card>
        </header>

        <section>
          <p className="mb-4 text-xs uppercase tracking-[0.24em] text-[#C45A3C]">Selected Impact</p>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {impactStats.map(({ stat, label }) => (
              <div key={stat + label} className="rounded-2xl border border-[#E8E5E0]/10 bg-[#111111]/70 p-4">
                <p className="mb-1 font-display text-3xl leading-none text-[#C45A3C]">{stat}</p>
                <p className="text-sm leading-snug text-[#d2ccc3]">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[#C45A3C]">Signature Systems</p>
              <h2 className="font-display mt-2 text-4xl leading-none md:text-5xl">Selected systems and outcomes.</h2>
            </div>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {caseStudies.map((study) => (
              <Card key={study.title} className="border-[#E8E5E0]/15 bg-[#111111]/70">
                <CardHeader>
                  <CardTitle className="text-xl text-[#E8E5E0]">{study.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm leading-relaxed text-[#d2ccc3]">
                  <div>
                    <p className="text-xs uppercase tracking-[0.16em] text-[#C45A3C]">Problem</p>
                    <p className="mt-1">{study.problem}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.16em] text-[#C45A3C]">Solution</p>
                    <p className="mt-1">{study.solution}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.16em] text-[#C45A3C]">Outcome</p>
                    <p className="mt-1 text-[#E8E5E0]">{study.outcome}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.16em] text-[#C45A3C]">Why it matters</p>
                    <p className="mt-1">{study.why}</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {study.tags.map((tag) => (
                      <span key={tag} className="rounded-full border border-[#E8E5E0]/15 bg-[#0A0A0A] px-2.5 py-0.5 text-xs text-[#d2ccc3]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
          <Card className="border-[#E8E5E0]/15 bg-[#111111]/70">
            <CardHeader className="pb-3">
              <CardTitle className="text-xs uppercase tracking-[0.2em] text-[#C45A3C]">Career Arc</CardTitle>
              <p className="text-sm leading-relaxed text-[#d2ccc3]">
                From data foundations to forward deployed applied AI leadership.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {careerSteps.map((step) => (
                <div key={step.period + step.title} className="border-l border-[#E8E5E0]/10 pl-4">
                  <p className="text-xs uppercase tracking-[0.14em] text-[#C45A3C]">{step.period}</p>
                  <p className="mt-1 text-sm font-semibold text-[#E8E5E0]">{step.title}</p>
                  <p className="text-sm text-[#d2ccc3]">{step.team}</p>
                  <p className="mt-1 text-sm leading-relaxed text-[#d2ccc3]">{step.summary}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-[#E8E5E0]/15 bg-[#111111]/70">
            <CardHeader>
              <CardTitle className="text-xs uppercase tracking-[0.2em] text-[#C45A3C]">Core Toolbox</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {toolbox.map((item) => (
                  <span key={item} className="rounded-full border border-[#E8E5E0]/20 bg-[#0A0A0A] px-3 py-1 text-xs text-[#d2ccc3]">
                    {item}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
