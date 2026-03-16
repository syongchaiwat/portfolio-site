---
id: experiment-interactions
category: Experimentation
order: 2
tags: [Interaction Testing, Variance Decomposition, Statistical Hypothesis Testing, Experiment Design, Statistical Approximation]
demoUrl: "#"
imageAlt: Experiment interaction four-cell design and variance formula derivation
shortDescription: A statistical framework for testing whether two overlapping A/B tests are interfering with each other — and why the intuitive approximation gets the math wrong in ways that matter.
---

# When Two Experiments Collide: Detecting Statistical Interactions Between Simultaneous A/B Tests

> A statistical framework for testing whether two overlapping A/B tests are interfering with each other — and why the intuitive approximation gets the math wrong in ways that matter.

**Skills:** Interaction effect estimation, variance decomposition, statistical hypothesis testing, experimental design, statistical approximation analysis

## Key Outcomes
- Derived a correct variance formula for testing the interaction between two simultaneously running experiments, accounting for the correlation structure of overlapping user populations
- Quantified how much error the fast approximation method introduces compared to the exact method, as a function of metric variance — showing when approximation is acceptable and when it isn't
- Delivered a production-ready methodology adopted by the platform for flagging potential experiment interactions in real time

---

## Article

### Motivation

At a large consumer internet company, it's common to have dozens or even hundreds of A/B tests running at the same time. The standard assumption is that these experiments are independent: the effect of experiment A is estimated from its own users, and the effect of experiment B is estimated from its own users, and the two don't interfere with each other. In many cases, this assumption holds well enough. But not always.

Consider two experiments that both affect the booking funnel for the same type of traveller. Experiment A changes the way prices are displayed; Experiment B changes the order of search results. A user who is in the treatment group for both experiments is experiencing two changes simultaneously — and the combined effect might be more (synergy) or less (interference) than the sum of the two individual effects. If you analyse each experiment independently, you'll attribute the full combined effect to whichever experiment you look at first, and the second experiment's result will be confounded by the first.

This is the experiment interaction problem. The question is: given two simultaneously running experiments, can you test whether their effects are truly additive, or whether there's a meaningful interaction term? And if you can, how do you compute the test statistic correctly?

The tricky part is that users can belong to four cells simultaneously: control for both (CC), treatment for A only (TC), treatment for B only (CT), and treatment for both (TT). The test for interaction requires comparing the combined treatment effect against the sum of individual effects, and the variance of that comparison depends on the covariance structure across cells — which most naive implementations ignore.

### Approaches

- **Formal framing as an interaction hypothesis test.** The null hypothesis is that the total lift from both experiments equals the sum of the individual lifts: lift(A+B) = lift(A) + lift(B). A deviation from this — either positive (synergy) or negative (interference) — is what we're looking for. This is tested using a z-test on the interaction term, which requires computing not just the point estimate of the interaction but also its standard error. Getting the standard error right is the core challenge.

- **Exact variance derivation for the four-cell design.** The correct variance formula for the interaction term needs to account for the fact that the same users appear in the denominator of multiple effect estimates. Users in the TT cell contribute to both lift(A) and lift(B), creating a covariance term between the two estimates. The analysis derived this formula from first principles, starting from the variance of each cell's mean and carefully tracking the covariance structure. The result is a formula that correctly handles the correlation, and it differs from the naive formula that treats the cells as independent.

- **Fast approximation method and its error bounds.** An exact variance calculation requires knowing the per-cell metric distributions, which can be computationally expensive at scale. The analysis also derived a faster approximation based on the number of bookings in each cell (rather than the full metric distribution). This approximation is used in the platform's real-time monitoring. To understand when it's trustworthy, the team compared its results against the exact method across a range of synthetic scenarios with varying metric variance. The comparison showed that the approximation error is proportional to the metric variance: at low variance (typical for search teams), it's negligible; at high variance (typical for teams with heavy-tailed booking distributions), the discrepancy becomes large enough to cause incorrect conclusions.

- **Validation on real experiment pairs.** The methodology was applied to a set of real experiment pairs that teams had flagged as potentially interacting. This served both as a real-world sanity check and as a demonstration of the method's practical utility. The results were used to update the platform's interaction-testing module, replacing the previous approximation-only approach with a switch between exact and approximate methods depending on the observed metric variance.

### Key Takeaways

- **Experiment independence is an assumption, not a guarantee.** In a platform with high experiment density, some degree of overlap is inevitable. Rather than hoping that interactions don't exist, build the tooling to detect them. A well-designed interaction test can be run as a standard diagnostic on any pair of simultaneously running experiments, particularly when they target overlapping user populations and adjacent parts of the product.

- **The variance formula for a multi-experiment design is not the same as the sum of individual variances.** This is a common mistake. When the same users appear in multiple treatment cells, the estimates of individual lifts are correlated, and the variance of their difference needs to account for that correlation explicitly. Using the wrong formula — as was the case in the platform's original implementation — can lead to inflated or deflated z-scores and incorrect detection rates.

- **Approximation methods are useful, but you need to know their failure mode.** The fast approximation for interaction testing is accurate when metric variance is low, but degrades as variance increases. This is a general principle: before deploying any statistical approximation at scale, understand the conditions under which it breaks down and build monitoring to catch those cases. An approximation that works 95% of the time but silently fails 5% of the time in high-variance situations is more dangerous than no approximation at all, because it creates false confidence.

- **Synergy and interference between experiments have different business implications.** If two experiments interfere (TT effect < TC + CT), you may be underestimating the value of one or both features when analysed in isolation. If they synergise (TT effect > TC + CT), the combined rollout may deliver more value than you expect. Detecting interactions early — before decisions are made on individual experiments — allows you to sequence rollouts more intelligently and extract more business value from your experimentation programme.
