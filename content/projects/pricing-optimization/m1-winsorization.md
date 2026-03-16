---
id: m1-winsorization
category: Pricing Optimization
order: 4
tags: [Statistical Signal Processing, Outlier Detection, Variance Reduction, Pricing Analytics, Parameter Fitting, Multi-Market Analysis]
demoUrl: "#"
imageAlt: Remaining LTC% by destination under fixed vs. dynamic winsorization thresholds
shortDescription: Replacing a fixed outlier-clipping threshold with a dynamic, destination-aware formula — reducing variance in the pricing signal while treating large and small markets proportionally.
---

# One Threshold Doesn't Fit All Markets

> Replacing a fixed outlier-clipping threshold with a dynamic, destination-aware formula — reducing variance in the pricing signal while treating large and small markets proportionally.

**Skills:** Statistical signal processing, outlier detection, variance reduction, pricing analytics, parameter fitting, multi-market analysis

## Key Outcomes
- Fixed threshold was systematically over-clipping small markets and under-clipping large ones, introducing directional bias across destinations
- Dynamic threshold formula — scaled by bookings and revenue metrics per destination — narrowed the spread of remaining LTC% across all markets
- Signal-level standard error reduced meaningfully with destination-aware thresholds compared to the fixed baseline
- 8 of 17 destinations received lower optimal thresholds than the previous fixed value, confirming systematic over-winsorization for smaller markets

---

## Article

### Motivation

Winsorization — capping extreme values at a chosen percentile rather than removing them — is a standard technique for handling outliers in financial and business metrics. In a pricing system that reads daily booking-level LTC (long-term contribution, a metric capturing both immediate revenue and estimated future customer value), individual outlier bookings can dominate the signal and cause the optimization model to chase noise rather than a genuine pricing opportunity. Winsorization fixes this: bookings above a threshold are clipped to that threshold value before the signal is computed.

The problem is that a threshold is a policy, and policies applied uniformly across different populations embed assumptions that may not hold everywhere. A booking that represents a 99th-percentile outlier in Vietnam — a smaller, lower-average-revenue market — might be an entirely ordinary booking in Japan or South Korea. When you apply the same fixed threshold to both, you clip Vietnam more aggressively than Japan. The signal from Vietnam is effectively blunted: you're removing more of its genuine variance, not just its outlier noise.

This project replaced Agoda's fixed M1 winsorization threshold with a dynamic formula that scales with the size and revenue profile of each destination — making the outlier treatment proportional to what "extreme" actually means in each market.

### Approaches

- **Diagnosing the bias from the fixed threshold.** The first step was demonstrating that the fixed threshold was producing materially different effective winsorization levels across destinations. The metric used was "remaining LTC%" — what percentage of total LTC value survives after winsorization. Under the fixed threshold, this percentage ranged widely across destinations. Some markets retained nearly all of their LTC value; others had significant fractions clipped. The spread of this range was the quantitative case for change: a well-designed threshold should produce roughly consistent remaining LTC% across markets, because the goal is to remove the same proportion of extreme noise everywhere, not to remove a fixed dollar amount.

- **Deriving a destination-specific threshold formula.** The insight behind the dynamic formula is that what counts as an "outlier" in any market scales with the average revenue per booking in that market. A booking that's 10× the average transaction value is an outlier by any reasonable definition, regardless of whether the average is $50 or $500. The formula expresses the threshold as a linear function of (revenue + dLTV) per booking — where dLTV is the estimated long-term customer value contribution — with two free parameters that control the intercept and slope. These parameters were fitted using percentile-based calibration: for each destination, compute the empirical threshold at the target winsorization level, then find the linear coefficients that best predict those destination-level thresholds from the per-booking revenue metric.

- **Parameter fitting to match target remaining-LTC% across destinations.** The target wasn't a single correct threshold for each destination — it was a consistent remaining-LTC% across all destinations. The parameter fitting procedure found the linear coefficients that minimized variance in remaining LTC% across destinations, subject to the constraint that the overall average winsorization level matched the existing system's (to avoid a step-change in signal behavior on launch). The result was a formula that assigned higher thresholds to high-revenue destinations (where large individual bookings are legitimately common) and lower thresholds to smaller markets (where a booking at the same dollar value is genuinely anomalous).

- **Year-end behavior analysis as a robustness check.** One concern with any winsorization scheme is seasonal instability — periods where booking patterns deviate sharply from the annual average (year-end holidays, major travel seasons) can inflate or deflate the apparent outlier level. The analysis specifically examined the year-end period as a stress test. The finding was that higher winsorization levels (clipping more aggressively) don't necessarily reduce signal variance during year-end spikes — the underlying demand volatility is real, not noise, and clipping it doesn't help. This pointed toward a modest rather than aggressive target winsorization level for normal operation, with a recommendation to revisit the parameter during extreme seasonal periods.

### Key Takeaways

- **Outlier thresholds are a data preprocessing policy, and policies should be validated against the distribution they're applied to.** A universal threshold embeds an assumption: that a fixed dollar value is equally "extreme" across all markets. This assumption rarely holds when markets differ substantially in size, average revenue, or booking patterns. The first thing to check about any preprocessing rule that uses an absolute value is whether relative behavior matters more.

- **Remaining signal% is a more useful diagnostic than threshold value.** Evaluating winsorization by looking at the threshold number across markets is misleading — a $140 threshold clips 5% of Japan's LTC but 25% of Vietnam's. Looking instead at remaining LTC% as the output metric makes the asymmetry immediately visible and gives you a clean optimization target for the redesign.

- **Proportional scaling is a natural default for any metric that depends on transaction size.** The formula structure — threshold as a function of revenue per booking — generalizes to any setting where outlier detection needs to be proportional to the local scale of the data. It's analogous to using percentage-of-revenue rather than absolute-revenue thresholds in financial anomaly detection, or Z-scores rather than absolute deviations in statistical testing.

- **Fitting parameters to empirical percentiles is more robust than imposing a theoretical distribution.** Rather than assuming booking LTC follows a specific distribution and deriving thresholds analytically, the approach fitted parameters directly from the observed per-destination threshold at the target winsorization level. This is more accurate for real data that doesn't conform neatly to any textbook distribution, and it ensures the formula is calibrated to actual market conditions rather than theoretical ones.
