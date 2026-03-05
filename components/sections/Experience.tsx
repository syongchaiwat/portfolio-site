"use client";

import { motion } from "framer-motion";
import { Briefcase, GraduationCap, MapPin, Calendar } from "lucide-react";
import { timelineEntries } from "@/lib/data/experience";
import { fadeUp, slideInLeft, slideInRight, stagger } from "@/lib/animations";

export default function Experience() {
  return (
    <section id="experience" className="py-24 px-4 md:px-8 bg-[var(--surface)]/30">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-[var(--accent-light)] tracking-widest uppercase mb-3 block">
            My Journey
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold">
            Experience & Education
          </h2>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line — hidden on mobile, shown on md+ */}
          <div
            className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2"
            style={{ background: "linear-gradient(180deg, #7c3aed, #a855f7)" }}
          />

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="flex flex-col gap-12"
          >
            {timelineEntries.map((entry, index) => {
              const isLeft = index % 2 === 0;
              const Icon = entry.type === "work" ? Briefcase : GraduationCap;
              const iconColor = entry.type === "work" ? "#7c3aed" : "#a855f7";

              return (
                <motion.div
                  key={entry.id}
                  variants={isLeft ? slideInLeft : slideInRight}
                  className={`relative flex items-start gap-8 md:gap-0 ${
                    isLeft ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Content card */}
                  <div
                    className={`w-full md:w-[calc(50%-2rem)] ${
                      isLeft ? "md:pr-8 md:text-right" : "md:pl-8 md:text-left"
                    }`}
                  >
                    <div className="glass-card p-6 hover:shadow-lg transition-shadow duration-300">
                      {/* Type badge */}
                      <div
                        className={`flex items-center gap-2 mb-3 ${
                          isLeft ? "md:justify-end" : "md:justify-start"
                        }`}
                      >
                        <span
                          className="px-3 py-0.5 rounded-full text-xs font-semibold text-white"
                          style={{
                            background:
                              entry.type === "work"
                                ? "rgba(124, 58, 237, 0.25)"
                                : "rgba(168, 85, 247, 0.25)",
                            border: `1px solid ${iconColor}40`,
                            color: iconColor,
                          }}
                        >
                          {entry.type === "work" ? "Work" : "Education"}
                        </span>
                      </div>

                      {/* Date */}
                      <div
                        className={`flex items-center gap-1.5 text-xs text-[var(--accent-light)] mb-2 ${
                          isLeft ? "md:justify-end" : "md:justify-start"
                        }`}
                      >
                        <Calendar size={12} />
                        {entry.date}
                      </div>

                      {/* Title & org */}
                      <h3 className="font-heading font-bold text-base text-[var(--foreground)] mb-1">
                        {entry.title}
                      </h3>
                      <div
                        className={`flex items-center gap-1.5 text-sm text-[var(--muted)] mb-4 ${
                          isLeft ? "md:justify-end" : "md:justify-start"
                        }`}
                      >
                        <span className="gradient-text font-medium">{entry.organisation}</span>
                        <span>·</span>
                        <MapPin size={12} className="shrink-0" />
                        <span>{entry.location}</span>
                      </div>

                      {/* Bullets */}
                      <ul
                        className={`space-y-1.5 ${
                          isLeft ? "md:text-right" : "md:text-left"
                        }`}
                      >
                        {entry.bullets.map((bullet, i) => (
                          <li key={i} className="text-sm text-[var(--muted)] leading-relaxed">
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Center dot */}
                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-10 h-10 rounded-full border-2 items-center justify-center bg-[var(--background)] z-10"
                    style={{ borderColor: iconColor }}
                  >
                    <Icon size={16} style={{ color: iconColor }} />
                  </div>

                  {/* Mobile left dot */}
                  <div
                    className="md:hidden shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center bg-[var(--background)] mt-1"
                    style={{ borderColor: iconColor }}
                  >
                    <Icon size={14} style={{ color: iconColor }} />
                  </div>

                  {/* Spacer for alternating layout */}
                  <div className="hidden md:block md:w-[calc(50%-2rem)]" />
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
