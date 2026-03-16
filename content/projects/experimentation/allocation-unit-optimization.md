---
id: allocation-unit-optimization
category: Experimentation
order: 4
tags: [Variance Decomposition, Signal-to-Noise Analysis, Intraclass Correlation, Causal Inference, Experiment Design]
demoUrl: "#"
imageAlt: MDE comparison across user-level, session-level, and compound allocation units by page type
shortDescription: An empirical investigation into whether finer-grained allocation units — session-level or compound user×property — can reduce experiment duration for front-end teams, without introducing causal contamination or cannibalization.
---

# The Unit of Experimentation: Can a Smarter Allocation Unit Shrink Your MDE?

> An empirical investigation into whether finer-grained allocation units — session-level or compound user×property — can reduce experiment duration for front-end teams, without introducing causal contamination or cannibalization.

**Skills:** Variance decomposition, signal-to-noise analysis, intraclass correlation, causal inference in experimentation, experiment design

## Key Outcomes
- Found that session-level allocation offers modest MDE improvement on paper, but the causal assumptions required to justify it don't hold in practice for most front-end features
- Showed that compound user×property allocation reduces MDE for booking metrics meaningfully, but the gain is surface-dependent: it works for property detail pages, where the unit aligns with the treatment, but introduces unacceptable noise on search result pages due to cannibalization
- Provided concrete guidance to front-end teams on which experiments can benefit from the new allocation approach and what to watch for in early monitoring

---

## Article

### Motivation

Speed is a competitive advantage in A/B testing. The faster you can run an experiment and get a reliable result, the more decisions you can make per quarter, and the more rapidly a product can improve. One of the most underappreciated levers for experiment speed is the choice of allocation unit — the entity that gets randomly assigned to treatment or control.

Most A/B tests at consumer internet companies default to user-level allocation: each user is randomly assigned to see either the control or the treatment experience, and they stay in that assignment throughout the experiment. This is the safest and most interpretable approach. But it's not always the most efficient. If your feature only affects a specific type of user interaction — say, viewing a particular hotel — then allocating at the user level introduces a lot of irrelevant noise: the same user might visit dozens of properties, most of which have nothing to do with the treatment. You're measuring a signal that's diluted by a lot of irrelevant exposure.

The question this investigation set out to answer was: can we reduce that noise by allocating at a finer unit — either at the session level (each browsing session is a separate unit) or at the compound user×property level (a user's interaction with a specific hotel is treated as a separate unit)? If yes, how large is the MDE reduction, and are there any downsides?

At Agoda, experiments run twice: a **decision run** to measure whether to ship a feature, and a **measurement run** to quantify the unbiased business impact after the decision is made. Reducing MDE means shortening both of these, compounding the efficiency gain across the full experiment lifecycle.

### Approaches

- **Session-level allocation: empirical feasibility check.** Before any variance calculation, the analysis examined the actual relationship between sessions and users in real traffic data. The key finding was that the vast majority of sessions involve exactly one user, and the vast majority of bookings are uniquely attributable to a single user-session pair. This tells you something important: while session allocation would technically create more allocation units (and therefore lower variance), the practical gain is limited — there simply isn't much within-user, cross-session variance to exploit. The analysis also identified a more fundamental causal concern: session allocation assumes that the treatment in session A affects behaviour only within session A, with no spillover to session B for the same user. For many front-end features — where a user's experience in one session shapes their intent in the next — this assumption fails. Adopting session allocation in these cases would produce biased estimates, not faster ones.

- **Two-level winsorization for session-based metrics.** For the session allocation scenario, the team constructed a booking-per-session metric and evaluated its variance properties with two-level winsorization: first capping extreme values of bookings per session, then capping the per-user aggregate of session-level bookings. This kind of layered winsorization is necessary when the metric has variance at multiple levels of aggregation — without it, a single outlier user with many unusual sessions can dominate the variance estimate.

- **Compound user×property allocation: variance decomposition by page type.** For property detail pages, a user's interaction with a specific hotel is a natural causal unit — the treatment is displayed on that page, and the outcome (booking or not) is directly attributable to that user-property interaction. The analysis computed the effective variance reduction from using user×property pairs as allocation units instead of users alone, taking into account that each user may interact with multiple properties (creating correlation between units). The decomposition showed a meaningful MDE reduction — bringing experiment duration down by roughly a fifth for booking metrics on property pages.

- **Cannibalization risk on search result pages.** The picture was different for search result pages. On a search results page, the treatment affects the entire list of properties shown — which means that if property A gets a more prominent display, property B might get less attention, and vice versa. Allocating at the user×property level here creates an interference problem: the treatment effect on one unit (user viewing property A) is directly affected by the treatment status of other units (user viewing property B in the same session). This is the cannibalization problem, and it means that the naive variance reduction estimate is optimistic — the true gain is smaller, and in some cases the estimates can be directionally misleading.

### Key Takeaways

- **The right allocation unit is the causal unit.** The entity you allocate to treatment should be the entity that experiences the treatment and generates the outcome you care about. If those don't align, you introduce either variance (from irrelevant noise) or bias (from spillover). The allocation unit decision isn't just a statistical optimisation — it's a causal design choice.

- **Variance reduction from finer allocation only materialises when within-unit variance is high.** If most of the relevant variation in your outcome metric already exists between users (rather than between sessions or property interactions within the same user), switching to a finer unit gains you little. The first step in any allocation unit analysis should be an empirical decomposition of where the variance actually lives.

- **Cannibalization is a ceiling on how much finer allocation can help on competitive surfaces.** On any surface where showing one item less prominently means another gets more attention (search results, recommendation feeds, ranked lists), treatment effects on individual items are not independent. Before adopting compound allocation on these surfaces, you need a model of how large the cannibalization effect is likely to be — and whether the efficiency gain survives it.

- **Page-type specificity matters.** A single allocation unit policy applied uniformly across a product with many different page types will be suboptimal for most of them. The right answer for a property detail page (where user×property allocation works well) is different from the right answer for a search results page (where it creates interference). Experiment infrastructure should ideally support page-type-specific allocation strategies, even if the default is conservative user-level allocation.
