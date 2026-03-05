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
    category: "Core Data Science",
    icon: "🧪",
    skills: ["Python", "NumPy", "Pandas", "Matplotlib", "Seaborn", "Tableau", "Plotly"],
  },
  {
    category: "Machine Learning",
    icon: "🤖",
    skills: [
      "scikit-learn",
      "XGBoost",
      "LightGBM",
      "Feature Engineering",
      "SHAP",
      "Model Evaluation",
    ],
  },
  {
    category: "Deep Learning",
    icon: "🧠",
    skills: ["PyTorch", "TensorFlow", "Keras", "CNNs", "RNNs", "Transformers", "Grad-CAM"],
  },
  {
    category: "LLMs & GenAI",
    icon: "✨",
    skills: [
      "LangChain",
      "RAG",
      "Fine-Tuning",
      "LoRA / QLoRA",
      "Prompt Engineering",
      "HuggingFace",
      "FAISS",
    ],
  },
  {
    category: "Big Data",
    icon: "📊",
    skills: ["Apache Spark", "Hadoop", "PySpark", "SQL", "BigQuery", "dbt"],
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
