"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, ExternalLink, ChevronDown, CheckCircle2 } from "lucide-react";
import { projects, PROJECT_CATEGORIES, ProjectCategory } from "@/lib/data/projects";
import { fadeUp, stagger } from "@/lib/animations";

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>(PROJECT_CATEGORIES[0]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = projects.filter((p) => p.category === activeCategory);

  const handleCategoryChange = (cat: ProjectCategory) => {
    setExpandedId(null);
    setActiveCategory(cat);
  };

  const toggle = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="projects" className="py-24 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-10"
        >
          <span className="text-sm font-medium text-[var(--accent-light)] tracking-widest uppercase mb-3 block">
            My Work
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold">
            Featured Projects
          </h2>
          <p className="text-[var(--muted)] mt-3 max-w-xl mx-auto">
            Click any card to expand and read about the outcomes, methods, and results.
          </p>
        </motion.div>

        {/* Category tabs */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="flex justify-center gap-2 flex-wrap mb-10"
        >
          {PROJECT_CATEGORIES.map((cat) => {
            const isActive = cat === activeCategory;
            return (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className="px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200"
                style={
                  isActive
                    ? {
                        background: "linear-gradient(135deg, #7c3aed, #a855f7)",
                        color: "#fff",
                        boxShadow: "0 0 0 2px rgba(124,58,237,0.4)",
                      }
                    : {
                        background: "var(--surface)",
                        color: "var(--muted)",
                        border: "1px solid var(--border-color)",
                      }
                }
              >
                {cat}
              </button>
            );
          })}
        </motion.div>

        {/* Project grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            variants={stagger}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: 8, transition: { duration: 0.15 } }}
            className="grid md:grid-cols-2 gap-6"
          >
            {filtered.map((project) => {
              const isExpanded = expandedId === project.id;

              return (
                <motion.div
                  key={project.id}
                  variants={fadeUp}
                  layout
                  className="glass-card overflow-hidden cursor-pointer group"
                  whileHover={!isExpanded ? { scale: 1.01, y: -4 } : {}}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  onClick={() => toggle(project.id)}
                  style={{
                    boxShadow: isExpanded
                      ? "0 0 0 2px rgba(124, 58, 237, 0.5), 0 20px 40px rgba(0,0,0,0.3)"
                      : undefined,
                  }}
                >
                  {/* Card header */}
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-heading font-bold text-lg text-[var(--foreground)] group-hover:text-[var(--accent-light)] transition-colors duration-200 mb-2">
                          {project.title}
                        </h3>
                        <p className="text-sm text-[var(--muted)] leading-relaxed">
                          {project.shortDescription}
                        </p>
                      </div>
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.25 }}
                        className="shrink-0 mt-1 text-[var(--muted)]"
                      >
                        <ChevronDown size={18} />
                      </motion.div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mt-4">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-0.5 text-xs rounded-full border border-[var(--border-color)] text-[var(--accent-light)] bg-[var(--accent)]/10"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Expanded panel */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        key="expanded"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 border-t border-[var(--border-color)] pt-5 space-y-5">
                          {/* Long description */}
                          <p className="text-sm text-[var(--muted)] leading-relaxed">
                            {project.longDescription}
                          </p>

                          {/* Outcomes */}
                          <div>
                            <h4 className="text-sm font-semibold text-[var(--foreground)] mb-3">
                              Key Outcomes
                            </h4>
                            <ul className="space-y-2">
                              {project.outcomes.map((outcome, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-[var(--muted)]">
                                  <CheckCircle2
                                    size={15}
                                    className="shrink-0 mt-0.5 text-[var(--accent-light)]"
                                  />
                                  {outcome}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Links */}
                          <div className="flex items-center gap-3 pt-1">
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold border border-[var(--border-color)] text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[var(--accent)] transition-all duration-200"
                            >
                              <Github size={14} />
                              View Code
                            </a>
                            {project.demoUrl !== "#" && (
                              <a
                                href={project.demoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-white transition-all duration-200 hover:opacity-90"
                                style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}
                              >
                                <ExternalLink size={14} />
                                Live Demo
                              </a>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
