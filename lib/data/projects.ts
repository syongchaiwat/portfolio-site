export type ProjectCategory = "AI / LLM" | "Pricing Optimization" | "Experimentation";

export interface Project {
  id: string;
  category: ProjectCategory;
  title: string;
  shortDescription: string;
  longDescription: string;
  outcomes: string[];
  tags: string[];
  githubUrl: string;
  demoUrl: string;
  imageAlt: string;
}

export const projects: Project[] = [
  // ── AI / LLM ──────────────────────────────────────────────────────────────
  {
    id: "rag-document-qa",
    category: "AI / LLM",
    title: "RAG-Powered Document Q&A",
    shortDescription:
      "An intelligent document Q&A system using Retrieval-Augmented Generation for accurate, context-aware answers.",
    longDescription:
      "Built a production-ready RAG pipeline that ingests PDFs and documents, chunks them semantically, embeds them into a FAISS vector store, and retrieves relevant context for an LLM to answer user queries. The system handles multi-turn conversations and cites source passages for transparency.",
    outcomes: [
      "Achieved 89% answer accuracy on a benchmark dataset of 500 domain-specific questions",
      "Reduced hallucination rate by 62% compared to a naive GPT-4 baseline",
      "Processes 100-page documents in under 10 seconds using async chunking",
    ],
    tags: ["LangChain", "OpenAI", "FAISS", "Python", "FastAPI", "RAG"],
    githubUrl: "https://github.com",
    demoUrl: "#",
    imageAlt: "RAG pipeline architecture diagram",
  },
  {
    id: "llm-finetuning",
    category: "AI / LLM",
    title: "Domain-Specific LLM Fine-Tuning",
    shortDescription:
      "Fine-tuned Llama 3 on a proprietary legal corpus using LoRA, achieving GPT-4-level performance at 1/10th the cost.",
    longDescription:
      "Curated a dataset of 50,000 legal Q&A pairs and fine-tuned Llama 3 8B using QLoRA (4-bit quantisation + LoRA adapters) on a single A100 GPU. Implemented RLHF-style preference tuning using DPO to align outputs with expert attorney feedback. Evaluated against GPT-4 using LLM-as-judge methodology.",
    outcomes: [
      "Matched GPT-4 on 78% of legal reasoning tasks in blind evaluation",
      "Reduced inference cost by 90% vs. GPT-4 API at equivalent quality",
      "Full fine-tuning pipeline completed in under 6 hours on a single GPU",
    ],
    tags: ["HuggingFace", "Llama 3", "LoRA", "QLoRA", "DPO", "PEFT", "Transformers"],
    githubUrl: "https://github.com",
    demoUrl: "#",
    imageAlt: "LLM fine-tuning pipeline with LoRA adapters",
  },
  // ── Pricing Optimization ──────────────────────────────────────────────────
  {
    id: "dynamic-pricing-engine",
    category: "Pricing Optimization",
    title: "Dynamic Pricing Engine",
    shortDescription:
      "Real-time pricing engine that adjusts product prices based on demand signals, competitor data, and inventory levels.",
    longDescription:
      "Developed a dynamic pricing system that pulls real-time competitor prices, inventory levels, and demand forecasts to recommend optimal prices via a contextual bandit model. Prices are updated hourly through an API and logged to a feature store for continuous retraining.",
    outcomes: [
      "Increased gross margin by 4.2 percentage points across 10,000 SKUs",
      "Reduced price-adjustment latency from 24 hours to under 60 minutes",
      "Model retrained weekly using online learning, maintaining stable performance over 6 months",
    ],
    tags: ["Python", "Contextual Bandits", "Kafka", "Redis", "FastAPI", "Feature Store"],
    githubUrl: "https://github.com",
    demoUrl: "#",
    imageAlt: "Dynamic pricing engine architecture",
  },
  {
    id: "price-elasticity-modelling",
    category: "Pricing Optimization",
    title: "Price Elasticity Modelling",
    shortDescription:
      "Bayesian hierarchical model estimating price elasticity at the product–region level to guide promotional strategy.",
    longDescription:
      "Modelled demand as a function of price, promotions, seasonality, and cross-product effects using a Bayesian hierarchical regression in Stan. Partial pooling across regions allowed the model to generalise to low-volume SKUs. Outputs were integrated into a Tableau dashboard used by the pricing team.",
    outcomes: [
      "Estimated elasticity for 2,400 SKUs with 90% credible intervals narrower than ±0.3",
      "Identified 15% of SKUs as inelastic, enabling selective margin expansion",
      "Promotion ROI improved by 22% in the following quarter using model-informed discounts",
    ],
    tags: ["Stan", "PyMC", "Bayesian Inference", "Python", "Tableau", "Hierarchical Models"],
    githubUrl: "https://github.com",
    demoUrl: "#",
    imageAlt: "Price elasticity credible intervals by region",
  },
  {
    id: "markdown-optimiser",
    category: "Pricing Optimization",
    title: "Markdown Optimisation",
    shortDescription:
      "Reinforcement learning agent that schedules end-of-season markdowns to maximise revenue while clearing inventory.",
    longDescription:
      "Framed markdown scheduling as a Markov Decision Process and trained a Proximal Policy Optimisation agent in a simulated retail environment. The agent learns a discount policy that balances revenue and sell-through rate under a hard deadline. Deployed as a batch job that outputs weekly markdown schedules.",
    outcomes: [
      "Increased end-of-season revenue by 8% vs. the rule-based baseline across 3 product categories",
      "Achieved 98% sell-through rate, up from 87% with the prior fixed-schedule approach",
      "Policy generalised to new seasons without retraining using zero-shot transfer",
    ],
    tags: ["Reinforcement Learning", "PPO", "PyTorch", "Simulation", "Python", "Retail"],
    githubUrl: "https://github.com",
    demoUrl: "#",
    imageAlt: "Markdown schedule optimisation policy chart",
  },
  {
    id: "competitor-price-tracker",
    category: "Pricing Optimization",
    title: "Competitor Price Intelligence",
    shortDescription:
      "Automated pipeline that scrapes, deduplicates, and surfaces competitor price changes for analyst review.",
    longDescription:
      "Built an end-to-end data pipeline that scrapes prices from 12 competitor websites daily using Playwright, deduplicates and matches SKUs via fuzzy string matching and embedding similarity, and surfaces anomalies in a Streamlit dashboard. Alerts are sent to Slack when a competitor drops prices by more than 5%.",
    outcomes: [
      "Monitored 8,000+ competitor SKUs across 12 sites with 97% match accuracy",
      "Reduced analyst time spent on competitor monitoring by 6 hours per week",
      "Triggered 23 proactive price adjustments in the first quarter, protecting market share",
    ],
    tags: ["Playwright", "Python", "Sentence Transformers", "Streamlit", "Airflow", "Slack API"],
    githubUrl: "https://github.com",
    demoUrl: "#",
    imageAlt: "Competitor price intelligence dashboard",
  },

  // ── Experimentation ───────────────────────────────────────────────────────
  {
    id: "ab-testing-platform",
    category: "Experimentation",
    title: "A/B Testing Platform",
    shortDescription:
      "Self-serve experimentation platform enabling product teams to design, run, and analyse A/B tests without analyst support.",
    longDescription:
      "Designed and built a full-stack experimentation platform with a React frontend for experiment creation and a Python backend that handles user assignment, metric collection, and statistical analysis. Supports frequentist (t-test, chi-square) and Bayesian analysis modes, with automatic sample-size calculation and guardrail metrics.",
    outcomes: [
      "Reduced experiment setup time from 2 days to under 30 minutes for non-technical teams",
      "Ran 40+ experiments in the first 6 months post-launch",
      "Detected 3 false positives that would have shipped harmful changes under the old manual process",
    ],
    tags: ["Python", "React", "PostgreSQL", "Statistics", "Bayesian", "FastAPI"],
    githubUrl: "https://github.com",
    demoUrl: "#",
    imageAlt: "A/B testing platform experiment dashboard",
  },
  {
    id: "causal-inference-pipeline",
    category: "Experimentation",
    title: "Causal Inference Pipeline",
    shortDescription:
      "Observational causal analysis pipeline using propensity score matching and DiD to estimate treatment effects without RCTs.",
    longDescription:
      "Implemented a causal inference toolkit supporting propensity score matching, inverse probability weighting, and difference-in-differences estimation. Applied to evaluate the impact of a loyalty programme rollout in regions where randomisation was not feasible, with covariate balance diagnostics and sensitivity analysis.",
    outcomes: [
      "Estimated a 12% lift in 90-day retention attributable to the loyalty programme (95% CI: 8–16%)",
      "Covariate balance (SMD < 0.1) achieved across all 18 confounders after matching",
      "Results replicated with three distinct estimators, increasing confidence in causal claims",
    ],
    tags: ["Python", "DoWhy", "EconML", "Propensity Scoring", "DiD", "Pandas"],
    githubUrl: "https://github.com",
    demoUrl: "#",
    imageAlt: "Causal inference DAG and balance diagnostics",
  },
  {
    id: "multi-armed-bandit",
    category: "Experimentation",
    title: "Multi-Armed Bandit for Content",
    shortDescription:
      "Thompson Sampling bandit that dynamically allocates traffic to the best-performing content variant in real time.",
    longDescription:
      "Replaced fixed A/B splits with a Thompson Sampling multi-armed bandit to reduce regret during experimentation. The bandit updates its Beta distribution posteriors on every conversion event and allocates traffic proportionally to each arm's posterior win probability. Integrated with the CMS via a lightweight REST API.",
    outcomes: [
      "Reduced cumulative regret by 34% compared to a fixed 50/50 A/B split over 30-day tests",
      "Deployed across 5 homepage content experiments, lifting click-through rate by an average 9%",
      "Bandit converged to the winning variant 2× faster than traditional A/B testing",
    ],
    tags: ["Python", "Thompson Sampling", "Bayesian", "FastAPI", "Redis", "CMS Integration"],
    githubUrl: "https://github.com",
    demoUrl: "#",
    imageAlt: "Thompson Sampling posterior distributions over time",
  },
  {
    id: "experiment-analysis-toolkit",
    category: "Experimentation",
    title: "Experiment Analysis Toolkit",
    shortDescription:
      "Python library for robust experiment analysis with variance reduction, multiple testing correction, and power analysis.",
    longDescription:
      "Authored an open-source Python package that wraps common experiment analysis workflows: CUPED variance reduction, Benjamini-Hochberg FDR correction for multiple metrics, sequential testing with alpha-spending, and interactive power calculators. Designed for use in Jupyter notebooks by data scientists.",
    outcomes: [
      "CUPED reduced metric variance by an average of 28%, improving test sensitivity",
      "Package adopted by 3 internal data science teams within 2 months of release",
      "Documented with 15 example notebooks covering common experimentation scenarios",
    ],
    tags: ["Python", "CUPED", "Sequential Testing", "Statistics", "Open Source", "Jupyter"],
    githubUrl: "https://github.com",
    demoUrl: "#",
    imageAlt: "Experiment analysis toolkit power curve visualisation",
  },
];

export const PROJECT_CATEGORIES: ProjectCategory[] = [
  "AI / LLM",
  "Pricing Optimization",
  "Experimentation",
];
