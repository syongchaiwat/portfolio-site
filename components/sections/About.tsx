"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { fadeUp, stagger } from "@/lib/animations";

const stats = [
  { value: "10+", label: "Projects Built" },
  { value: "2+", label: "Years of Experience" },
  { value: "Master's", label: "Student in AI" },
];

export default function About() {
  const [imgError, setImgError] = useState(false);

  return (
    <section id="about" className="py-24 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-[var(--accent-light)] tracking-widest uppercase mb-3 block">
            About Me
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold">
            Who I Am
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Photo */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="flex justify-center"
          >
            <div className="relative">
              {/* Gradient ring */}
              <div
                className="absolute -inset-1 rounded-2xl opacity-70"
                style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}
              />
              <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-2xl overflow-hidden border-2 border-[var(--surface)]">
                {imgError ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-[var(--surface-2)]">
                    <span className="text-6xl font-heading font-bold gradient-text">SY</span>
                  </div>
                ) : (
                  <Image
                    src="/profile.jpg"
                    alt="Sarunchana Yongchaiwathana"
                    fill
                    className="object-cover"
                    priority
                    onError={() => setImgError(true)}
                  />
                )}
              </div>

              {/* Floating badge */}
              <div className="absolute -bottom-4 -right-4 glass-card px-4 py-2 flex items-center gap-2 shadow-xl">
                <span className="text-lg">🎓</span>
                <span className="text-xs font-semibold text-[var(--foreground)]">
                  AI Researcher
                </span>
              </div>
            </div>
          </motion.div>

          {/* Bio */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="flex flex-col gap-5"
          >
            <motion.p variants={fadeUp} className="text-[var(--muted)] leading-relaxed">
              I&apos;m Sarunchana, a Data Scientist and Master&apos;s student in Artificial
              Intelligence with a deep passion for building systems that don&apos;t just
              analyse data — they understand it. My journey began with a Computer Science
              degree where I discovered the elegance of machine learning, and since then
              I haven&apos;t looked back.
            </motion.p>
            <motion.p variants={fadeUp} className="text-[var(--muted)] leading-relaxed">
              Today, I work at the intersection of large language models, computer vision,
              and big data engineering. Whether I&apos;m fine-tuning LLMs with LoRA,
              building RAG pipelines for enterprise knowledge bases, or designing
              interpretable ML models for real business decisions — I care deeply about
              making AI practical, explainable, and impactful.
            </motion.p>
            <motion.p variants={fadeUp} className="text-[var(--muted)] leading-relaxed">
              Outside of research and code, I enjoy sharing what I learn through writing
              and video content, and I&apos;m always excited to collaborate on projects
              that push the boundaries of what AI can do in the real world.
            </motion.p>

            {/* Stats */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-4 mt-2">
              {stats.map(({ value, label }) => (
                <div
                  key={label}
                  className="glass-card px-5 py-3 flex flex-col items-center gap-0.5"
                >
                  <span className="text-xl font-heading font-bold gradient-text">
                    {value}
                  </span>
                  <span className="text-xs text-[var(--muted)]">{label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
