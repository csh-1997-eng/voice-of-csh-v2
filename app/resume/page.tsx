import type { Metadata } from "next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { siteConfig } from "@/lib/site"

export const metadata: Metadata = {
  title: `Work | ${siteConfig.shortName}`,
  description: "Background, capabilities, and current focus.",
}

type Project = { name: string; desc: string; tags: string[] }
type Role = {
  title: string
  team: string
  period: string
  projects: Project[]
}

const roles: Role[] = [
  {
    title: "Senior Applied AI Engineer / Tech Lead",
    team: "Global Investment Systems, Vanguard",
    period: "09/2024 – Present",
    projects: [
      {
        name: "Mortgage Prepayment Ensemble",
        desc: "20-model pipeline (10 CatBoost + 10 Neural Nets) on TB-scale datasets; research tied to $50M+ annual alpha opportunity.",
        tags: ["CatBoost", "Neural Nets", "MLflow", "TB-scale"],
      },
      {
        name: "GenAI Interpretability Layer",
        desc: "Automatically transforms MLflow experiment outputs — explainability, metrics, researcher context — into executive-ready PDF reports.",
        tags: ["LLM", "MLflow", "Auto PDF Reports"],
      },
      {
        name: "Systematic Investment Research Pipeline",
        desc: "End-to-end research pipeline processing 2,000+ equities across 23 years of macro and fundamental data; delivered as a cloneable repo in <14 days.",
        tags: ["2,000+ equities", "23yr macro data", "Python"],
      },
      {
        name: "Agentic GenAI Research Assistant",
        desc: "Deployed research assistant improving hypothesis quality and consistency; drove adoption across a 14-person investment research team.",
        tags: ["Agentic AI", "LLM", "RAG"],
      },
      {
        name: "Tech Lead — 7-Person ML Team",
        desc: "Led architecture decisions, delivery execution, stakeholder alignment, and mentorship across a cross-functional team of ML engineers.",
        tags: ["Architecture", "Stakeholder Alignment", "Mentorship"],
      },
    ],
  },
  {
    title: "Applied AI Engineer (Internal Consulting)",
    team: "Global Investment Systems, Vanguard",
    period: "08/2023 – 09/2024",
    projects: [
      {
        name: "Demand Forecasting System",
        desc: "Predicted cash flows across 28K products and 36 brands to support multi-billion-dollar fund pricing decisions.",
        tags: ["TensorFlow", "Keras", "28K products", "36 brands"],
      },
      {
        name: "SageMaker Training & Inference Pipelines",
        desc: "Productionized end-to-end ML pipelines, reducing training runtime 7× and accelerating backtesting workflows 10×+.",
        tags: ["AWS SageMaker", "7× faster training", "10×+ backtesting"],
      },
      {
        name: "Enterprise RAG Platform",
        desc: "Built reusable retrieval-augmented generation platform enabling adoption across 5+ internal teams.",
        tags: ["AWS", "Azure OpenAI", "Pinecone"],
      },
      {
        name: "Churn Prediction Model",
        desc: "Early-warning churn model built from web engagement telemetry to support proactive client retention.",
        tags: ["Web Telemetry", "scikit-learn"],
      },
    ],
  },
  {
    title: "Full-Stack Engineer",
    team: "Equity Investment Systems, Vanguard",
    period: "12/2022 – 08/2023",
    projects: [
      {
        name: "Benchmark Analytics Platform",
        desc: "Full-stack tool enabling 20+ portfolio managers to compare benchmarks against active portfolios and forecast future trades; projected value impact $40M–$80M/yr.",
        tags: ["TypeScript", "React", "Python", "20+ PMs"],
      },
      {
        name: "Benchmark Construction Microservices",
        desc: "Designed and deployed event-driven microservices supporting benchmark construction within Vanguard's portfolio management trading workflows.",
        tags: ["Event-Driven Architecture", "Trading Workflows"],
      },
    ],
  },
  {
    title: "Machine Learning Engineer",
    team: "Enterprise Advice, Vanguard",
    period: "04/2022 – 11/2022",
    projects: [
      {
        name: "Tax Lot Personalization Models",
        desc: "Built models on client tax lot data to improve personalization and portfolio recommendations.",
        tags: ["scikit-learn", "Portfolio Recommendations"],
      },
      {
        name: "Tax-Loss Harvesting Optimization",
        desc: "Improved tax-loss harvesting calculation accuracy by 90%, significantly reducing compute cost.",
        tags: ["90% improvement", "Compute Reduction"],
      },
      {
        name: "MLOps Foundation",
        desc: "Established early MLOps foundations: reproducible training pipelines, model packaging, and deployment readiness.",
        tags: ["Training Pipelines", "Model Packaging", "CI/CD"],
      },
    ],
  },
  {
    title: "Data Engineer",
    team: "Chief Data Analytics Office, Vanguard",
    period: "08/2021 – 04/2022",
    projects: [
      {
        name: "Compliance ETL Pipelines",
        desc: "Built enterprise ETL pipelines supporting compliance scanning and metadata cataloging at scale.",
        tags: ["Spark", "Metadata Cataloging", "Data Lineage"],
      },
      {
        name: "CCPA Data Readiness",
        desc: "Contributed to CCPA compliance through improved data lineage, pipeline reliability, and data quality processes.",
        tags: ["Data Quality", "Pipeline Reliability"],
      },
    ],
  },
]

export default function ResumePage() {
  return (
    <div className="container py-10 md:py-14">
      <div className="max-w-5xl mx-auto space-y-8">
        <p className="text-xs uppercase tracking-[0.24em] text-[#C45A3C]">Profile</p>
        <div className="-mt-4 flex flex-wrap items-center justify-between gap-4">
          <h1 className="font-display text-5xl leading-none md:text-6xl">Work</h1>
          <button className="group relative inline-flex items-center text-xs uppercase tracking-[0.2em] text-[#C45A3C] transition-colors hover:text-[#E8E5E0]">
            <span className="nav-shutter nav-glitch-word" data-text="Download PDF">Download PDF</span>
            <span className="absolute -bottom-1 left-0 h-[2px] w-0 rounded-full bg-[#C45A3C] transition-all duration-300 group-hover:w-full" />
          </button>
        </div>
        <p className="text-sm text-[#d2ccc3]">
          For code, open-source work, and personal projects, visit{" "}
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

        {/* Summary */}
        <div className="border-l-2 border-[#C45A3C] pl-6">
          <p className="text-lg leading-relaxed text-[#E8E5E0] md:text-xl">
            Applied AI Engineer and technical lead on a high-velocity internal consulting team, specializing in
            rapid execution under ambiguity and owning solutions from discovery to prototype to live deployment.
            Known for translating stakeholder needs into demo-ready prototypes and operational systems through tight
            feedback loops.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-[#d2ccc3]">
            Strong background across data engineering, machine learning, and generative AI.
            Experienced delivering cloud-native ML platforms at enterprise scale through distributed training,
            orchestration, and MLOps.
          </p>
        </div>

        {/* Selected Impact */}
        <div>
          <p className="mb-4 text-xs uppercase tracking-[0.24em] text-[#C45A3C]">Selected Impact</p>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {[
              { stat: "7×", label: "ML training runtime reduction" },
              { stat: "10×+", label: "Backtesting workflow acceleration" },
              { stat: "$50M+", label: "Alpha opportunity — mortgage prepayment research" },
              { stat: "28K", label: "Products forecasted across 36 fund brands" },
              { stat: "<14 days", label: "Investment research pipeline delivery" },
              { stat: "7-person", label: "Cross-functional ML team led" },
            ].map(({ stat, label }) => (
              <div key={stat + label} className="rounded-lg border border-[#E8E5E0]/10 bg-[#111111]/70 p-4">
                <p className="font-display text-3xl text-[#C45A3C] leading-none mb-1">{stat}</p>
                <p className="text-xs text-[#d2ccc3] leading-snug">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Work History */}
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.24em] text-[#C45A3C]">Work History</p>

          {roles.map((role) => (
            <Card key={role.title + role.period} className="border-[#E8E5E0]/15 bg-[#111111]/70">
              <CardHeader className="pb-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <CardTitle className="text-base text-[#E8E5E0]">{role.title}</CardTitle>
                    <p className="text-sm text-[#C45A3C]">{role.team}</p>
                  </div>
                  <span className="text-xs text-[#d2ccc3] shrink-0">{role.period}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {role.projects.map((project) => (
                  <div key={project.name}>
                    <p className="text-sm font-medium text-[#E8E5E0] mb-0.5">{project.name}</p>
                    <p className="text-xs text-[#d2ccc3] mb-1.5">{project.desc}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {project.tags.map((tag) => (
                        <span key={tag} className="rounded-full border border-[#E8E5E0]/15 bg-[#0A0A0A] px-2.5 py-0.5 text-xs text-[#d2ccc3]">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Skills */}
        <Card className="border-[#E8E5E0]/15 bg-[#111111]/70">
          <CardHeader>
            <CardTitle className="text-xs uppercase tracking-[0.2em] text-[#C45A3C]">Skills</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "Languages", items: ["Python", "TypeScript", "JavaScript", "Next.js", "SQL", "R", "Go"] },
              { label: "ML / AI", items: ["TensorFlow", "CatBoost", "XGBoost", "scikit-learn", "SHAP", "Time Series", "Survival Modeling"] },
              { label: "GenAI", items: ["RAG", "Agentic Workflows", "MLflow", "Arize", "Azure OpenAI", "Pinecone", "Qdrant"] },
              { label: "Cloud / MLOps", items: ["AWS SageMaker", "Lambda", "ECS/Fargate", "DynamoDB", "Step Functions", "Terraform", "CI/CD"] },
              { label: "Data", items: ["Spark", "EMR", "Glue", "Athena", "S3", "Polars", "Dask", "Postgres"] },
              { label: "Engineering", items: ["Solution Architecture", "Event-Driven Architecture", "Observability", "DDD", "Agile/Scrum"] },
              { label: "Platforms", items: ["Supabase", "Vercel", "Docker", "Celery", "Redis", "ngrok"] },
            ].map(({ label, items }) => (
              <div key={label}>
                <p className="mb-2 text-xs uppercase tracking-[0.16em] text-[#E8E5E0]">{label}</p>
                <div className="flex flex-wrap gap-2">
                  {items.map((skill) => (
                    <span key={skill} className="rounded-full border border-[#E8E5E0]/20 bg-[#0A0A0A] px-3 py-1 text-xs text-[#d2ccc3]">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Education & Certs */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Card className="border-[#E8E5E0]/15 bg-[#111111]/70">
            <CardHeader>
              <CardTitle className="text-xs uppercase tracking-[0.2em] text-[#C45A3C]">Education</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-[#d2ccc3]">
              <div>
                <p className="font-semibold text-[#E8E5E0]">Villanova University</p>
                <p>M.S. Applied Statistics</p>
                <p className="text-xs">2022 – 2023</p>
              </div>
              <div>
                <p className="font-semibold text-[#E8E5E0]">Pennsylvania State University</p>
                <p>B.S. Cybersecurity &amp; Risk Analysis</p>
                <p className="text-xs">2021</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#E8E5E0]/15 bg-[#111111]/70">
            <CardHeader>
              <CardTitle className="text-xs uppercase tracking-[0.2em] text-[#C45A3C]">Certifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-[#d2ccc3]">
              {[
                "Capital Markets & Security Analyst (CMSA)",
                "AWS Cloud Practitioner",
              ].map((cert) => (
                <div key={cert} className="flex gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#C45A3C]" />
                  {cert}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Projects */}
        <Card className="border-[#E8E5E0]/15 bg-[#111111]/70">
          <CardHeader>
            <CardTitle className="text-xs uppercase tracking-[0.2em] text-[#C45A3C]">Projects &amp; Research</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { name: "Poker Coaching App", tags: ["Flutter", "Generative AI", "Mobile"] },
              { name: "Foundational ML Paper Reproductions", tags: ["AlexNet", "ResNet", "LSTMs", "Transformers", "Quant Finance"] },
              { name: "Geospatial Embedding Model", tags: ["seq2vec", "Autoencoder", "BLS/HUD/IPUMS", "Similarity Search"] },
            ].map((project) => (
              <div key={project.name}>
                <p className="text-sm text-[#E8E5E0] mb-1">{project.name}</p>
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-[#E8E5E0]/15 bg-[#0A0A0A] px-2.5 py-0.5 text-xs text-[#d2ccc3]">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
