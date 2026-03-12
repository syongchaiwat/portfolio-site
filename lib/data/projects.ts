export type ProjectCategory = "AI / LLM" | "Pricing Optimization" | "Experimentation";

export interface ProjectArticle {
  motivation: string;
  approaches: string[];
  keyTakeaways: string[];
}

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
  article?: ProjectArticle;
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
    article: {
      motivation:
        "Static pricing rules set by merchandisers became a bottleneck as our catalogue grew to tens of thousands of SKUs. Prices were reviewed at most once a day, meaning we were slow to react to competitor drops, demand spikes, and low-stock situations. The business needed a system that could reason about multiple signals simultaneously and act in near-real time without requiring manual intervention.",
      approaches: [
        "We modelled the pricing decision as a contextual bandit problem, framing each hourly price decision as a choice between holding, raising, or discounting by a fixed set of tiers.",
        "Each hour, the engine pulls the latest competitor prices via a scraping layer, reads inventory levels from the warehouse API, and retrieves a short-term demand forecast from a gradient-boosted model trained on historical sales.",
        "These signals form the context vector fed to a LinUCB bandit that selects the price action. Chosen prices are published to a Kafka topic consumed by the e-commerce platform.",
        "Observed revenue is fed back as the reward signal, enabling continuous online learning. A feature store backed by Redis keeps feature retrieval under 5 ms.",
      ],
      keyTakeaways: [
        "Framing pricing as a bandit problem enabled continuous learning without requiring labelled ground-truth prices",
        "Separating the demand forecast model from the pricing policy made each component independently testable and retrainable",
        "Guardrails (minimum margin floor, maximum discount cap) are essential to prevent the bandit from exploring destructive price points",
        "Latency matters — moving from daily batch to hourly updates captured time-sensitive opportunities that batch pricing missed entirely",
      ],
    },
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
    article: {
      motivation:
        "The pricing team had been applying blanket discount percentages across product categories, with no quantitative understanding of how sensitive customers were to price changes for individual SKUs. For elastic products this meant leaving revenue on the table; for inelastic ones, unnecessary margin erosion. We needed credible elasticity estimates at the product–region level, including for low-volume SKUs where point estimates from OLS would be unreliable.",
      approaches: [
        "We specified a Bayesian hierarchical log-log demand model in Stan. Each SKU–region combination gets its own elasticity parameter drawn from a shared category-level distribution, enabling partial pooling.",
        "Partial pooling allows the model to share information across low-volume SKUs rather than fitting each in isolation, preventing overfitting on sparse data.",
        "We controlled for promotions, seasonality (Fourier terms), and holidays as covariates to isolate the pure price effect.",
        "After fitting, we ran posterior predictive checks and compared credible intervals against hold-out actuals to validate calibration.",
      ],
      keyTakeaways: [
        "Hierarchical models are the right tool when you need estimates for many subgroups with varying data volumes — partial pooling prevents both under- and over-fitting",
        "Credible intervals, not just point estimates, are what drive better business decisions: knowing uncertainty allows risk-adjusted pricing",
        "Log-log specification gives directly interpretable elasticity coefficients and handles the multiplicative nature of demand well",
        "Separating promotion effects from the base elasticity is critical — naive models often confound the two and produce biased estimates",
      ],
    },
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
    article: {
      motivation:
        "End-of-season clearance was handled with a fixed discount ladder: 20% off in week 8, 40% in week 10, 60% in week 12. This schedule ignored actual sell-through velocity, product margins, and remaining inventory, leading to either unsold stock at season end or premature deep discounts that destroyed margin. We wanted an approach that could learn when and by how much to discount each product, adapting to the observed sales trajectory in real time.",
      approaches: [
        "We modelled markdown scheduling as a finite-horizon Markov Decision Process. The state captures remaining inventory, weeks until end-of-season, current price tier, and recent sales velocity. The action space consists of five discount tiers.",
        "Rewards are the gross margin earned each week, with a large penalty for unsold stock at the deadline to incentivise sufficient urgency.",
        "We built a simulation environment calibrated on two years of historical sales data and trained a PPO agent entirely in simulation.",
        "The trained policy is evaluated weekly: it observes the current state and outputs the recommended discount tier, which a human reviewer can override before publishing.",
      ],
      keyTakeaways: [
        "Simulation fidelity is the most important factor in RL for retail — a poorly calibrated simulator will produce a policy that fails in production",
        "The penalty for end-of-season residual stock should reflect the true cost (write-down, warehouse, disposal) to incentivise appropriate urgency",
        "Framing the horizon as weeks remaining rather than calendar weeks makes the policy season-length agnostic and aids transfer",
        "Keeping humans in the loop for final approval was key to building stakeholder trust in an RL-driven system",
      ],
    },
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
    article: {
      motivation:
        "Analysts were spending several hours each week manually checking competitor websites and copy-pasting prices into a spreadsheet. Coverage was incomplete, updates were delayed by days, and there was no systematic way to detect when a competitor had repriced an entire subcategory. The business needed timely, reliable competitor price data to make reactive pricing decisions and feed into downstream models.",
      approaches: [
        "We built a multi-stage pipeline orchestrated by Airflow. The extraction layer uses Playwright to headlessly render JavaScript-heavy product pages and extract price and product metadata.",
        "SKU matching uses a two-step approach: a fast fuzzy-match on product titles to generate candidates, followed by a sentence-transformer embedding similarity score to rank them.",
        "Matches above a 0.85 cosine threshold are accepted automatically; borderline cases are queued for human review to maintain quality without full manual coverage.",
        "Matched prices are stored in a PostgreSQL time-series table. A Streamlit dashboard surfaces daily diffs and a Slack bot fires alerts when a competitor drops a matched SKU by more than 5%.",
      ],
      keyTakeaways: [
        "SKU matching is a harder problem than scraping — investing in a two-stage coarse-to-fine matcher paid dividends in accuracy",
        "Embedding-based matching generalises to product name variations and synonyms that rule-based approaches miss",
        "Alert fatigue is real: tuning the 5% threshold was necessary to keep Slack notifications actionable rather than noisy",
        "A human review queue for borderline matches maintained data quality without requiring manual review of every record",
      ],
    },
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
    article: {
      motivation:
        "Product teams were bottlenecked on data analysts to set up and evaluate A/B tests. Each experiment required a bespoke SQL query, a manual power calculation in a spreadsheet, and a hand-crafted analysis notebook. This meant only high-priority experiments got run, iteration velocity was slow, and statistical rigour varied widely across teams. We wanted to democratise experimentation so that any product manager could launch a well-powered, correctly analysed test without analyst involvement.",
      approaches: [
        "The assignment service handles user bucketing using a deterministic hash of user ID and experiment ID, ensuring stable assignments with no database round-trip.",
        "The metrics service aggregates event data from the data warehouse nightly and computes per-variant experiment metrics automatically.",
        "The analysis service offers two modes: a frequentist engine (Welch's t-test, chi-square) with Bonferroni correction, and a Bayesian engine that outputs posterior win probabilities and expected loss.",
        "Guardrail metrics — latency, error rate, revenue — are always checked regardless of the primary metric, with a red/amber/green status surfaced in the UI.",
      ],
      keyTakeaways: [
        "Self-serve tooling only succeeds if the UX guides users toward statistically sound choices — pre-filled power calculators and default guardrails prevented common errors",
        "Offering both frequentist and Bayesian modes satisfied different stakeholder intuitions, and the Bayesian mode reduced pressure to peek and stop early",
        "Guardrail metrics caught regressions in 3 experiments that looked positive on the primary metric — they are non-negotiable",
        "Logging the randomisation seed and assignment logic in the platform made experiment auditing and debugging dramatically easier",
      ],
    },
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
    article: {
      motivation:
        "The loyalty programme was rolled out sequentially across regions for operational reasons, making a clean randomised experiment impossible. Leadership still needed a credible estimate of its impact on 90-day retention before deciding whether to accelerate the rollout. Naively comparing early-adopter regions to control regions would conflate the programme effect with pre-existing regional differences — we needed a more rigorous approach.",
      approaches: [
        "Propensity score matching: we fitted a logistic regression on pre-treatment covariates (baseline retention, urban/rural split, average order value, growth rate) to predict early programme adoption, then matched treated regions to controls using nearest-neighbour matching with a caliper.",
        "Covariate balance was verified using standardised mean differences across all 18 confounders before proceeding to outcome analysis.",
        "Difference-in-differences: we exploited the staggered rollout timing, treating each region's rollout date as its treatment start and using the Callaway–Sant'Anna estimator to handle staggered adoption correctly.",
        "We ran both approaches independently and checked that estimates agreed, providing triangulated evidence for the causal claim.",
      ],
      keyTakeaways: [
        "Covariate balance checks are not optional — they are how you verify that matching actually created comparable groups",
        "Staggered DiD requires more care than canonical DiD; the Callaway–Sant'Anna estimator avoids the forbidden comparison problem that biases TWFE in heterogeneous treatment effect settings",
        "Triangulating across multiple estimators (PSM, IPW, DiD) is the strongest argument for robustness when you cannot run an RCT",
        "Sensitivity analysis (Rosenbaum bounds) quantified how large an unmeasured confounder would need to be to invalidate the conclusion — it was reassuringly large",
      ],
    },
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
    article: {
      motivation:
        "Fixed 50/50 A/B splits are wasteful when one variant is clearly better early in the experiment: you are knowingly sending half your traffic to a worse experience for the entire test duration. For content experiments on the homepage — where variants are short-lived and business impact is high — we wanted an approach that would shift traffic toward the better variant as evidence accumulated, while still collecting enough data to make a confident decision.",
      approaches: [
        "Each content variant starts with a Beta(1,1) uniform prior over its click-through rate. On each page request, we sample a CTR from each variant's posterior and serve the variant with the highest sample.",
        "On each observed click or non-click, we update the corresponding Beta distribution (increment α for a click, β for a non-click), keeping the model current in real time.",
        "Posteriors are stored in Redis for sub-millisecond read latency and updated atomically to avoid race conditions under high traffic.",
        "The CMS calls a FastAPI endpoint to get the variant assignment, passing a stable user ID so that each user sees the same variant within a session for consistency.",
      ],
      keyTakeaways: [
        "Thompson Sampling is simple to implement with conjugate priors and performs comparably to more complex bandit algorithms in practice",
        "Storing posteriors in Redis rather than a relational database was necessary to meet the latency requirements of a synchronous content-serving API",
        "Session consistency (same user always sees the same variant) is important for user experience but requires careful thought about how it interacts with exploration",
        "Bandits are not a replacement for A/B tests when you need a clean statistical inference — use bandits when minimising regret during the experiment matters more than a sharp post-hoc p-value",
      ],
    },
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
    article: {
      motivation:
        "Despite having an experimentation platform, data scientists were still writing bespoke analysis code for every experiment. Common mistakes kept recurring: not adjusting for multiple comparisons, peeking at results and stopping early, and running under-powered tests because sample-size calculations were done informally. We needed a shared library that encoded best practices so that correct analysis was the path of least resistance.",
      approaches: [
        "The variance module implements CUPED: it regresses the post-experiment metric on the pre-experiment covariate and uses the residuals as the analysis metric, reducing variance without introducing bias.",
        "The corrections module implements Benjamini-Hochberg FDR correction and Bonferroni for multiple metric testing, accepting a dict of metric names to p-values and returning adjusted values.",
        "The sequential module implements an O'Brien-Fleming alpha-spending function, allowing analysts to peek at results at pre-specified interim points without inflating Type I error.",
        "All modules are designed to work with pandas DataFrames and return tidy DataFrames, fitting naturally into existing Jupyter notebook workflows.",
      ],
      keyTakeaways: [
        "CUPED is one of the highest-ROI additions to an experimentation toolkit — the variance reduction is often 20–40%, directly translating to shorter required test durations",
        "Packaging best practices as functions rather than documentation dramatically increases adoption — people use what is convenient",
        "Alpha-spending functions make sequential testing statistically rigorous; combined with CUPED they allow shorter experiments without sacrificing validity",
        "Tidy, DataFrame-native APIs were key to adoption in a Python/Jupyter-centric data science organisation",
      ],
    },
  },
];

export const PROJECT_CATEGORIES: ProjectCategory[] = [
  "AI / LLM",
  "Pricing Optimization",
  "Experimentation",
];
