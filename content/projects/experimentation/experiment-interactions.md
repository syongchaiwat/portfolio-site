---
id: experiment-interactions
category: Experimentation
order: 2
tags: [Interaction Testing, Causal Inference, Hypothesis Testing, Experiment Design, Statistical Approximation]
demoUrl: "#"
imageAlt: Experiment interaction four-cell design and variance formula derivation
shortDescription: A statistical framework for testing whether two overlapping A/B tests are interfering with each other — and why the intuitive approximation gets the math wrong in ways that matter.
---

# When Two Experiments Collide: Detecting Statistical Interactions Between Simultaneous A/B Tests

> A two-mode statistical framework for detecting interactions between simultaneously running A/B tests — a fast approximation for routine monitoring across hundreds of concurrent experiments, and a rigorous exact method for cases where the approximation can't be trusted.

**Skills:** Interaction effect estimation, variance decomposition, statistical hypothesis testing, experimental design, statistical approximation analysis

## Key Outcomes
- Derived a correct statistical test for experiment interaction, accounting for the covariance structure that emerges when the same users appear in multiple treatment cells 
- Quantified the conditions under which the fast approximation diverges from the exact method using simulation across real booking distributions from different product teams — showing when each approach is appropriate
- Delivered a production-ready two-mode methodology adopted by the platform, giving product owners a practical tool to check whether their experiments are interfering with others

---

## Article

### Motivation

At a large consumer internet company running hundreds of A/B tests simultaneously, the assumption underlying every experiment is independence: the effect of your experiment is estimated from your own users, and other experiments running at the same time don't interfere with yours. This assumption enables high experimentation velocity — each team designs, runs, and makes decisions on their own experiments without waiting for anyone else, and each decision is made independently. But the assumption is not always true.

Because each experiment is set up independently, users are assigned to cells separately for each one. A single user can be in cell A or B of experiment 1, and independently in cell A or B of experiment 2 — creating four possible combinations: control for both, treatment for experiment 1 only, treatment for experiment 2 only, or treatment for both. When two experiments affect overlapping parts of the product — the same funnel, adjacent features, the same type of user — the combined effect on a user in both treatment groups may be more or less than the sum of the two individual effects. If you analyse each experiment independently, you'll attribute the full combined effect to both, and neither result is entirely trustworthy.

In practice, many experiment pairs won't interact at all — a change to the search results page is unlikely to interfere with a change to the payment confirmation screen. But keeping track of which pairs might interact is the product owner's responsibility, and it's hard when dozens of experiments are running across different teams at any given time. The goal of this project was to give product owners a tool to check any pair of simultaneously running experiments — fast enough for routine screening, accurate enough to be trusted when it matters.

### Approaches

- **Framing the interaction test and the two-method design.** The null hypothesis is that the combined lift from both experiments equals the sum of individual lifts. A deviation in either direction indicates interaction. Two methods for testing this were developed. The fast approach uses counts of bookings per cell (AA, AB, BA, BB): its null hypothesis is that the number of bookers in the same-treatment cells (AA+BB) equals the number in the cross-treatment cells (AB+BA). The correct approach is based on mean bookings per user — a stricter formulation whose null hypothesis states that the mean outcome per user is additive across experiments. The fast method is designed for routine screening across many pairs; the exact method is reserved for cases where a genuine interaction is suspected and accuracy matters.

- **Why the correct method is slower and when it's necessary.** The correct approach requires attributing individual users to each of the four cells — knowing not just booking counts but how many distinct users landed in each group. This is computationally expensive: joining experiment allocation records to user-level booking data across concurrent experiments is slow and resource-intensive. The fast approach sidesteps this by using booker counts as a proxy, which is valid only when the four cell sizes are approximately equal. That assumption holds when the total user count is large enough that random assignment produces balanced groups — but when user counts are small or the assignment is imbalanced, the fast approximation breaks down. The minimum recommended total user count for the approximation to be reliable is around 1,000 per group.

- **Simulation to identify when the two approaches diverge.** To understand practically when the approximation fails, a simulation was run using real mean booking-per-user values from different product teams. Each team's funnel has a different expected booking rate per user — a search team and a payment confirmation team operate at very different conversion rates and distributional shapes. The simulation generated synthetic experiment pairs across this range and compared p-values from both methods. The finding was that divergence scales with the variance of the booking metric: at low variance (typical for search-funnel teams), the fast approximation closely tracks the exact method; at high variance (typical for teams with heavy-tailed booking distributions), the mismatch becomes large enough to produce conflicting conclusions. This directly informed the platform's decision to deploy both methods with a variance-based routing rule.

- **Production integration and adoption.** The methodology was validated on real experiment pairs that product teams had flagged as potentially interacting, confirming the test produces meaningful results in practice. The platform's existing interaction-checking module — which had been using an approximate method based on incorrect variance assumptions — was updated to incorporate both approaches. Product owners can now run a quick screening check on any pair of running experiments, with the system automatically routing to the fast method when variance is low and the exact method when variance is high or when the fast method flags a potential interaction.

### Key Takeaways

- **Experiment independence is an assumption, not a guarantee.** In a platform with high experiment density, some degree of overlap is inevitable. Rather than hoping that interactions don't exist, build the tooling to detect them. The cost of running an interaction check is low; the cost of shipping two features that interfere with each other — and attributing the combined confounded effect to the wrong cause — is high.

- **Approximation methods are useful, but you need to know their failure mode.** The fast approximation for interaction testing is accurate when metric variance is low, but degrades as variance increases. This is a general principle: before deploying any statistical approximation at scale, understand the conditions under which it breaks down and build in a mechanism to escalate to the exact method. An approximation that silently fails in high-variance situations is more dangerous than no approximation at all, because it creates false confidence.
