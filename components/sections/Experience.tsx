"use client";

import { motion } from "framer-motion";
import { Briefcase, GraduationCap, MapPin, Calendar } from "lucide-react";
import { timelineEntries, TimelineEntry } from "@/lib/data/experience";
import { fadeUp, slideInLeft, slideInRight, stagger } from "@/lib/animations";

// Show end year if finished, start year if ongoing ("Present")
function getDisplayYear(date: string): string {
  if (date.includes("Present")) {
    const match = date.match(/\d{4}/);
    return match ? match[0] : "";
  }
  const matches = date.match(/\d{4}/g);
  return matches ? matches[matches.length - 1] : "";
}

function EntryCard({ entry, side }: { entry: TimelineEntry; side: "left" | "right" }) {
  const iconColor = entry.type === "work" ? "#7c3aed" : "#a855f7";
  const alignEnd = side === "left";

  return (
    <div className="glass-card p-5 hover:shadow-lg transition-shadow duration-300">
      {/* Badge */}
      <div className={`flex items-center gap-2 mb-2 ${alignEnd ? "justify-end" : "justify-start"}`}>
        <span
          className="px-2.5 py-0.5 rounded-full text-xs font-semibold"
          style={{ color: iconColor, background: `${iconColor}20`, border: `1px solid ${iconColor}40` }}
        >
          {entry.type === "work" ? "Work" : "Education"}
        </span>
      </div>

      {/* Date */}
      <div className={`flex items-center gap-1 text-xs text-[var(--accent-light)] mb-2 ${alignEnd ? "justify-end" : "justify-start"}`}>
        <Calendar size={11} />
        {entry.date}
      </div>

      {/* Title */}
      <h3 className={`font-heading font-bold text-base text-[var(--foreground)] mb-1 ${alignEnd ? "text-right" : "text-left"}`}>
        {entry.title}
      </h3>

      {/* Org + location */}
      <div className={`flex items-center gap-1.5 text-sm text-[var(--muted)] mb-3 flex-wrap ${alignEnd ? "justify-end" : "justify-start"}`}>
        <span className="gradient-text font-medium">{entry.organisation}</span>
        <span>·</span>
        <MapPin size={11} className="shrink-0" />
        <span>{entry.location}</span>
      </div>

      {/* Bullets */}
      <ul className={`space-y-1.5 ${alignEnd ? "text-right" : "text-left"}`}>
        {entry.bullets.map((bullet, i) => (
          <li key={i} className="text-sm text-[var(--muted)] leading-relaxed">
            {bullet}
          </li>
        ))}
      </ul>
    </div>
  );
}

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

        {/* ── Desktop: alternating left/right timeline ── */}
        <div className="hidden md:block relative">
          {/* Full-height center line */}
          <div
            className="absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 pointer-events-none"
            style={{ background: "linear-gradient(180deg, #7c3aed, #a855f7)" }}
          />

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="flex flex-col gap-8"
          >
            {timelineEntries.map((entry, idx) => {
              const isLeft = idx % 2 === 0;
              const iconColor = entry.type === "work" ? "#7c3aed" : "#a855f7";
              const Icon = entry.type === "work" ? Briefcase : GraduationCap;

              return (
                <motion.div
                  key={entry.id}
                  variants={isLeft ? slideInLeft : slideInRight}
                  className="grid grid-cols-[1fr_5rem_1fr] items-start"
                >
                  {/* Left side */}
                  {isLeft ? (
                    <div className="pr-5">
                      <EntryCard entry={entry} side="left" />
                    </div>
                  ) : (
                    <div />
                  )}

                  {/* Center dot + year */}
                  <div className="flex flex-col items-center pt-3 z-10">
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap mb-1"
                      style={{ color: iconColor, background: "var(--background)", border: `1px solid ${iconColor}50` }}
                    >
                      {getDisplayYear(entry.date)}
                    </span>
                    <div
                      className="w-9 h-9 rounded-full border-2 flex items-center justify-center bg-[var(--background)]"
                      style={{ borderColor: iconColor }}
                    >
                      <Icon size={15} style={{ color: iconColor }} />
                    </div>
                  </div>

                  {/* Right side */}
                  {!isLeft ? (
                    <div className="pl-5">
                      <EntryCard entry={entry} side="right" />
                    </div>
                  ) : (
                    <div />
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* ── Mobile: single column ── */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="md:hidden flex flex-col gap-4"
        >
          {timelineEntries.map((entry) => {
            const Icon = entry.type === "work" ? Briefcase : GraduationCap;
            const iconColor = entry.type === "work" ? "#7c3aed" : "#a855f7";
            return (
              <motion.div key={entry.id} variants={fadeUp} className="flex gap-4 items-start">
                <div
                  className="shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center bg-[var(--background)] mt-1"
                  style={{ borderColor: iconColor }}
                >
                  <Icon size={14} style={{ color: iconColor }} />
                </div>
                <div className="flex-1">
                  <EntryCard entry={entry} side="right" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
