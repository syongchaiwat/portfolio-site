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

> A systematic study of which A/B testing metrics are actually sensitive to treatment effects — identifying which ones give you reliable signals and which ones waste your team's statistical budget.

**Skills:** P-value distribution analysis, signal-to-noise ratio measurement, metric decomposition, statistical simulation, experiment design

## Key Outcomes
- Showed that per-booking metrics (e.g. revenue per transaction) carry almost no signal in front-end experiments, making them poor choices as primary metrics despite being intuitive business measures
- Found that team-defined proxy metrics vary widely in sensitivity — behavioural and micro-conversion metrics tend to be more movable than direct business metrics, and are useful for validating treatment direction
- Established that booking count and unique booker count are statistically equivalent for decision-making, while long-term contribution should be used as a guard-rail rather than a decision metric

---

## Article

### Motivation

Every A/B test requires you to choose a primary metric — the one number that will determine whether the experiment is a success or a failure. This choice matters more than most teams realise. A metric that's too noisy will require a much longer experiment to detect the same effect size. A metric that's easy to move but uncorrelated with actual business outcomes can mislead you into shipping features that don't actually help. And a metric that's hard to move at all will lead to endless inconclusive results, wasted traffic, and frustrated product teams.

At Agoda, front-end teams ran experiments targeting different stages of the booking funnel — from homepage and search results all the way through to checkout. The question was: across the range of metrics available (per-user booking counts, per-booking revenue metrics, long-term contribution, and various team-defined proxy metrics), which ones are actually worth using as primary metrics? Which ones have enough signal to be detectable in a reasonable experiment window? And for the ones that shouldn't be primary metrics, what role should they play?

At Agoda, experiments run twice: a **decision run** to determine whether to ship a feature, and a **measurement run** to quantify the unbiased business impact after the decision is made. The choice of primary metric in the decision run directly determines how long the experiment needs to run and how reliable the decision will be. Getting this wrong is expensive.

### Approaches

- **The "smile plot" as a metric sensitivity diagnostic.** A healthy metric, applied to a set of real experiments with genuine effects, should produce a p-value distribution that is skewed toward zero — you expect to see more small p-values than large ones, because most experiments that showed an effect should have produced a significant result. A metric with no sensitivity produces a flat, roughly uniform distribution (no signal at all). A useful summary of this shape is the "smile ratio" — the proportion of experiments with p-values below a threshold. A higher smile ratio means the metric is more sensitive to treatment effects, i.e. higher signal-to-noise. This analysis applied this diagnostic across all candidate metrics on a large set of historical experiments.

- **IBPD correlation as a relevance filter.** Sensitivity alone isn't enough — a metric can be easy to move but move in the wrong direction, or be correlated with noise rather than with actual business outcomes. To check relevance, each metric's experimental results were correlated with the primary business outcome (incremental bookings) from the measurement run. Metrics with high sensitivity but low correlation with the business outcome are dangerous: they look good in the decision run but don't translate to real impact.

- **Metric decomposition to understand what's actually driving variance.** For the long-term contribution metric, the analysis decomposed it into its constituent parts: long-term contribution per booking, bookings per unique booker, and unique bookers per user. This decomposition reveals which component is driving the overall metric's behaviour. It turned out that the per-booking component has very little signal in front-end experiments (front-end changes rarely affect the value of each booking, only the number of bookings), which explains why the long-term contribution metric as a whole is harder to move than booking count alone.

- **Recommendation divergence analysis across metric choices.** Beyond sensitivity and relevance, a practical question is: if we switched primary metrics, how often would we reach a different decision on the same experiment? The analysis computed the fraction of historical experiments where each pair of metrics led to conflicting recommendations. A high divergence rate between two metrics means the choice of primary metric materially changes your decisions — which is a signal that you need to be deliberate about which one to trust and why.

### Key Takeaways

- **Per-booking metrics are almost never the right primary metric for front-end experiments.** Front-end changes — UI tweaks, page layout changes, new features in the search flow — primarily affect whether a user books at all, not how much they spend per booking. Using revenue per booking as a primary metric for these experiments means measuring something the treatment is unlikely to move, which guarantees low power and inconclusive results. Reserve per-booking metrics for experiments specifically designed to affect booking value (e.g. pricing or upsell experiments).

- **Team-defined proxy metrics are worth using — but not blindly.** Because product teams have context about what their feature is designed to change (e.g. "this button change should increase property page engagement"), they can often identify proxy metrics that are more directly affected by the treatment than generic business metrics. These proxies tend to have higher signal-to-noise. But they should always be validated against the primary business outcome: a proxy that's easy to move but doesn't correlate with actual bookings is a false positive factory.

- **Long-term contribution is a guard-rail, not a compass.** This metric — which captures both immediate booking revenue and the estimated future value of retaining a customer — is important to monitor because a treatment that increases bookings but degrades customer quality is a net negative for the business. But it's harder to move than booking count, and its components have different sensitivities to different types of changes. The right role for it is as a secondary metric: "we'll ship if booking count is positive, as long as long-term contribution doesn't significantly decline."

- **Metric sensitivity can and should be estimated empirically before launching experiments.** Historical experiment data contains everything you need to evaluate how sensitive each metric is under realistic conditions. Teams that choose primary metrics based on intuition alone — "this seems like the right thing to measure" — are flying blind. A pre-launch sensitivity audit takes a few hours and can prevent weeks of wasted experiment runtime.
