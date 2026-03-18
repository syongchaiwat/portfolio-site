---
id: ubi-prediction
category: Experimentation
order: 1
tags: [Tree-based Model, Binary Classification, Feature Engineering, Model Evaluation, Experiment Design]
demoUrl: "#"
imageAlt: UBI prediction classifier performance across experiment run stages
shortDescription: A machine learning classifier trained on early experiment signals to predict whether a running A/B test will produce a positive business impact, enabling earlier decisions without extending run duration.
---

# Predicting Whether an A/B Test Will Succeed — Before It's Done

> A machine learning classifier trained on early experiment signals to predict whether a running A/B test will produce positive business impact — enabling earlier, more informed decisions beyond what a rule-based significance cutoff can capture.

**Skills:** CatBoost, binary classification, temporal train/test split, feature engineering from statistical signals, model evaluation, experiment design

## Key Outcomes
- Achieved meaningful accuracy improvement over the existing rule-based recommendation system for improvement experiments — demonstrating that early-run metric signals carry real predictive value beyond the current heuristic
- Reduced the flip rate — the rate at which early "take" decisions are later contradicted in the measurement run — a costly failure mode where shipping an undercooked feature turns out to hurt the business
- Evaluation went beyond model accuracy to compare new vs. old recommendations directly: both flip rate reduction and total unbiased incremental bookings gained serve as the primary success metrics

---

## Article

### Motivation

At Agoda, every experiment runs twice. The first run — the decision run — is where the product team waits for enough signal and decides whether to ship the feature. The second run — the measurement run — quantifies the unbiased business impact after the decision is made. The decision run is where the cost accumulates: tying up traffic, engineering time, and opportunity cost for however many days it takes to reach a recommendation.

The existing recommendation system already accounts for this tension with a ladder-style significance cutoff: rather than waiting for full statistical significance, it relaxes the p-value threshold the longer an experiment runs, balancing statistical confidence against opportunity cost. At 70 days, both take and drop thresholds converge at 0.5 — if an experiment hasn't resolved clearly by then, a decision is forced regardless. This is an effective heuristic. But it operates entirely on the primary decision metric, and it treats all experiments with the same p-value identically, regardless of what other signals the data contains.

The question driving this project was whether other dimensions of the experiment data — proxy metrics defined by the team, the variance structure of the business metric, the behavior of secondary metrics — carry additional predictive information that the heuristic ignores. A machine learning model trained on historical experiment outcomes can, in principle, learn to weight these signals together and produce a more informed early recommendation.

Training and evaluating this model requires careful data design. The model must be trained on experiments that ran before the test period and evaluated on experiments that ran after — a chronological split that mirrors real deployment. Within the training set, validation is done at the experiment level (not the snapshot level) to prevent the model from memorising within-experiment patterns across the train/validation boundary.

### Approaches

- **Defining the prediction target and ensuring a fair model.** The target variable is whether the experiment's measurement run produces a positive business outcome. Each training example is a snapshot of a running experiment at a specific point in its lifecycle, with associated metric statistics as features. Certain features were deliberately excluded: team name, team category, and experiment type were not used as inputs. The reason is fairness — the platform runs two types of experiments: improvement experiments (which try to move a metric up) and flat experiments (which test that a change doesn't affect user behaviour, like a code refactor). If the model knows the experiment type, it learns to predict based on that label alone rather than on the observed signals, defeating the purpose. Run duration was also excluded: experiments that run longer are already more likely to be the harder-to-call ones, so including it would introduce a systematic bias in predictions.

- **Chronological train/test split and experiment-level validation.** The model is trained on all experiments up to a cutoff date and tested on experiments that ran after — a chronological design that prevents future information from leaking into the training set, which is a common failure mode in time-series ML that produces inflated validation accuracy but fails in production. Inside the training set, validation is done by sampling at the experiment level: multiple snapshots of the same experiment are kept together on the same side of the train/validation boundary, preventing the model from memorising experiment-specific patterns it wouldn't have in real deployment.

- **Feature set from primary and proxy metrics.** For each snapshot, features include statistical signals from both the primary business metric and the team-defined proxy metrics: p-values, variance estimates, and their equivalents at that point in the run. Proxy metrics are often more sensitive early in an experiment because they directly capture what the treatment is designed to change. Including them alongside the primary metric adds meaningful predictive signal that the existing heuristic ignores entirely. The model used is CatBoost with a Logloss objective, which handles mixed feature types well and produces calibrated probability estimates useful for setting recommendation thresholds.

- **Evaluation against the existing recommendation system.** Model accuracy alone is not the right success metric. The model is evaluated against the existing recommendation system directly: when the two disagree, whose recommendation leads to a better outcome in the measurement run? The two primary measures are flip rate (how often the new recommendation is later contradicted by the measurement run result) and sum UBI — the total unbiased incremental bookings accumulated across all experiments where the model's recommendation was followed. A model that reduces flip rate and increases total UBI across the test period is demonstrably adding value over the status quo.

### Key Takeaways

- **This kind of dataset is rare and hard to build.** Training a model to predict experiment outcomes requires years of a large company running hundreds of experiments per year, each with a defined hypothesis, tracked proxy metrics, and a measurement run result. The data collection infrastructure — how experiments are logged, how outcomes are attributed, how metadata is standardised — needs to be designed with downstream ML use in mind. Without that investment, the training data simply doesn't exist. This is a project that only becomes possible after years of disciplined data engineering at scale.

- **In high-velocity experimentation, the sum of business impact matters more than individual significance.** Unlike clinical trials — where the goal is certainty about a single intervention — a technology company running hundreds of experiments per year cares more about the aggregate outcome across its entire portfolio. A feature with a small positive effect that doesn't reach significance still contributes real business value if shipped. The right objective is total unbiased incremental bookings across all decisions, not per-experiment statistical certainty. A model optimised for this framing can outperform a significance-based heuristic even with modest per-experiment accuracy.

- **Dropped experiments create an irrecoverable gap in the training data.** Experiments that are dropped after the decision run never get a measurement run, which means they have no ground truth label for the model. Attempts were made to collect labels by rerunning some dropped experiments, but product teams rarely agree — they want to move on to the next experiment, not revisit a closed decision. This creates a systematic selection bias: the model learns only from experiments that were taken or held, not from the full range of outcomes. Any deployment should account for this limitation explicitly.

- **This model is decision support, not a replacement for the statistical framework.** A classifier that predicts experiment outcomes should inform human decisions — shortening run time when prediction confidence is high, flagging uncertain experiments for closer monitoring — not override significance thresholds on borderline cases. The value is in compressing expected wait time on clear-cut experiments and reducing the flip rate on early calls, not in replacing the rigour the two-run design provides.
