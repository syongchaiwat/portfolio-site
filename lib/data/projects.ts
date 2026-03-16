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
  // ── Pricing Optimization ──────────────────────────────────────────────────
  {
    id: "hazard-rate-cashback",
    category: "Pricing Optimization",
    title: "From Static to Dynamic: Survival Analysis for Cashback Claim Rate Forecasting",
    shortDescription:
      "Replacing a static claim rate predictor with a hazard rate model — enabling fresher training data, daily-updating predictions, and a more correct logical framing of the cashback claimability timeline.",
    longDescription:
      "Agoda's cashback claim rate model was trained exclusively on bookings where the full 180-day claimability window had expired, leaving training data perpetually six months stale. This project first validated the problem — decomposing the weighted claim rate into behavior-shift and amount-distribution-shift components, confirming the two move largely independently — then reframed prediction as a survival analysis problem. Instead of asking 'will this booking ever be claimed,' the hazard rate model asks 'given this booking hasn't been claimed yet, what is the probability it will be claimed today?' This shift enabled training on 60-day-old bookings and daily-updating predictions.",
    outcomes: [
      "Decomposed the weighted claim rate into a behavior-shift component and an amount-distribution-shift component — confirming the two move largely independently (correlation ~0.24), validating that the 6-month training lag was a real problem worth solving",
      "Hazard rate model enables training on 60-day-old bookings (vs. 180-day minimum under the previous approach) — dramatically fresher training signal and faster adaptation to behavior changes",
      "Chronological train/test split outperforms random split on held-out future periods — critical for correctly evaluating a model deployed into changing real-world conditions",
      "Identified a systematic LightGBM bias when training separate models per time step: a single combined model predicting all hazard steps outperforms per-step models by reducing over/under-prediction at specific days",
      "New model updates predictions daily as the expiry deadline approaches — eliminating the sharp cost discontinuity that occurred when bookings expired under the old static model",
    ],
    tags: ["Survival Analysis", "Hazard Rate Modeling", "LightGBM", "Statistical Decomposition", "ML Production Pipelines", "Model Calibration"],
    githubUrl: "https://github.com",
    demoUrl: "#",
    imageAlt: "Hazard rate curves across the 120-day cashback claimability window",
    article: {
      motivation:
        "Cashback at Agoda follows a specific lifecycle: a booking earns a cashback reward 60 days after checkout, which the customer can then claim for 120 days (until day 180 post-checkout). The old claim rate model was trained exclusively on bookings where this claimability window had fully expired — meaning only bookings more than 180 days old were included in training data. This design had two significant drawbacks: the training data was always at least six months stale, and the model issued a single static prediction for each booking at creation and never updated it.\n\nBefore committing to a new model, there was a prior question to answer: is the six-month lag actually a problem? The weighted claim rate is amount-weighted, not a simple average. This means observed changes in the metric conflate two very different things: genuine shifts in customer claiming behavior, and shifts in the distribution of cashback amounts. The staleness problem only bites when customer behavior itself changes — when people claim more or less often within a given cashback amount range.\n\nTo answer this, the weighted claim rate was decomposed into two components: one capturing within-bin claim rate changes (the behavior shift) and one capturing changes in the amount distribution itself. Measured across several years of production data, the two components showed very low correlation (~0.24) — meaning they move largely independently, and behavior does genuinely shift on its own. This confirmed that the training lag was a real and recurring problem — not an artifact of how the metric is constructed.\n\nThe hazard rate approach solves both problems by reframing the question. Instead of predicting 'will this booking ever be claimed,' it asks 'given that this booking hasn't been claimed yet, what is the probability it will be claimed today?' This shift opens up the ability to use partial observations, incorporate the time dimension explicitly, and update predictions continuously as more days pass without a claim.",
      approaches: [
        "Decomposing the claim rate metric to validate the problem before building the solution. Because the observed claim rate is amount-weighted, it changes whenever either customer behavior or the cashback amount distribution shifts. To determine which was driving observed changes, the metric was decomposed into a behavior-shift term (changes in claim rate within cashback amount bins) and a distribution-shift term (changes in how cashback amounts are distributed). The two components showed low correlation (~0.24) across years of production data — confirming genuine behavior shifts are real and recurring, and that a model with a six-month lag will consistently miss them.",
        "Reframing claim rate as a survival analysis problem. The hazard rate h(d) is defined as the probability that claiming occurs on day d given it hasn't occurred on any previous day. The full claim rate for any booking is 1 minus the product of (1 − h(d)) across all days from 0 to 120. This formulation allows computing an updated claim rate estimate at any point in the claimability window — a booking that hasn't claimed after 30 days has lower remaining claim probability than one at day 3, and the model captures this naturally.",
        "Exploded dataset design: one row per booking per day. To train a model predicting hazard rates, each booking is transformed into a sequence of rows — one per day in the claimability window — where each row asks 'was this booking claimed on this specific day, given it wasn't claimed on any previous day?' This format allows a standard binary classifier to learn the hazard function and enables partially observed bookings (60–180 days old) to contribute valid training rows before their final outcome is known.",
        "Resampling for manageable training data size. The exploded dataset is large — each booking generates up to 120 rows. A resampling strategy based on the CDF of claim days was used: days near the expected claim timing are sampled more densely, and early days are downsampled. Sampling corrections are factored into training weights to prevent systematic bias in hazard rate estimates.",
        "Chronological train/test split to simulate real deployment conditions. The naive random 80/20 split produces a validation set from the same time period as training — optimistic for a model deployed to predict future bookings. The chronological split tests exactly what matters: train on bookings up to a cutoff date, validate on bookings after it. In experiments with injected claim rate shifts, chronological split models adapted significantly better to the shift than models evaluated with random splits.",
        "Diagnosing and fixing systematic LightGBM bias in multi-step hazard prediction. When structured as separate models per day in the claimability window, a systematic bias emerged: models for early days underpredicted hazard rates while models for later days overpredicted. The fix was to train a single combined model that takes day index as a feature alongside booking-level features. This model shares information across days, naturally smoothing the hazard curve and preventing overfitting on individual days.",
      ],
      keyTakeaways: [
        "Survival analysis is not just for clinical research — it's a natural fit for any system where the timing of an event matters. Whenever you have right-censored data (outcomes not yet known because the observation window hasn't closed), survival analysis unlocks training on partial observations that would otherwise be excluded. For cashback, this alone cut the minimum data age for training from 180 days to 60 days.",
        "Reframing 'will it happen?' as 'will it happen today, given it hasn't happened yet?' changes what you can model. The hazard rate formulation incorporates time explicitly, which the original claim rate model didn't. A booking that hasn't been claimed after 90 days should receive a very different prediction than one at day 5 — the hazard model handles this naturally, while a static model would require manual feature engineering to capture the same information.",
        "Random train/test splits can give dangerously optimistic validation accuracy for models deployed into a changing world. When temporal drift is present — and in almost any real-world system, it is — the gap between random-split validation accuracy and true future performance can be large. Chronological splits are a more honest test, and the magnitude of the difference is itself diagnostic: a large gap is a signal that the model's features are drifting.",
        "Validate the problem before building the solution — especially when the metric conflates multiple causes. The weighted claim rate is amount-weighted, which means it responds to two independent phenomena: customer behavior and amount distribution. A new model only helps with one of them. Any time your target metric is a weighted aggregate, ask whether a shift reflects the thing your model is supposed to learn, or whether it could be explained by a compositional change.",
        "Shared models across related tasks often outperform task-specific models when data is limited or imbalanced. The finding that one combined hazard model outperforms 11 separate per-day models is an instance of a general principle: when individual tasks share structure, sharing parameters via a joint model improves regularization and reduces overfitting on any single task.",
      ],
    },
  },
  {
    id: "softcap-redesign",
    category: "Pricing Optimization",
    title: "Rewriting the Rules: A New Capping System for Pricing Optimization",
    shortDescription:
      "Replacing a sequential hard-capping algorithm with a simultaneous soft-capping system — transforming large \"insensitive\" regions of the optimization space into regions where price signals can actually be read and acted on.",
    longDescription:
      "Agoda's pricing system applies downlift and cashback as two separate levers, bounded by sequential caps — but this sequential capping logic inadvertently created large regions of the optimization space where RL noise injections produced zero actual change in treatment, blinding the model to pricing signals in those areas. This project redesigned the capping logic from sequential to simultaneous, representing the constraint space geometrically as a triangle and mapping intended treatment toward its centroid rather than clamping to its boundary. Convergence simulations confirmed the new system always reaches the true optimum; the old cap could get permanently stuck in insensitive regions.",
    outcomes: [
      "Old sequential capping logic created regions where noise injections produced zero actual change in treatment — effectively blinding the RL model to signals in those areas",
      "New softcap approach rescales downlift and cashback simultaneously toward a geometric centroid, ensuring all intended changes produce measurable actual output",
      "The majority of eligible bookings with negative intended cashback under the old cap were unlocked for optimization under the new system",
      "Key parameters selected via grid search against a sample of production bookings — short-term LTC cost accepted in exchange for long-term optimization gains",
      "Convergence simulation confirmed the new cap always reaches the optimal point; the old cap could get permanently stuck in insensitive regions",
    ],
    tags: ["Algorithm Design", "Optimization Geometry", "Reinforcement Learning", "Production ML", "Parameter Tuning", "A/B Impact Analysis"],
    githubUrl: "https://github.com",
    demoUrl: "#",
    imageAlt: "Downlift-cashback constraint triangle showing sensitive and insensitive regions under old and new capping logic",
    article: {
      motivation:
        "Every pricing system has caps — boundaries on how much discount or cashback can be applied to any given offer. These caps exist for legitimate reasons: hotels set minimum prices, business rules set maximum exposure, and margins must be protected. The assumption, usually implicit, is that caps are passive constraints — they just prevent the system from going too far. What this project discovered is that caps are not passive at all. The shape and logic of your capping algorithm determines what your optimization system can and cannot learn.\n\nAt Agoda, the pricing system applies downlift (an instant, visible discount) and cashback (a post-booking cash reward claimable after the guest's stay) as two separate levers. The old capping logic was sequential: first apply the downlift cap, then apply the cashback cap on whatever remains. This is intuitive and easy to reason about in isolation. But when the reinforcement learning model injects small noise perturbations to read the pricing signal, the sequential cap creates large regions of the price space where those perturbations produce no change in the actual treatment applied to customers. The model injects a small noise. The cap absorbs it. The actual treatment stays the same. The signal the model reads is zero. It learns nothing.\n\nThese were called 'insensitive regions' — and they weren't edge cases. They covered a substantial share of everyday bookings. The softcap project was a full redesign of this capping logic: replacing the sequential approach with a simultaneous one that treats downlift and cashback as a joint optimization problem.",
      approaches: [
        "Geometric framing of the DL/CB constraint space. The key insight that unlocked the redesign was representing the cap constraints geometrically. Downlift and cashback are two numbers, each as a percentage of selling price, and the constraints on them define a triangle in 2D space. The old sequential logic mapped the intended point to the nearest valid point on the boundary in an asymmetric way: adjusting cashback could inadvertently change the effective downlift, and vice versa. The softcap logic instead maps the intended point toward the centroid of the constraint triangle, rescaling both DL and CB proportionally — ensuring every small perturbation in intended treatment produces a small, proportional change in actual treatment across the entire constraint space.",
        "Identifying insensitive regions in the old capping logic. Before designing the replacement, the old cap's failure modes were mapped explicitly into three types: fully insensitive (where noise in either direction produces no change), partially insensitive (where noise in one direction is absorbed), and sensitive (where noise correctly propagates to actual treatment). The finding was that sensitive regions covered a surprisingly small fraction of the feasible space, and a large share of production bookings fell into insensitive or partially insensitive regions.",
        "Simultaneous rescaling logic with soft and hard caps. The softcap implementation introduces an intermediate layer between the intended treatment and the hard caps. When the intended point falls inside the soft cap boundaries, no rescaling occurs. When it falls between a soft cap and the corresponding hard cap, the value is rescaled — mapped proportionally between the soft cap and the hard cap. The two key parameters (softcap_scaler and mapping_multiplier) were selected via a parameter grid search balancing noise signal quality, average treatment level, and short-term LTC impact.",
        "Convergence simulation to validate the redesign end-to-end. Rather than just validating static properties of the new cap, the analysis simulated the full optimization loop: inject noise, compute actual treatment via the capping logic, read the LTC response, estimate elasticity, and step toward increasing LTC. Repeat until convergence. Under the old cap, this simulation got permanently stuck for certain starting conditions. Under the new softcap, every starting condition converged to the true optimum — the strongest validation of the redesign.",
      ],
      keyTakeaways: [
        "The shape of your constraint space determines the quality of your optimization signal. Any system that uses noise injection or perturbation to read a signal — which includes essentially all RL systems with exploration — must ensure that its constraints don't absorb the perturbations. If they do, the system learns nothing in those regions, and the optimization gradually loses coverage of large parts of the feasible space.",
        "Sequential constraint application creates asymmetry that is difficult to predict analytically. The old cap's behavior in edge cases wasn't intentional — it was an emergent property of applying two separate constraints in sequence. Sequential rule systems are individually simple, but interactions between rules can produce complex and counterintuitive behavior at the boundaries. Geometric or simultaneous formulations make constraint behavior explicit and predictable.",
        "Short-term cost can be the right trade for long-term optimization capability. The softcap redesign had a measurable short-term LTC cost — the average treatment shifted slightly, temporarily reducing margin. This was a deliberate and validated trade: the short-term cost was bounded and estimable, while the long-term benefit was expected to compound over time as the RL model regained the ability to optimize in previously insensitive regions.",
        "Parameter selection for production ML systems requires multi-objective evaluation. Choosing softcap_scaler and mapping_multiplier wasn't a single-metric optimization. There were three objectives in tension: better noise signal quality, minimal average treatment shift, and acceptable short-term LTC cost. The grid search made these trade-offs explicit and transparent — important both for the immediate decision and for future tuning if conditions change.",
      ],
    },
  },
  {
    id: "rl-cap-management",
    category: "Pricing Optimization",
    title: "Teaching a Pricing Engine When to Stop",
    shortDescription:
      "Designing intelligent slowdown mechanisms for production reinforcement learning models — preventing overshooting when market conditions shift, without permanently handicapping optimization range.",
    longDescription:
      "Reinforcement learning pricing models degrade when they reach constraint boundaries: subsequent noise injections produce no actual treatment change, the optimization signal goes dark, and the model can't respond when market conditions shift. This project evaluated two cap-avoidance strategies — threshold reduction and minimum step size — and found that gradual deceleration before a cap is rarely cost-effective, while minimum step size acts as effective signal filtering. A separate three-factor slowdown function based on NC%, dLTV, and BM% signals was designed to detect genuine environment changes and reduce step size preemptively, preventing the model from overshooting a new optimum when business conditions shift.",
    outcomes: [
      "Two cap-management strategies evaluated: threshold reduction (moderate short-term cost) vs. minimum step size (lower cost, higher precision) — minimum step size was the more cost-efficient choice",
      "Analysis showed that slowing an RL down before it hits a cap only delays the inevitable by ~3–5 days, with consistent revenue loss throughout — a clean stop at a threshold outperforms gradual deceleration",
      "A three-factor slowdown function (based on NC%, dLTV, and BM% signals) was designed to detect environment changes and prevent overshooting — deployed as a separate, targeted mechanism from cap management",
    ],
    tags: ["Reinforcement Learning", "Constraint Optimization", "Pricing Strategy", "Signal Design", "Cost-Benefit Analysis", "Production ML"],
    githubUrl: "https://github.com",
    demoUrl: "#",
    imageAlt: "RL step size under three-factor environment-change detection function",
    article: {
      motivation:
        "Reinforcement learning (RL) models in a pricing system work by reading a market signal each day and taking a small incremental step toward the estimated optimum. This works well when the environment is stable. The problem arises when an RL model reaches the edge of its allowed range — the hotel-set or business-set boundaries on how high or low a discount or cashback can go — and keeps trying to step further. Once it hits this cap, subsequent noise injections produce no change in the actual treatment applied to customers. The model is frozen at the boundary, still reading signals, but unable to act on them.\n\nThis creates two distinct but related problems. First, if the true optimal point shifts away from the cap — because market conditions change, because a competitor adjusts pricing, or because a business constraint is updated — the RL model can't respond quickly. It has to unwind from the cap before it can start moving toward the new optimum. Second, because the model is frozen at a boundary when it should be exploring, the noise-based signal it reads becomes unreliable: you're measuring the effect of small perturbations in a region where most of the market is already priced at the maximum allowed discount.\n\nTwo separate workstreams addressed this: one focused on preventing the model from hitting caps unnecessarily in the first place, and a second focused on building a smarter slowdown mechanism that detects when the external environment has changed and preemptively reduces the step size to avoid overshooting a new optimum.",
      approaches: [
        "Evaluating two cap-avoidance strategies via cost simulation. The first workstream compared two approaches. The first lowered the threshold at which the model stops stepping toward the cap — halting it earlier to preserve more signal-reading ability. The second set a minimum step size: if the RL's computed daily update is smaller than a threshold, it doesn't move at all. This filters out noise-driven micro-steps that accumulate over time and gradually push the model toward a cap even without a real pricing opportunity. Both strategies were evaluated by simulating their cost impact against historical data using LTC as the primary metric.",
        "Showing that slowing down before a cap is rarely worth it. A key analytical finding was that gradual deceleration provides almost no benefit over a clean stop at the same threshold. If the signal genuinely points toward the cap, the model reaches it a few days later regardless of how slowly it approaches. The short-term LTC cost of moving more slowly (delayed optimization) almost always exceeds the value of the marginally better signal read in those extra days. Minimum step size, by contrast, avoids taking steps that weren't grounded in a real signal to begin with.",
        "Designing a three-factor environment-change detection function. The second workstream addressed a different failure mode: the RL model overshooting a new optimum after the external environment changes. The solution was a multiplicative slowdown function applied to the daily step size: F(NC%) × G(dLTV) × H(BM%) × RL_step. Each factor detects one type of environment change — NC% monitors margin health, dLTV monitors customer lifetime value changes as a proxy for break-even shifts, and BM% monitors whether the model is below its business target. When a factor detects a significant shift, it reduces the step size to a fraction of its normal value, giving the environment time to stabilize before the model commits to a direction.",
        "Using dLTV ratio as the break-even change proxy. A subtle but important design choice was using the ratio of conservative dLTV to original dLTV rather than their raw difference. The ratio is more stable across different market sizes and booking volumes — a 0.02 absolute change in dLTV means something very different in a high-volume market like South Korea than in a smaller market. It also allows the slowdown factor to be back-tested consistently across different periods.",
      ],
      keyTakeaways: [
        "Slowing down before a cap is almost never worth it — clean thresholds are more predictable. The cost simulation result is counterintuitive: gradual deceleration combines the downside of lost optimization with almost none of the upside (the model reaches the same cap a few days later anyway). A clean stop at a threshold is easier to reason about, easier to tune, and nearly as effective.",
        "Minimum step size is a form of signal filtering, not a constraint. Setting a minimum step size isn't the same as telling the model to move less — it's telling the model not to move on noise. This is analogous to setting a significance threshold before acting on an experiment result. The cost of occasionally missing a small-but-real signal is lower than the cost of systematically drifting toward a boundary on accumulated micro-noise.",
        "Multiplicative factor design is powerful because factors compose independently. The three-factor slowdown function is elegant because each factor operates on a different environmental signal and can be activated independently. If NC% spikes but dLTV is stable, only the NC% factor fires. If both spike simultaneously, both factors compound and the model slows more aggressively. This composability makes the system easy to extend with additional signals.",
        "Per-country cost analysis is essential when deploying global pricing changes. The average cost across all markets can look manageable while masking severe impact in a few specific countries. In this case, specific origin markets contributed disproportionately to the total cost of the threshold-reduction approach — a finding that only emerged from the country-level breakdown, and that changed the feasibility assessment for that strategy.",
      ],
    },
  },
  {
    id: "m1-winsorization",
    category: "Pricing Optimization",
    title: "One Threshold Doesn't Fit All Markets",
    shortDescription:
      "Replacing a fixed outlier-clipping threshold with a dynamic, destination-aware formula — reducing variance in the pricing signal while treating large and small markets proportionally.",
    longDescription:
      "Agoda's M1 winsorization applied a single fixed threshold to clip outlier bookings across all destination markets — but a booking that represents a 99th-percentile outlier in Vietnam may be an ordinary booking in Japan. This project diagnosed the systematic bias this created (over-clipping small markets, under-clipping large ones) and replaced the fixed threshold with a dynamic formula scaled by revenue per booking per destination. Calibrating against empirical remaining-LTC% across destinations revealed that 8 of 17 markets had been systematically over-clipped, and a year-end robustness check showed that aggressive winsorization during seasonal spikes reduces genuine signal rather than just noise.",
    outcomes: [
      "Fixed threshold was systematically over-clipping small markets and under-clipping large ones, introducing directional bias across destinations",
      "Dynamic threshold formula — scaled by bookings and revenue metrics per destination — narrowed the spread of remaining LTC% across all markets",
      "Signal-level standard error reduced meaningfully with destination-aware thresholds compared to the fixed baseline",
      "8 of 17 destinations received lower optimal thresholds than the previous fixed value, confirming systematic over-winsorization for smaller markets",
    ],
    tags: ["Statistical Signal Processing", "Outlier Detection", "Variance Reduction", "Pricing Analytics", "Parameter Fitting", "Multi-Market Analysis"],
    githubUrl: "https://github.com",
    demoUrl: "#",
    imageAlt: "Remaining LTC% by destination under fixed vs. dynamic winsorization thresholds",
    article: {
      motivation:
        "Winsorization — capping extreme values at a chosen percentile rather than removing them — is a standard technique for handling outliers in financial and business metrics. In a pricing system that reads daily booking-level LTC (long-term contribution), individual outlier bookings can dominate the signal and cause the optimization model to chase noise rather than a genuine pricing opportunity. Winsorization fixes this: bookings above a threshold are clipped to that threshold value before the signal is computed.\n\nThe problem is that a threshold is a policy, and policies applied uniformly across different populations embed assumptions that may not hold everywhere. A booking that represents a 99th-percentile outlier in Vietnam — a smaller, lower-average-revenue market — might be an entirely ordinary booking in Japan or South Korea. When you apply the same fixed threshold to both, you clip Vietnam more aggressively than Japan. The signal from Vietnam is effectively blunted: you're removing more of its genuine variance, not just its outlier noise.\n\nThis project replaced Agoda's fixed M1 winsorization threshold with a dynamic formula that scales with the size and revenue profile of each destination — making the outlier treatment proportional to what 'extreme' actually means in each market.",
      approaches: [
        "Diagnosing the bias from the fixed threshold. The first step was demonstrating that the fixed threshold produced materially different effective winsorization levels across destinations. The metric used was 'remaining LTC%' — what percentage of total LTC value survives after winsorization. Under the fixed threshold, this percentage ranged widely across destinations. A well-designed threshold should produce roughly consistent remaining LTC% across markets, because the goal is to remove the same proportion of extreme noise everywhere, not a fixed dollar amount.",
        "Deriving a destination-specific threshold formula. The dynamic formula expresses the threshold as a linear function of (revenue + dLTV) per booking, where dLTV is the estimated long-term customer value contribution. A booking that's 10× the average transaction value is an outlier by any reasonable definition, regardless of whether the average is $50 or $500. Two free parameters controlling the intercept and slope were fitted using percentile-based calibration: for each destination, compute the empirical threshold at the target winsorization level, then find the linear coefficients that best predict those destination-level thresholds from the per-booking revenue metric.",
        "Parameter fitting to match target remaining-LTC% across destinations. The target wasn't a single correct threshold for each destination — it was a consistent remaining-LTC% across all destinations. The fitting procedure found the linear coefficients that minimized variance in remaining LTC% across destinations, subject to the constraint that the overall average winsorization level matched the existing system (to avoid a step-change in signal behavior on launch). The result assigns higher thresholds to high-revenue destinations and lower thresholds to smaller markets.",
        "Year-end behavior analysis as a robustness check. Periods where booking patterns deviate sharply from the annual average can inflate or deflate the apparent outlier level. The analysis examined the year-end period as a stress test. The finding was that higher winsorization levels don't necessarily reduce signal variance during year-end spikes — the underlying demand volatility is real, not noise, and clipping it doesn't help. This pointed toward a modest rather than aggressive target winsorization level for normal operation.",
      ],
      keyTakeaways: [
        "Outlier thresholds are a data preprocessing policy, and policies should be validated against the distribution they're applied to. A universal threshold embeds an assumption that a fixed dollar value is equally 'extreme' across all markets. This assumption rarely holds when markets differ substantially in size, average revenue, or booking patterns. The first thing to check about any preprocessing rule that uses an absolute value is whether relative behavior matters more.",
        "Remaining signal% is a more useful diagnostic than threshold value. Evaluating winsorization by looking at the threshold number across markets is misleading — a $140 threshold clips 5% of Japan's LTC but 25% of Vietnam's. Looking at remaining LTC% as the output metric makes the asymmetry immediately visible and gives you a clean optimization target for the redesign.",
        "Proportional scaling is a natural default for any metric that depends on transaction size. The formula structure — threshold as a function of revenue per booking — generalizes to any setting where outlier detection needs to be proportional to the local scale of the data. It's analogous to using percentage-of-revenue rather than absolute-revenue thresholds in financial anomaly detection, or Z-scores rather than absolute deviations in statistical testing.",
        "Fitting parameters to empirical percentiles is more robust than imposing a theoretical distribution. Rather than assuming booking LTC follows a specific distribution and deriving thresholds analytically, the approach fitted parameters directly from the observed per-destination threshold at the target winsorization level. This ensures the formula is calibrated to actual market conditions rather than theoretical ones.",
      ],
    },
  },

  // ── Experimentation ───────────────────────────────────────────────────────
  {
    id: "ubi-prediction",
    category: "Experimentation",
    title: "Predicting Whether an A/B Test Will Succeed — Before It's Done",
    shortDescription:
      "A machine learning classifier trained on early experiment signals to predict whether a running A/B test will produce a positive business impact, enabling earlier decisions without extending run duration.",
    longDescription:
      "At large consumer platforms, every experiment ties up traffic, engineering time, and opportunity cost for weeks. This project trained a CatBoost classifier on historical experiment snapshots to predict whether a running A/B test will produce a positive business outcome before the primary metric reaches significance — enabling earlier decisions without extending run duration. The key design challenge was preventing temporal leakage: training on earlier experiments and validating on later ones to mirror real deployment conditions. The model identified long-term contribution variance as the strongest predictive signal, suggesting that early metric volatility is more informative than its point estimate.",
    outcomes: [
      "Built a classifier predicting positive vs. negative business impact from early experiment snapshots, achieving meaningful accuracy on a task where the baseline is close to a coin flip",
      "Reduced the rate at which early recommendations are later reversed — a costly failure mode where a 'ship it' decision based on incomplete data turns into a negative outcome",
      "Identified long-term contribution variance as the strongest predictive signal, suggesting that how volatile the value metric is early in an experiment is more informative than its point estimate",
    ],
    tags: ["CatBoost", "Binary Classification", "Temporal Train/Test Split", "Feature Engineering", "Model Evaluation", "Experiment Design"],
    githubUrl: "https://github.com",
    demoUrl: "#",
    imageAlt: "UBI prediction classifier performance across experiment run stages",
    article: {
      motivation:
        "At Agoda, every experiment runs twice. The first run — the decision run — is where the product team waits for statistical significance and decides whether to ship the feature. The second run — the measurement run — quantifies the unbiased business impact after the decision is made. The decision run is where the cost accumulates: tying up traffic, engineering time, and opportunity cost for however many days it takes to reach significance.\n\nThe standard approach is to wait until the primary metric crosses a significance threshold before making a decision. This is statistically sound but operationally slow. A single experiment can run for weeks, and during that time, the platform may already have enough information — in the form of early metric snapshots, team-defined proxy metrics, and the correlation structure of past experiments — to make a reasonably confident early call.\n\nThe question driving this project was: can a machine learning model, trained on historical experiment data, learn to predict whether an experiment will produce a positive business outcome before the primary metric reaches significance? If so, it would allow the team to make earlier decisions on experiments that are likely to succeed, and to cut losses earlier on experiments that are likely to fail — without waiting for the full duration.\n\nThis is a prediction problem with a natural structure. For each experiment, you have a time series of metric snapshots at different points in the run. You want to predict, from an early snapshot, whether the final business outcome will be positive or negative. The challenge is that early snapshots are noisy, the outcome is binary and imbalanced, and the features themselves have a temporal structure that must be handled carefully to avoid data leakage.",
      approaches: [
        "Framing as a binary classification task. The target variable is whether the measurement run produces a positive business impact (incremental bookings > 0). Each training example is a snapshot of a running experiment at a specific point in its lifecycle, with associated metric statistics (z-scores, p-values, variance estimates) as features. The classification framing enables probability outputs — confidence of a 'ship' recommendation — rather than just binary predictions.",
        "Chronological train/test split to prevent temporal leakage. This is the single most important design decision. If you randomly split experiments into train and test sets, you risk including future experiments in the training set — meaning the model can 'see' patterns it wouldn't have in production. The correct approach is to train on experiments that ran earlier in time and test on experiments that ran later. This mimics the real deployment scenario and ensures measured performance is a realistic estimate of future performance.",
        "Within-experiment validation split. Inside the training set, validation is done by randomly sampling experiments (not snapshots), ensuring that multiple snapshots of the same experiment don't appear in both train and validation. This prevents a subtler form of leakage where the model learns experiment-specific patterns rather than generalisable signals.",
        "CatBoost classifier with Logloss objective. CatBoost handles mixed feature types well and is robust to varying feature scales — both relevant here, since the feature set mixes p-values (bounded 0–1), z-scores (unbounded), and variance estimates. The Logloss objective optimises for well-calibrated probability estimates, which matters when the output is used to set decision thresholds rather than just rank experiments.",
        "Feature set from multiple metric dimensions. For each experiment snapshot, features include the z-score and variance of the primary business metric, the p-value and z-score from the decision run at that snapshot, and corresponding statistics for team-defined proxy metrics. Including proxy metrics is important: because they are directly targeted to what the treatment should change, their early signals contain more predictive information than the generic business metric alone.",
        "Evaluation on snapshot-level predictions across run stages. The model is evaluated not just on final predictions but on predictions made at different points during the run (after one week, two weeks, three weeks). This shows how confidence evolves over time and at what point early predictions become reliable enough to act on.",
      ],
      keyTakeaways: [
        "Predicting experiment outcomes is hard, and calibration matters more than raw accuracy. The base rate of positive experiments is not 50% — it varies by team and feature type. The right evaluation framework combines accuracy, precision/recall on the minority class, and calibration of predicted probabilities, compared to the naive baseline of 'always recommend ship' or 'use current platform rules.'",
        "Temporal leakage is the most dangerous failure mode in time-series ML. A model trained on a random train/test split will appear to perform well in evaluation but fail in production because it has been exposed to future information. This is not a subtle bug — it's a systematic overestimate of performance that can lead to real business harm if the model is deployed with misplaced confidence.",
        "Variance is often more predictive than the point estimate. The finding that long-term contribution variance was the most important feature — rather than the z-score of the primary metric — makes intuitive sense. An experiment with high early variance in the value metric is harder to call confidently, and a model that picks up on this uncertainty is effectively learning to be cautious in the right situations.",
        "Conservative models reduce expensive errors. The trained model tended to be more conservative than the current platform recommendation — issuing more 'wait' and 'drop' signals. In an experimentation context, false positives (shipping a feature that actually hurts the business) are more costly than false negatives. A model that errs on the side of caution aligns with the asymmetric cost structure of real business decisions.",
        "The right framing for this project is decision support, not decision replacement. A model that predicts experiment outcomes should inform human decisions — shortening run time when the prediction is confident, flagging uncertain experiments for closer monitoring — rather than replacing the statistical framework entirely.",
      ],
    },
  },
  {
    id: "experiment-interactions",
    category: "Experimentation",
    title: "When Two Experiments Collide: Detecting Statistical Interactions Between Simultaneous A/B Tests",
    shortDescription:
      "A statistical framework for testing whether two overlapping A/B tests are interfering with each other — and why the intuitive approximation gets the math wrong in ways that matter.",
    longDescription:
      "In a platform with high experiment density, two simultaneously running tests can interact — where the combined effect of both treatments differs from the sum of their individual effects. This project derived the correct variance formula for testing experiment interactions in a four-cell design, accounting for the correlation structure of users who appear in multiple treatment cells simultaneously. The analysis quantified the error introduced by a fast approximation used in the platform's monitoring, showing when the approximation is acceptable and when metric variance makes it misleading. The production-ready methodology was adopted for real-time flagging of potential experiment interactions.",
    outcomes: [
      "Derived a correct variance formula for testing the interaction between two simultaneously running experiments, accounting for the correlation structure of overlapping user populations",
      "Quantified how much error the fast approximation method introduces compared to the exact method, as a function of metric variance — showing when approximation is acceptable and when it isn't",
      "Delivered a production-ready methodology adopted by the platform for flagging potential experiment interactions in real time",
    ],
    tags: ["Interaction Testing", "Variance Decomposition", "Statistical Hypothesis Testing", "Experiment Design", "Statistical Approximation"],
    githubUrl: "https://github.com",
    demoUrl: "#",
    imageAlt: "Experiment interaction four-cell design and variance formula derivation",
    article: {
      motivation:
        "At a large consumer internet company, it's common to have dozens or even hundreds of A/B tests running at the same time. The standard assumption is that these experiments are independent: the effect of experiment A is estimated from its own users, and the effect of experiment B is estimated from its own users, and the two don't interfere with each other. In many cases, this assumption holds well enough. But not always.\n\nConsider two experiments that both affect the booking funnel for the same type of traveller. Experiment A changes the way prices are displayed; Experiment B changes the order of search results. A user in the treatment group for both experiments is experiencing two changes simultaneously — and the combined effect might be more (synergy) or less (interference) than the sum of the two individual effects. If you analyse each experiment independently, you'll attribute the full combined effect to whichever experiment you look at first, and the second experiment's result will be confounded by the first.\n\nThis is the experiment interaction problem. The question is: given two simultaneously running experiments, can you test whether their effects are truly additive, or whether there's a meaningful interaction term? And if you can, how do you compute the test statistic correctly?\n\nThe tricky part is that users can belong to four cells simultaneously: control for both (CC), treatment for A only (TC), treatment for B only (CT), and treatment for both (TT). The test for interaction requires comparing the combined treatment effect against the sum of individual effects, and the variance of that comparison depends on the covariance structure across cells — which most naive implementations ignore.",
      approaches: [
        "Formal framing as an interaction hypothesis test. The null hypothesis is that the total lift from both experiments equals the sum of the individual lifts. A deviation from this — either positive (synergy) or negative (interference) — is what we're looking for. This is tested using a z-test on the interaction term, which requires computing not just the point estimate of the interaction but also its standard error correctly.",
        "Exact variance derivation for the four-cell design. The correct variance formula for the interaction term needs to account for the fact that the same users appear in the denominator of multiple effect estimates. Users in the TT cell contribute to both lift(A) and lift(B), creating a covariance term between the two estimates. The analysis derived this formula from first principles, correctly handling the correlation — it differs from the naive formula that treats the cells as independent.",
        "Fast approximation method and its error bounds. An exact variance calculation requires knowing the per-cell metric distributions, which can be computationally expensive at scale. The analysis derived a faster approximation based on the number of bookings in each cell rather than the full metric distribution. To understand when it's trustworthy, the team compared its results against the exact method across synthetic scenarios with varying metric variance — showing the approximation error is proportional to metric variance.",
        "Validation on real experiment pairs. The methodology was applied to a set of real experiment pairs that teams had flagged as potentially interacting. This served as a real-world sanity check and demonstration of the method's practical utility, resulting in the platform's interaction-testing module being updated to switch between exact and approximate methods depending on observed metric variance.",
      ],
      keyTakeaways: [
        "Experiment independence is an assumption, not a guarantee. In a platform with high experiment density, some degree of overlap is inevitable. Rather than hoping that interactions don't exist, build the tooling to detect them. A well-designed interaction test can be run as a standard diagnostic on any pair of simultaneously running experiments targeting overlapping user populations.",
        "The variance formula for a multi-experiment design is not the same as the sum of individual variances. When the same users appear in multiple treatment cells, the estimates of individual lifts are correlated, and the variance of their difference needs to account for that correlation explicitly. Using the wrong formula can lead to inflated or deflated z-scores and incorrect detection rates.",
        "Approximation methods are useful, but you need to know their failure mode. The fast approximation for interaction testing is accurate when metric variance is low, but degrades as variance increases. Before deploying any statistical approximation at scale, understand the conditions under which it breaks down — an approximation that silently fails in high-variance situations is more dangerous than no approximation at all.",
        "Synergy and interference between experiments have different business implications. If two experiments interfere, you may be underestimating the value of one or both features when analysed in isolation. If they synergise, the combined rollout may deliver more value than expected. Detecting interactions early allows you to sequence rollouts more intelligently.",
      ],
    },
  },
  {
    id: "metric-quality-selection",
    category: "Experimentation",
    title: "What Makes a Good Experiment Metric? A Signal-to-Noise Analysis",
    shortDescription:
      "A systematic study of which A/B testing metrics are actually sensitive to treatment effects — identifying which ones give you reliable signals and which ones waste your team's statistical budget.",
    longDescription:
      "Every A/B test requires choosing a primary metric, but this choice matters more than most teams realise — a noisy metric requires a much longer experiment for the same effect size, while a metric that's easy to move but uncorrelated with business outcomes can lead to shipping features that don't actually help. This project applied a systematic sensitivity analysis across all available metrics using p-value distribution diagnostics and correlation with business outcomes to evaluate which metrics are worth using as primary decision metrics. The analysis showed that per-booking metrics carry almost no signal in front-end experiments, and established clear roles for booking count, proxy metrics, and long-term contribution.",
    outcomes: [
      "Showed that per-booking metrics (e.g. revenue per transaction) carry almost no signal in front-end experiments, making them poor choices as primary metrics despite being intuitive business measures",
      "Found that team-defined proxy metrics vary widely in sensitivity — behavioural and micro-conversion metrics tend to be more movable than direct business metrics, and are useful for validating treatment direction",
      "Established that booking count and unique booker count are statistically equivalent for decision-making, while long-term contribution should be used as a guard-rail rather than a decision metric",
    ],
    tags: ["P-value Distribution Analysis", "Signal-to-Noise Ratio", "Metric Decomposition", "Statistical Simulation", "Experiment Design"],
    githubUrl: "https://github.com",
    demoUrl: "#",
    imageAlt: "Metric sensitivity smile plot comparing p-value distributions across candidate metrics",
    article: {
      motivation:
        "Every A/B test requires you to choose a primary metric — the one number that will determine whether the experiment is a success or a failure. This choice matters more than most teams realise. A metric that's too noisy will require a much longer experiment to detect the same effect size. A metric that's easy to move but uncorrelated with actual business outcomes can mislead you into shipping features that don't actually help. And a metric that's hard to move at all will lead to endless inconclusive results, wasted traffic, and frustrated product teams.\n\nAt Agoda, front-end teams ran experiments targeting different stages of the booking funnel — from homepage and search results all the way through to checkout. The question was: across the range of metrics available (per-user booking counts, per-booking revenue metrics, long-term contribution, and various team-defined proxy metrics), which ones are actually worth using as primary metrics? Which ones have enough signal to be detectable in a reasonable experiment window? And for the ones that shouldn't be primary metrics, what role should they play?\n\nExperiments run twice: a decision run to determine whether to ship a feature, and a measurement run to quantify the unbiased business impact after the decision is made. The choice of primary metric in the decision run directly determines how long the experiment needs to run and how reliable the decision will be. Getting this wrong is expensive.",
      approaches: [
        "The 'smile plot' as a metric sensitivity diagnostic. A healthy metric, applied to real experiments with genuine effects, should produce a p-value distribution skewed toward zero — you expect more small p-values than large ones. A metric with no sensitivity produces a flat, roughly uniform distribution. The 'smile ratio' — the proportion of experiments with p-values below a threshold — summarises this shape: a higher smile ratio means the metric is more sensitive to treatment effects. This diagnostic was applied across all candidate metrics on a large set of historical experiments.",
        "IBPD correlation as a relevance filter. Sensitivity alone isn't enough — a metric can be easy to move but move in the wrong direction. To check relevance, each metric's experimental results were correlated with the primary business outcome from the measurement run. Metrics with high sensitivity but low correlation with the business outcome are dangerous: they look good in the decision run but don't translate to real impact.",
        "Metric decomposition to understand what's driving variance. For the long-term contribution metric, the analysis decomposed it into constituent parts: long-term contribution per booking, bookings per unique booker, and unique bookers per user. This reveals which component drives the overall metric's behaviour. The per-booking component has very little signal in front-end experiments — front-end changes rarely affect booking value, only booking volume — explaining why long-term contribution is harder to move than booking count alone.",
        "Recommendation divergence analysis across metric choices. Beyond sensitivity and relevance, the analysis computed the fraction of historical experiments where each pair of metrics led to conflicting recommendations. A high divergence rate between two metrics means the choice of primary metric materially changes your decisions — a signal that you need to be deliberate about which one to trust and why.",
      ],
      keyTakeaways: [
        "Per-booking metrics are almost never the right primary metric for front-end experiments. Front-end changes primarily affect whether a user books at all, not how much they spend per booking. Using revenue per booking as a primary metric guarantees low power and inconclusive results. Reserve per-booking metrics for experiments specifically designed to affect booking value.",
        "Team-defined proxy metrics are worth using — but not blindly. Product teams can often identify proxy metrics more directly affected by the treatment than generic business metrics, and these tend to have higher signal-to-noise. But they should always be validated against the primary business outcome: a proxy that's easy to move but doesn't correlate with actual bookings is a false positive factory.",
        "Long-term contribution is a guard-rail, not a compass. This metric is important to monitor because a treatment that increases bookings but degrades customer quality is a net negative. But it's harder to move than booking count and its components have different sensitivities. The right role for it is as a secondary metric: 'ship if booking count is positive, as long as long-term contribution doesn't significantly decline.'",
        "Metric sensitivity can and should be estimated empirically before launching experiments. Historical experiment data contains everything you need to evaluate how sensitive each metric is under realistic conditions. Teams that choose primary metrics based on intuition alone are flying blind — a pre-launch sensitivity audit prevents weeks of wasted experiment runtime.",
      ],
    },
  },
  {
    id: "allocation-unit-optimization",
    category: "Experimentation",
    title: "The Unit of Experimentation: Can a Smarter Allocation Unit Shrink Your MDE?",
    shortDescription:
      "An empirical investigation into whether finer-grained allocation units — session-level or compound user×property — can reduce experiment duration for front-end teams, without introducing causal contamination or cannibalization.",
    longDescription:
      "Allocating at the user level is standard in A/B testing, but it introduces noise when a treatment only affects a specific type of user interaction. This investigation evaluated whether session-level or compound user×property allocation could reduce minimum detectable effect for front-end experiments. Session-level allocation was found to offer minimal practical gains — most relevant variance already exists between users, and the causal assumption of session independence fails for most front-end features. Compound user×property allocation showed meaningful MDE reduction for property detail pages, but introduced cannibalization problems on search result pages where treatment effects on individual items are not independent.",
    outcomes: [
      "Found that session-level allocation offers modest MDE improvement on paper, but the causal assumptions required to justify it don't hold in practice for most front-end features",
      "Showed that compound user×property allocation reduces MDE for booking metrics meaningfully, but the gain is surface-dependent: it works for property detail pages, but introduces unacceptable noise on search result pages due to cannibalization",
      "Provided concrete guidance to front-end teams on which experiments can benefit from the new allocation approach and what to watch for in early monitoring",
    ],
    tags: ["Variance Decomposition", "Signal-to-Noise Analysis", "Intraclass Correlation", "Causal Inference", "Experiment Design"],
    githubUrl: "https://github.com",
    demoUrl: "#",
    imageAlt: "MDE comparison across user-level, session-level, and compound allocation units by page type",
    article: {
      motivation:
        "Speed is a competitive advantage in A/B testing. The faster you can run an experiment and get a reliable result, the more decisions you can make per quarter, and the more rapidly a product can improve. One of the most underappreciated levers for experiment speed is the choice of allocation unit — the entity that gets randomly assigned to treatment or control.\n\nMost A/B tests at consumer internet companies default to user-level allocation: each user is randomly assigned to see either the control or the treatment experience, and they stay in that assignment throughout the experiment. This is the safest and most interpretable approach. But it's not always the most efficient. If your feature only affects a specific type of user interaction — say, viewing a particular hotel — then allocating at the user level introduces a lot of irrelevant noise: the same user might visit dozens of properties, most of which have nothing to do with the treatment. You're measuring a signal that's diluted by a lot of irrelevant exposure.\n\nThe question this investigation set out to answer was: can we reduce that noise by allocating at a finer unit — either at the session level or at the compound user×property level? If yes, how large is the MDE reduction, and are there any downsides?\n\nAt Agoda, experiments run twice: a decision run to measure whether to ship a feature, and a measurement run to quantify the unbiased business impact after the decision is made. Reducing MDE means shortening both of these, compounding the efficiency gain across the full experiment lifecycle.",
      approaches: [
        "Session-level allocation: empirical feasibility check. Before any variance calculation, the analysis examined the actual relationship between sessions and users in real traffic data. The vast majority of sessions involve exactly one user, meaning session allocation creates more allocation units but limited practical variance reduction. More fundamentally, session allocation assumes the treatment in one session has no spillover to the next session for the same user — an assumption that fails for most front-end features where experience in one session shapes intent in the next.",
        "Two-level winsorization for session-based metrics. For the session allocation scenario, the team constructed a booking-per-session metric and evaluated its variance properties with two-level winsorization: first capping extreme values of bookings per session, then capping the per-user aggregate of session-level bookings. This layered winsorization is necessary when the metric has variance at multiple levels of aggregation — without it, a single outlier user with many unusual sessions can dominate the variance estimate.",
        "Compound user×property allocation: variance decomposition by page type. For property detail pages, a user's interaction with a specific hotel is a natural causal unit — the treatment is displayed on that page, and the outcome is directly attributable to that user-property interaction. The analysis computed the effective variance reduction from user×property pairs as allocation units, accounting for correlation between units from the same user. The decomposition showed a meaningful MDE reduction for booking metrics on property pages.",
        "Cannibalization risk on search result pages. On a search results page, the treatment affects the entire list of properties shown — meaning that if property A gets more prominent display, property B may get less attention. Allocating at the user×property level here creates an interference problem: the treatment effect on one unit is directly affected by the treatment status of other units in the same session. This cannibalization means the naive variance reduction estimate is optimistic, and estimates can be directionally misleading.",
      ],
      keyTakeaways: [
        "The right allocation unit is the causal unit. The entity you allocate to treatment should be the entity that experiences the treatment and generates the outcome you care about. If those don't align, you introduce either variance (from irrelevant noise) or bias (from spillover). The allocation unit decision isn't just a statistical optimisation — it's a causal design choice.",
        "Variance reduction from finer allocation only materialises when within-unit variance is high. If most of the relevant variation in your outcome metric already exists between users rather than between sessions or property interactions within the same user, switching to a finer unit gains you little. The first step in any allocation unit analysis should be an empirical decomposition of where the variance actually lives.",
        "Cannibalization is a ceiling on how much finer allocation can help on competitive surfaces. On any surface where showing one item less prominently means another gets more attention — search results, recommendation feeds, ranked lists — treatment effects on individual items are not independent. Before adopting compound allocation on these surfaces, you need a model of how large the cannibalization effect is likely to be.",
        "Page-type specificity matters. A single allocation unit policy applied uniformly across a product with many different page types will be suboptimal for most of them. The right answer for a property detail page is different from the right answer for a search results page. Experiment infrastructure should ideally support page-type-specific allocation strategies, even if the default is conservative user-level allocation.",
      ],
    },
  },

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
];

export const PROJECT_CATEGORIES: ProjectCategory[] = [
  "Pricing Optimization",
  "Experimentation",
  "AI / LLM",
];
