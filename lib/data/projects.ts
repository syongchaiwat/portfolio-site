export interface Project {
  id: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  outcomes: string[];
  tags: string[];
  githubUrl: string;
  demoUrl: string;
  imageAlt: string;
}

export const projects: Project[] = [
  {
    id: "rag-document-qa",
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
    id: "cnn-image-classifier",
    title: "Medical Image Classification",
    shortDescription:
      "Deep CNN model for classifying chest X-rays into 14 pathology categories with radiologist-level accuracy.",
    longDescription:
      "Fine-tuned a ResNet-50 backbone on the NIH ChestX-ray14 dataset using transfer learning and a custom multi-label classification head. Implemented advanced data augmentation, class-weighted loss functions to handle class imbalance, and Grad-CAM visualisations to explain predictions.",
    outcomes: [
      "Achieved 0.84 mean AUC across 14 pathology classes",
      "Grad-CAM heatmaps validated by a radiologist, showing clinically relevant attention regions",
      "Reduced training time by 3× using mixed-precision training on A100 GPU",
    ],
    tags: ["PyTorch", "ResNet", "Transfer Learning", "Computer Vision", "Grad-CAM"],
    githubUrl: "https://github.com",
    demoUrl: "#",
    imageAlt: "Chest X-ray classification with Grad-CAM heatmap",
  },
  {
    id: "churn-prediction",
    title: "Customer Churn Prediction",
    shortDescription:
      "End-to-end ML pipeline predicting customer churn for a telecom company, deployed as a real-time API.",
    longDescription:
      "Designed a full ML pipeline from raw data ingestion and feature engineering to model training, evaluation, and deployment. Used XGBoost with SHAP explainability to identify the top drivers of churn. Built an interactive Tableau dashboard for business stakeholders and exposed predictions via a FastAPI endpoint.",
    outcomes: [
      "Achieved 93% recall on churners in production, reducing monthly churn by an estimated 18%",
      "Identified 5 key churn drivers using SHAP values, informing a targeted retention campaign",
      "Dashboard adopted by the CX team and used weekly for proactive outreach",
    ],
    tags: ["XGBoost", "scikit-learn", "Pandas", "SHAP", "Tableau", "FastAPI"],
    githubUrl: "https://github.com",
    demoUrl: "#",
    imageAlt: "Customer churn dashboard and model metrics",
  },
  {
    id: "llm-finetuning",
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
