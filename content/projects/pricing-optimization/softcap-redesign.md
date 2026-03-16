---
id: softcap-redesign
category: Pricing Optimization
order: 2
tags: [Algorithm Design, Optimization Geometry, Reinforcement Learning, Production System Implementation, Parameter Tuning, Cross-Team Technical Communication]
demoUrl: "#"
imageAlt: Downlift-cashback constraint triangle showing sensitive and insensitive regions under old and new capping logic
shortDescription: Replacing a sequential hard-capping algorithm with a simultaneous soft-capping system — transforming large "insensitive" regions of the optimization space into regions where price signals can actually be read and acted on.
---

# Rewriting the Rules: A New Capping System for Pricing Optimization

> Replacing a sequential hard-capping algorithm with a simultaneous soft-capping system — transforming large "insensitive" regions of the optimization space into regions where price signals can actually be read and acted on.

**Skills:** Algorithm design, optimization geometry, reinforcement learning, production system implementation, parameter tuning, cross-team technical communication

## Key Outcomes
- New softcap approach rescales downlift and cashback simultaneously, ensuring all intended changes produce a measurable actual output — unlocking the RL model's ability to read signal across the full constraint space
- By treating downlift and cashback symmetrically and with equal priority, the new system enables cross-optimization between the two levers — a fundamental blocker under the old sequential logic, and the reason marketing teams often had to manually substitute one for the other in specific markets
- The majority of eligible bookings with intended cashback below the old minimum cap were unlocked for optimization under the new system
- Parameter study across ~6.6 million production bookings enabled more than double the cashback treatment to be effectively readable as signal, while preserving interpretability of the mapping function
- Designed the full implementation flowchart integrating softcap with all existing cap-related backend variables across teams — including test cases covering all possible scenarios — and led alignment with engineering and business stakeholders whose workflows were affected

---

## Article

### Motivation

Every pricing system has caps — boundaries on how much discount or cashback can be applied to any offer. The assumption, usually implicit, is that caps are passive constraints: they just prevent the system from going too far. What this project discovered is that caps are not passive at all. Three specific failures in the old sequential logic motivated a full redesign. First, applying the downlift cap and cashback cap in sequence created large "insensitive" regions where the RL model's noise injections produced no change in actual treatment, making the pricing signal completely unreadable there. Second, the sequential order made downlift and cashback asymmetric: the two levers couldn't be treated with equal priority or substituted for each other cleanly. Third, that asymmetry made it structurally difficult to replace downlift with cashback in specific markets — something marketing teams regularly needed to do to test regional hypotheses — without hitting edge cases in the capping logic.

### Approaches

- **Mapping insensitive regions in the old capping logic.** Before designing any replacement, the old cap's failure modes were mapped explicitly. The analysis identified three region types under the old sequential logic: fully insensitive (noise in either direction produces no change in actual treatment), partially insensitive (noise in one direction is absorbed), and sensitive (noise correctly propagates). The key finding was that insensitive and partially insensitive regions together covered a substantial share of actual production bookings — this was not a theoretical edge case, it was actively degrading signal quality for a large fraction of the daily RL optimization runs. Quantifying this was the prerequisite that justified the full redesign rather than a patch.

- **Geometric framing of the constraint space and simultaneous rescaling.** The redesign started by representing the cap constraints geometrically. When both the downlift and cashback minimum caps are zero, the set of valid (DL, CB) pairs forms a clean triangle in 2D space: each axis is bounded below by zero and jointly bounded above by the shared margin constraint (DL + CB ≤ margin). In the more general case — where the downlift minimum cap is negative or undefined, meaning the RL model can actually increase the price — the feasible region takes a different shape, but the same simultaneous-rescaling principle applies. The old sequential logic mapped the intended (DL, CB) point to the nearest boundary asymmetrically: adjusting cashback could inadvertently shift the effective downlift, and vice versa. The softcap logic instead rescales both DL and CB proportionally when the intended point falls outside the soft cap boundary — ensuring every perturbation produces a proportional, observable change in actual treatment across the full feasible space.

- **Parameter selection via grid search on production bookings.** Two parameters govern the softcap behavior: softcap_scaler (how close the soft cap sits to the hard cap) and mapping_multiplier (how aggressively values are compressed near the hard cap boundary). The selection criteria balanced three objectives in tension: noise signal quality (what fraction of injections produce a measurable actual change), average treatment level (to avoid unintended shifts in DL or CB that would move cost immediately), and mapping interpretability (whether the compression curve still behaves predictably near the hard cap). The selected parameters achieved more than double the effective cashback signal coverage while keeping the mapping function simple enough to reason about and explain to stakeholders.

- **Multi-dimensional impact estimation.** Validating the redesign required estimating impact across several dimensions simultaneously. The analysis compared: the distribution of actual DL and CB treatment under old vs. new logic (to confirm the new cap produces more spread and less boundary-clustering); estimated short-term cost from the average treatment shift; noise signal quality before and after (measured as the fraction of noise injections that produce a non-zero delta in actual treatment); and a convergence simulation of the full RL optimization loop — starting from arbitrary intended (DL, CB) points, injecting noise, reading the response, and stepping toward the optimum. Under the old cap, the simulation got permanently stuck for certain starting conditions: the model would reach an insensitive region, read zero elasticity, and stop moving even when the true optimum was elsewhere. Under the new softcap, every starting condition converged. Together, these views gave a complete picture of both the static and dynamic behavior of the redesign.

- **Implementation flowchart and cross-team alignment.** Caps in a production pricing system are not a single clean input — they are the combined result of rules from many teams: hotel-set minimums, business-set maximums, campaign-specific overrides, payment-model adjustments, and regional rules. Understanding how all of these interact to produce a single effective minimum DL cap or maximum CB cap required mapping the full backend variable dependency chain. Designing the softcap to sit correctly within this system — and ensuring it behaved correctly in all edge case combinations — required writing explicit test cases covering every possible scenario: both DL and CB at their hard caps, one lever at minimum while the other is unconstrained, negative DL minimum (price increase allowed), and so on. Because the softcap change affected everyone working with pricing campaigns, alignment sessions with engineering and business teams were needed to walk through the implementation logic, explain the new behavior at boundaries, and get sign-off before launch.

### Key Takeaways

- **The shape of your constraint space determines the quality of your optimization signal.** Any system that uses noise injection or perturbation to read a signal — which includes essentially all RL systems with exploration — must ensure that its constraints don't absorb the perturbations. If they do, the system learns nothing in those regions, and optimization gradually loses coverage of large parts of the feasible space. This is not a property that shows up in offline evaluation; it only becomes visible when you explicitly map the relationship between intended and actual treatment.

- **Sequential constraint application creates asymmetry that is difficult to predict analytically.** The old cap's failure modes weren't intentional — they were emergent properties of applying two separate constraints in sequence. Each individual rule was simple and correct in isolation; the problems lived in the interactions between rules at the boundaries. Simultaneous or geometric formulations are often worth the additional upfront complexity precisely because they make constraint behavior explicit and predictable across the full feasible space, rather than leaving it to emerge from rule composition.
