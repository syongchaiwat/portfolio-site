---
id: softcap-redesign
category: Pricing Optimization
order: 2
tags: [Algorithm Design, Optimization Geometry, Reinforcement Learning, Production ML, Parameter Tuning, A/B Impact Analysis]
demoUrl: "#"
imageAlt: Downlift-cashback constraint triangle showing sensitive and insensitive regions under old and new capping logic
shortDescription: Replacing a sequential hard-capping algorithm with a simultaneous soft-capping system — transforming large "insensitive" regions of the optimization space into regions where price signals can actually be read and acted on.
---

# Rewriting the Rules: A New Capping System for Pricing Optimization

> Replacing a sequential hard-capping algorithm with a simultaneous soft-capping system — transforming large "insensitive" regions of the optimization space into regions where price signals can actually be read and acted on.

**Skills:** Algorithm design, optimization geometry, reinforcement learning, production system implementation, parameter tuning, A/B impact analysis

## Key Outcomes
- Old sequential capping logic created regions where noise injections produced zero actual change in treatment — effectively blinding the RL model to signals in those areas
- New softcap approach rescales downlift and cashback simultaneously toward a geometric centroid, ensuring all intended changes produce measurable actual output
- The majority of eligible bookings with negative intended cashback under the old cap were unlocked for optimization under the new system
- Key parameters selected via grid search against a sample of production bookings — short-term LTC cost accepted in exchange for long-term optimization gains
- Convergence simulation confirmed the new cap always reaches the optimal point; the old cap could get permanently stuck in insensitive regions

---

## Article

### Motivation

Every pricing system has caps — boundaries on how much discount or cashback can be applied to any given offer. These caps exist for legitimate reasons: hotels set minimum prices, business rules set maximum exposure, and margins must be protected. The assumption, usually implicit, is that caps are passive constraints — they just prevent the system from going too far. What this project discovered is that caps are not passive at all. The shape and logic of your capping algorithm determines what your optimization system can and cannot learn.

At Agoda, the pricing system applies downlift (an instant, visible discount) and cashback (a post-booking cash reward claimable after the guest's stay) as two separate levers. The old capping logic was sequential: first apply the downlift cap, then apply the cashback cap on whatever remains. This is intuitive and easy to reason about in isolation. But when the reinforcement learning model injects small noise perturbations to read the pricing signal, the sequential cap creates large regions of the price space where those perturbations produce no change in the actual treatment applied to customers. The model injects +0.5% cashback. The cap absorbs it. The actual cashback stays the same. The signal the model reads is zero. It learns nothing. These were called "insensitive regions" — and they weren't edge cases. They covered a substantial share of everyday bookings.

The softcap project was a full redesign of this capping logic: replacing the sequential approach with a simultaneous one that treats downlift and cashback as a joint optimization problem.

### Approaches

- **Geometric framing of the DL/CB constraint space.** The key insight that unlocked the redesign was representing the cap constraints geometrically. Downlift and cashback are two numbers (each as a percentage of selling price), and the constraints on them — minimum downlift cap, minimum cashback cap, combined maximum cap — define a triangle in 2D space. The set of valid (DL, CB) combinations is the interior of this triangle. The old sequential logic mapped the intended (DL, CB) point to the nearest valid point on the boundary, but in a way that was asymmetric: adjusting cashback could inadvertently change the effective downlift, and vice versa. The softcap logic instead maps the intended point toward the centroid of the constraint triangle, rescaling both DL and CB proportionally. This ensures that every small perturbation in the intended treatment produces a small, proportional change in the actual treatment — across the entire constraint space, not just near the unconstrained interior.

- **Identifying insensitive regions in the old capping logic.** Before designing the replacement, the old cap's failure modes were mapped explicitly. The analysis identified three types of regions under the old logic: fully insensitive (where noise in either direction produces no change), partially insensitive (where noise in one direction is absorbed), and sensitive (where noise correctly propagates to actual treatment). The finding was that sensitive regions covered a surprisingly small fraction of the feasible space — and that a large share of actual production bookings fell into insensitive or partially insensitive regions. This wasn't a theoretical problem; it was actively degrading signal quality in the live system.

- **Simultaneous rescaling logic with soft and hard caps.** The softcap implementation introduces an intermediate layer between the intended (DL, CB) and the hard caps. When the intended point falls inside the soft cap boundaries (a fraction of the way toward the hard caps), no rescaling occurs — the model is in the "sensitive" zone. When the intended point falls between a soft cap and the corresponding hard cap, the value is rescaled: instead of being clamped to the hard boundary, it's mapped to a value between the soft cap and the hard cap, proportional to how far the intended value has gone. The two key parameters — softcap_scaler (which sets how close the soft cap sits to the hard cap) and mapping_multiplier (which controls how aggressively values are compressed near the hard cap) — were selected via a parameter grid search on a sample of production bookings. The selection criteria balanced three things: noise signal quality (measured by what fraction of noise injections produce a meaningful actual change), average treatment level (to avoid unintended cost shifts), and short-term LTC impact.

- **Convergence simulation to validate the redesign end-to-end.** Rather than just validating the static properties of the new cap, the analysis simulated the full optimization loop: start with an arbitrary (intended DL, intended CB) point, inject noise, compute actual treatment via the capping logic, read the LTC response, estimate elasticity, and step in the direction of increasing LTC. Repeat until convergence. Under the old cap, this simulation got permanently stuck for certain starting conditions — the model would reach an insensitive region, read a zero elasticity signal, and stop moving even when the true optimum was elsewhere. Under the new softcap, every starting condition converged to the true optimum. This end-to-end simulation was the strongest validation of the redesign, because it tested not just the static coverage of sensitive regions but the dynamic behavior of the optimization loop over time.

### Key Takeaways

- **The shape of your constraint space determines the quality of your optimization signal.** This is the core lesson of the project, and it generalizes well beyond pricing. Any system that uses noise injection or perturbation to read a signal — which includes essentially all RL systems with exploration — must ensure that the constraints it operates under don't absorb the perturbations. If they do, the system learns nothing in those regions, and the optimization gradually loses coverage of large parts of the feasible space.

- **Sequential constraint application creates asymmetry that is difficult to predict analytically.** The old cap's behavior in edge cases wasn't intentional — it was an emergent property of applying two separate constraints in sequence. This is a general warning about sequential rule systems: each rule is simple, but interactions between rules can produce complex and counterintuitive behavior at the boundaries. Geometric or simultaneous formulations are often worth the additional complexity because they make the constraint behavior explicit and predictable.

- **Short-term cost can be the right trade for long-term optimization capability.** The softcap redesign had a measurable short-term LTC cost — the average treatment shifted slightly, which temporarily reduced margin. This was a deliberate and validated trade: the short-term cost was bounded and estimable, while the long-term benefit (recovering signal quality across a large share of bookings) was expected to compound over time as the RL model regained the ability to optimize in previously insensitive regions. Being able to quantify this trade-off — and defend it to business stakeholders — was as important as designing the algorithm itself.

- **Parameter selection for production ML systems requires multi-objective evaluation.** Choosing softcap_scaler and mapping_multiplier wasn't a single-metric optimization. There were three objectives in tension: better noise signal quality, minimal average treatment shift, and acceptable short-term LTC cost. The grid search made these trade-offs explicit and transparent, which is important both for the immediate decision and for future tuning if conditions change.
