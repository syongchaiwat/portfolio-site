---
id: metric-quality-selection
category: Experimentation
order: 3
tags: [P-value Distribution Analysis, Signal-to-Noise Ratio, Metric Decomposition, Statistical Simulation, Experiment Design]
demoUrl: "#"
imageAlt: Metric sensitivity smile plot comparing p-value distributions across candidate metrics
shortDescription: A systematic study of which A/B testing metrics are actually sensitive to treatment effects — identifying which ones give you reliable signals and which ones waste your team's statistical budget.
---

# What Makes a Good Experiment Metric? A Signal-to-Noise Analysis

> Sensitivity to treatment is necessary but not sufficient — a good experiment metric also needs to predict the actual business outcome. Finding metrics with high signal-to-noise that also correlate with real growth lets teams iterate faster without sacrificing decision quality.

**Skills:** P-value distribution analysis, signal-to-noise ratio measurement, metric decomposition, statistical simulation, experiment design

## Key Outcomes
- Confirmed that per-booking metrics carry almost no signal in front-end experiments, making them poor primary metric choices despite their intuitive business appeal
- Found that unique booker count often outperforms bookings per user as a primary metric: it has higher signal-to-noise while remaining strongly correlated with the per-user outcome, making it a better choice in funnels where driving multiple bookings per user is difficult
- Identified that behavioural metrics (e.g. clicks, page engagement) are highly sensitive to treatment but weakly predictive of actual business impact — valuable for confirming that a feature works as intended, but not reliable enough to make ship decisions

---

## Article

### Motivation

At Agoda, the north star for front-end product teams was bookings per user — converting more visitors into at least one completed booking. But as a data scientist working across experimentation, you start asking a more uncomfortable question: is this actually the right metric to run A/B tests against? Or are there proxies that are easier to move, while still reliably predicting whether the business outcome also improved?

There was also a practical concern: if bookings per user is getting harder to move as product quality matures and the obvious improvements are already shipped, teams need more traffic and longer experiments just to reach significance. That raises the cost of every decision. Finding metrics with higher signal-to-noise — while remaining predictive of actual growth — would let teams iterate faster without compromising quality.

Because teams were encouraged to define hypothesis metrics alongside their primary metric for each experiment, we had a rich dataset to study: how sensitive is each metric to treatment? And how well does moving that metric predict whether the core business outcome also improved?

### Approaches

- **The "smile" as a metric sensitivity diagnostic.** To assess sensitivity, we used the p-value distribution across a large set of historical experiments. The "smile" measures how far p-values are from 0.5 on average — a perfectly random experiment with no treatment effect produces a uniform p-value distribution, which gives a smile of 0.25. A metric that is genuinely sensitive to treatment pushes p-values toward both extremes: significant results appear near 0 (positive effects) and near 1 (negative effects), creating a histogram that is high at both ends and lower in the middle — a smile shape. A good metric should have a high smile. 

- **Predictive power as a relevance filter.** Sensitivity alone is not sufficient. A metric can be easy to move but it can move in a direction that does not translate to business outcomes. To assess relevance, each metric's experimental results were correlated against the primary business outcome (incremental bookings) from the measurement run. Metrics that are highly sensitive but weakly correlated with actual bookings are dangerous: they produce convincing-looking results in the decision run but do not translate to real impact.

- **Metric decomposition to understand what drives variance.** For composite metrics like long-term contribution, the analysis decomposed the metric into its constituent parts: value per booking, bookings per unique booker, and unique bookers per user. Decomposition reveals which component is driving overall behavior. For front-end experiments, the value-per-booking component carries almost no signal — front-end changes affect whether a user books at all, not how much they spend per booking — which explains why composite metrics containing this component are harder to move than simple booking counts alone.

### Key Takeaways

- **The p-value distribution shape — the "smile" — is a practical tool for diagnosing metric quality.** For a primary metric applied across many experiments, a flat or near-uniform distribution signals poor health of experimentation in general. For proxy and hypothesis metrics, comparing smile values lets you rank the metrics by sensitivity to the treatments. 

- **Having a data infrastructure to collect hypothesis metrics is what makes this analysis possible — and metric decomposition is what makes it interpretable.** Without a consistent framework for logging what each team expected to move, the meta-dataset for studying metric behavior does not exist. Once the data is there, decomposing composite metrics into their components pinpoints exactly which layer a treatment is affecting and why some metrics respond while others do not.

- **Behavioral metrics belong in the diagnostic layer, not the decision layer.** Clicks, engagement rates, and UI interaction metrics tend to be highly sensitive — front-end changes almost always affect how users interact with a surface. But that sensitivity does not guarantee business impact. The right role for these metrics is confirmation: did users actually see the feature? Is the hypothesis directionally correct? They catch setup errors and validate that a treatment is working as designed. Ship decisions should still rest on metrics that predict business outcomes.
