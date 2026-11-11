export interface SkillGroup {
  category: string;
  icon: string;
  skills: string[];
}

export interface ProficiencySkill {
  name: string;
  level: number; // 0–100
}

export const skillGroups: SkillGroup[] = [
  {
    category: "Programming Languages",
    icon: "💻",
    skills: ["Python", "SQL", "Scala", "Java", "TypeScript"],
  },
  {
    category: "Data Engineering & Visualization",
    icon: "📊",
    skills: ["pandas", "NumPy", "Spark", "Hadoop", "Tableau", "Dashboarding"],
  },
  {
    category: "Machine Learning & AI",
    icon: "🤖",
    skills: ["scikit-learn", "LightGBM", "CatBoost", "TensorFlow", "JAX", "PyTorch", "SHAP"],
  },
  {
    category: "LLM & NLP",
    icon: "✨",
    skills: [
      "LangGraph",
      "LLM API",
      "Ollama",
      "RAG",
      "LLM Agent Harnesses",
      "Pydantic",
      "FAISS",
      "Knowledge Graphs",
      "Prompt Engineering",
    ],
  },
  {
    category: "Statistics & Experimentation",
    icon: "🧪",
    skills: ["A/B Testing", "Experiment Design", "Hypothesis Testing", "Simulation"],
  },
  {
    category: "MLOps & Engineering",
    icon: "⚙️",
    skills: [
      "MLflow",
      "Kubeflow Pipelines",
      "CI/CD",
      "Automated Testing",
      "Model Monitoring & Alerting",
      "Google Cloud Platform",
    ],
  },
];

export const proficiencySkills: ProficiencySkill[] = [
  { name: "Python", level: 95 },
  { name: "Machine Learning", level: 88 },
  { name: "PyTorch / TensorFlow", level: 82 },
  { name: "LangChain & RAG", level: 80 },
  { name: "Data Visualisation", level: 85 },
  { name: "Apache Spark", level: 72 },
  { name: "SQL & Big Data", level: 78 },
  { name: "LLM Fine-Tuning", level: 75 },
];
