---
id: job-radar
category: AI / LLM
order: 1
tags: [LangGraph, Claude API, Agentic AI, LLM Evaluation, Embeddings, HDBSCAN, FastAPI, HTMX]
demoUrl: "#"
imageAlt: "job-radar architecture: LangGraph screening, archetype discovery, lane ranking and grounded CV drafting"
shortDescription: "An agentic job-search assistant I use daily: it screens Swiss job postings with a LangGraph pipeline, learns the kinds of work in the market from embeddings and an LLM taxonomy, and drafts grounded CVs and cover letters through a draft/critique loop."
githubUrl: https://github.com/syongchaiwat/job-radar
---

# job-radar: Agentic Job-Search Assistant

> A LangGraph system that turns raw job postings into a ranked, explainable shortlist and grounded application material, with guardrails in code that the LLM cannot override.

**Skills:** LangGraph, Claude API (Haiku, Sonnet, Opus), Pydantic structured outputs, LLM evaluation, guardrails, sentence-transformers, UMAP, HDBSCAN, FastAPI, HTMX, SQLite

## Key Outcomes
- Built a 5-node LangGraph screening pipeline (normalize, blurb, filter gate, score match, extract gaps) with structured outputs on every call, cost-aware short-circuits and multi-model routing by task, reaching 80% match-level agreement within one grade against my hand-labeled postings
- Learned 6 job families from 64 curated postings by reconciling 54 bootstrapped UMAP + HDBSCAN runs with an LLM-built taxonomy, then assigned new jobs by embeddings with thresholds calibrated for 95% precision, so the LLM only adjudicates the unclear cases
- Drafted one CV per job family and per-job cover letters through a Sonnet-draft, Opus-critique loop grounded in my verified project database, with deterministic checks the critic cannot override, so it refuses to claim tools I don't have even when the role asks for them
