---
id: m1-winsorization
category: Pricing Optimization
order: 4
tags: [Outlier Detection, Variance Reduction, Pricing Analytics, Parameter Fitting]
demoUrl: "#"
imageAlt: Remaining LTC% by destination under fixed vs. dynamic winsorization thresholds
shortDescription: Replacing a fixed outlier-clipping threshold with a dynamic, destination-aware formula — reducing variance in the pricing signal while treating large and small markets proportionally.
---

# One Threshold Doesn't Fit All Markets

> Replacing a fixed outlier-clipping threshold with a dynamic, destination-aware formula — designed to stay computationally lightweight for production at scale, while treating large and small markets proportionally and maintaining signal detection quality.

**Skills:** Statistical signal processing, outlier detection, variance reduction, pricing analytics, parameter fitting, multi-market analysis

## Key Outcomes
- Fixed threshold was systematically over-clipping small markets and under-clipping large ones, introducing directional bias across destinations
- Dynamic threshold formula — scaled by revenue metrics per destination — narrowed the spread of remaining signal value from a ~17-percentage-point range to ~8 percentage points across all markets

---

## Article

### Motivation

Winsorization — capping extreme values at a chosen percentile rather than removing them — is a standard technique for handling outliers in financial and business metrics. In a pricing system that reads daily booking-level revenue signals, individual outlier bookings can dominate the signal and cause the optimization model to chase noise rather than a genuine pricing opportunity. Winsorization fixes this: bookings above a threshold are clipped to that threshold value before the signal is computed.

The problem is that a threshold is a policy, and policies applied uniformly across different populations embed assumptions that may not hold everywhere. A booking that represents a 99th-percentile outlier in a smaller, lower-average-revenue market might be an entirely ordinary booking in a high-volume market. When you apply the same fixed threshold to both, you clip the smaller market more aggressively — its signal is effectively blunted, with more genuine variance removed alongside the noise.

An additional constraint on any solution is speed: the pricing dataset is large, and multiple optimization processes run concurrently against it. A more sophisticated threshold design is only viable if it stays computationally simple — the goal is a formula with as few global parameters as possible that can be computed at destination level without adding meaningful latency.

This project replaced the fixed winsorization threshold with a dynamic formula that scales with the revenue profile of each destination — making the outlier treatment proportional to what "extreme" actually means in each market.

### Approaches

- **Diagnosing the bias from the fixed threshold.** The first step was demonstrating that the fixed threshold was producing materially different effective winsorization levels across destinations. The metric used was "remaining signal %" — what percentage of total signal value survives after winsorization. Under the fixed threshold, this percentage ranged widely: some markets retained nearly all of their signal value; others had significant fractions clipped. The spread of this range — spanning roughly 17 percentage points across destinations — was the quantitative case for change. A well-designed threshold should produce roughly consistent remaining signal % across markets, because the goal is to remove the same proportion of extreme noise everywhere, not to remove a fixed absolute amount.

- **Deriving and fitting a destination-specific threshold formula.** The insight behind the dynamic formula is that what counts as an "outlier" in any market scales with the average revenue per booking in that market. A booking that's 10× the average transaction value is an outlier by any reasonable definition, regardless of whether the average is high or low. The formula expresses the threshold as a linear function of revenue metrics per booking, with two free parameters — a slope and an intercept — fitted using percentile-based calibration. For each destination, the empirical threshold at the target winsorization level was computed, and the two parameters were then fitted to minimize the spread of remaining signal % across all destinations, subject to the constraint that the overall average winsorization level matched the existing system's — avoiding a step-change in signal behavior on launch. The result: a formula with only two global parameters, computable at destination level, that assigns higher thresholds to high-revenue markets and lower thresholds to smaller ones where the same absolute booking value is genuinely anomalous. Keeping the formula to two parameters was a deliberate design choice — simple enough for fast, scalable computation across all concurrent optimization runs. The dynamic threshold narrowed the spread of remaining signal % from ~17 percentage points to ~8, while keeping signal-detection standard error comparable to the original approach — confirming that the redesign doesn't trade away the ability to detect genuine pricing signals for better distributional consistency.

- **Year-end behavior analysis as a robustness check.** One concern with any winsorization scheme is seasonal instability. The analysis examined the year-end period as a stress test, finding that more aggressive winsorization during this period doesn't reliably reduce signal variance — because the underlying demand volatility is real, not noise, and clipping it doesn't help. This pointed toward a conservative rather than aggressive default winsorization target for normal operation.

### Key Takeaways

- **Outlier thresholds are a data preprocessing policy, and policies should be validated against the distribution they're applied to.** A universal threshold embeds an assumption: that a fixed absolute value is equally "extreme" across all markets. This assumption rarely holds when markets differ substantially in size or average transaction value. The first thing to check about any preprocessing rule that uses an absolute value is whether relative behavior matters more.

- **Remaining signal % is a more useful diagnostic than threshold value.** Evaluating winsorization by comparing the threshold number across markets is misleading — the same threshold can clip 5% of one market's signal and 25% of another's. Looking at what percentage of total signal value survives after clipping makes the asymmetry immediately visible and gives a clean optimization target for any redesign.

- **Proportional scaling is a natural default for any metric that depends on transaction size.** The formula structure — threshold as a function of revenue per booking — generalizes to any setting where outlier detection needs to be proportional to the local scale of the data. It's analogous to using percentage-of-revenue rather than absolute-revenue thresholds in financial anomaly detection, or Z-scores rather than absolute deviations in statistical testing.

- **Fitting parameters to empirical percentiles is more robust than imposing a theoretical distribution.** Rather than assuming the metric follows a specific distribution and deriving thresholds analytically, the approach fitted parameters directly from the observed per-destination threshold at the target winsorization level. This is more accurate for real data that doesn't conform to any textbook distribution, and ensures the formula is calibrated to actual market conditions rather than theoretical ones.
