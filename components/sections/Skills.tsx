"use client";

import { motion } from "framer-motion";
import { skillGroups } from "@/lib/data/skills";
import { fadeUp, stagger } from "@/lib/animations";

export default function Skills() {
  return (
    <section id="skills" className="py-24 px-4 md:px-8 bg-[var(--surface)]/30">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-[var(--accent-light)] tracking-widest uppercase mb-3 block">
            What I Work With
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold">
            Skills & Technologies
          </h2>
        </motion.div>

        {/* Skill group cards */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {skillGroups.map((group) => (
            <motion.div
              key={group.category}
              variants={fadeUp}
              whileHover={{ scale: 1.02, y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="glass-card p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{group.icon}</span>
                <h3 className="font-heading font-semibold text-[var(--foreground)]">
                  {group.category}
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 text-xs rounded-full border border-[var(--border-color)] text-[var(--muted)] bg-[var(--surface-2)]/50 hover:border-[var(--accent)] hover:text-[var(--accent-light)] transition-colors duration-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
