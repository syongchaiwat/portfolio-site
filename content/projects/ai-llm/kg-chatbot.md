---
id: kg-chatbot
category: AI / LLM
order: 3
tags: [Knowledge Graph, SPARQL, RDF, RAG, Ollama, FAISS, Sentence Transformers, Collaborative Filtering]
demoUrl: "#"
imageAlt: Knowledge graph chatbot architecture — SPARQL query generation and multi-intent routing
shortDescription: A movie chatbot that routes questions to a knowledge graph via auto-generated SPARQL for factual accuracy, using a local LLM only for natural language parsing and response generation.
githubUrl: https://github.com/syongchaiwat/pearlSpinnerTopBruh
---

# Knowledge Graph Movie Chatbot

> A movie Q&A chatbot that combines a knowledge graph, LLM, and RAG — the KG grounds answers in facts, LLM handles question understanding and human-like response generation, and RAG bridges them via FAISS retrieval.

**Skills:** RDF/SPARQL, knowledge graph querying, FAISS, Sentence Transformers, Ollama, LLM, collaborative filtering, multi-intent classification

## Key Outcomes
- Built a multi-intent routing pipeline that classifies each user question as factual, embedding-based, recommendation, or multimedia — dispatching to the correct handler before generating a response
- For factual questions, used FAISS to retrieve relevant SPARQL examples and KG predicates semantically matching the user's query, feeding them as few-shot context so the LLM generates accurate SPARQL — queries the RDF graph directly and falls back to automatic repair-and-retry on failure
- Used the LLM (Qwen3 4B via Ollama, running fully locally) at both ends of the pipeline — to classify and parse the user's intent, and to synthesise a fluent natural-language answer from the structured KG result — keeping hallucination risk contained to presentation, not retrieval
