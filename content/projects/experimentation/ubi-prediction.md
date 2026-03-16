---
id: ubi-prediction
category: Experimentation
order: 1
tags: [CatBoost, Binary Classification, Temporal Train/Test Split, Feature Engineering, Model Evaluation, Experiment Design]
demoUrl: "#"
imageAlt: UBI prediction classifier performance across experiment run stages
shortDescription: A machine learning classifier trained on early experiment signals to predict whether a running A/B test will produce a positive business impact, enabling earlier decisions without extending run duration.
---

# Predicting Whether an A/B Test Will Succeed — Before It's Done

> A machine learning classifier trained on early experiment signals to predict whether a running A/B test will produce a positive business impact, enabling earlier decisions without extending run duration.

**Skills:** CatBoost, binary classification, temporal train/test split, feature engineering from statistical signals, model evaluation, experiment design

## Key Outcomes
- Built a classifier that predicts positive vs. negative business impact from early experiment snapshots, achieving meaningful accuracy on a task where the baseline is a coin flip in many cases
- Reduced the rate at which early recommendations are later reversed — a costly failure mode where a "ship it" decision based on incomplete data turns into a negative outcome
- Identified long-term contribution variance as the strongest predictive signal, suggesting that how volatile the value metric is early in an experiment is more informative than its point estimate

---

## Article

### Motivation

At Agoda, every experiment runs twice. The first run — the **decision run** — is where the product team waits for statistical significance and decides whether to ship the feature. The second run — the **measurement run** — quantifies the unbiased business impact after the decision is made. The decision run is where the cost accumulates: tying up traffic, engineering time, and opportunity cost for however many days it takes to reach significance.

The standard approach is to wait until the primary metric crosses a significance threshold before making a decision. This is statistically sound but operationally slow. A single experiment can run for weeks, and during that time, the platform may already have enough information — in the form of early metric snapshots, team-defined proxy metrics, and the correlation structure of past experiments — to make a reasonably confident early call.

The question driving this project was: can a machine learning model, trained on historical experiment data, learn to predict whether an experiment will produce a positive business outcome before the primary metric reaches significance? If so, it would allow the team to make earlier decisions on experiments that are likely to succeed, and to cut losses earlier on experiments that are likely to fail — without waiting for the full duration.

This is a prediction problem with a natural structure. For each experiment, you have a time series of metric snapshots at different points in the run. You want to predict, from an early snapshot, whether the final business outcome (from the measurement run) will be positive or negative. The challenge is that early snapshots are noisy, the outcome is binary and imbalanced, and the features themselves (p-values, variance estimates, z-scores) have a temporal structure that must be handled carefully to avoid data leakage.

### Approaches

- **Framing as a binary classification task.** The target variable is whether the measurement run produces a positive business impact (incremental bookings > 0). Each training example is a snapshot of a running experiment at a specific point in its lifecycle, with the associated metric statistics (z-scores, p-values, variance estimates) as features. The classification framing allows use of standard ML tools and enables probability outputs (confidence of a "ship" recommendation) rather than just binary predictions.

- **Chronological train/test split to prevent temporal leakage.** This is the single most important design decision in the project. If you randomly split experiments into train and test sets, you risk including future experiments in the training set and past experiments in the test set — which means the model can "see" patterns that it wouldn't have access to in production. The correct approach is to train on experiments that ran earlier in time and test on experiments that ran later. This mimics the real deployment scenario and ensures that the measured performance is a realistic estimate of future performance.

- **Within-experiment validation split.** Inside the training set, validation is done by randomly sampling experiments (not snapshots), ensuring that multiple snapshots of the same experiment don't appear in both train and validation. This prevents a subtler form of leakage where the model learns experiment-specific patterns rather than generalisable signals.

- **CatBoost classifier with Logloss objective.** CatBoost is a gradient-boosted tree algorithm that handles mixed feature types well and is robust to varying feature scales — both relevant here, since the feature set mixes p-values (bounded 0–1), z-scores (unbounded), and variance estimates (large, positive). The Logloss objective optimises for well-calibrated probability estimates, which matters when the output is used to set decision thresholds rather than just rank experiments.

- **Feature set from multiple metric dimensions.** For each experiment snapshot, features include the z-score and variance of the primary business metric, the p-value and z-score from the decision run at that snapshot, and corresponding statistics for the team-defined proxy metrics. Including proxy metrics as features turns out to be important: because these metrics are directly targeted to what the treatment should change, their early signals contain more predictive information than the generic business metric alone.

- **Evaluation on snapshot-level predictions across run stages.** The model is evaluated not just on final predictions but on predictions made at different points during the experiment run (e.g. after one week, two weeks, three weeks). This shows how the model's confidence evolves over time, and at what point early predictions become reliable enough to act on. Comparing the model's recommendation against the platform's standard recommendation at each stage quantifies the expected time savings from early stopping.

### Key Takeaways

- **Predicting experiment outcomes is hard, and calibration matters more than raw accuracy.** The base rate of positive experiments is not 50% — it varies depending on the team and feature type. A model that achieves, say, 65% accuracy might be less impressive than it sounds if the majority class is already 60%. The right evaluation framework combines accuracy, precision/recall on the minority class, and calibration of predicted probabilities — and the results should be compared to the naive baseline of "always recommend ship" or "use current platform rules."

- **Temporal leakage is the most dangerous failure mode in time-series ML.** A model trained on a random train/test split will appear to perform well in evaluation but fail in production, because it has been exposed to future information. This is not a subtle bug — it's a systematic overestimate of model performance that can lead to real business harm if the model is deployed with misplaced confidence. Always use chronological splits for experiment-level ML problems.

- **Variance is often more predictive than the point estimate.** The finding that long-term contribution variance was the most important feature — rather than, say, the z-score of the primary metric — is non-obvious but makes intuitive sense. An experiment with a large, noisy variance in the value metric is harder to call, regardless of the current z-score. A model that picks up on this uncertainty is effectively learning to be cautious in the right situations, which reduces the flip rate (the rate at which "ship" decisions are later reversed).

- **Conservative models reduce expensive errors.** The trained model tended to be more conservative than the current platform recommendation — it issued more "wait" and "drop" signals, and fewer premature "ship" recommendations. In an experimentation context, false positives (shipping a feature that actually hurts the business) are more costly than false negatives (missing a feature that would have helped). A model that errs on the side of caution aligns with the asymmetric cost structure of real business decisions.

- **The right framing for this project is decision support, not decision replacement.** A model that predicts experiment outcomes should inform human decisions — shortening run time when the prediction is confident, flagging uncertain experiments for closer monitoring — rather than replacing the statistical framework entirely. The value is in reducing the expected wait time on clear-cut experiments, not in overriding significance thresholds on borderline ones.
