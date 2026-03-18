"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail, Youtube, ChevronDown, Download } from "lucide-react";

const titles = [
  "Data Scientist",
  "Data Analyst",
  "ML Engineer",
];

const socials = [
  { icon: Github, href: "https://github.com/syongchaiwat", label: "GitHub" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/sarunchana-y/", label: "LinkedIn" },
  { icon: Mail, href: "mailto:yongchaiwathana.s@gmail.com", label: "Email" },
  { icon: Youtube, href: "https://www.youtube.com/@Wann_4", label: "YouTube" },
];

export default function Hero() {
  const [titleIndex, setTitleIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = titles[titleIndex];
    const speed = isDeleting ? 50 : 100;

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setDisplayText(current.slice(0, displayText.length + 1));
        if (displayText.length + 1 === current.length) {
          setTimeout(() => setIsDeleting(true), 1800);
        }
      } else {
        setDisplayText(current.slice(0, displayText.length - 1));
        if (displayText.length === 0) {
          setIsDeleting(false);
          setTitleIndex((i) => (i + 1) % titles.length);
        }
      }
    }, speed);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, titleIndex]);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden"
    >
      {/* Animated background mesh */}
      <div className="mesh-bg" />

      {/* Floating orbs */}
      <div
        className="absolute w-64 h-64 rounded-full opacity-5 blur-3xl pointer-events-none"
        style={{
          background: "radial-gradient(circle, #7c3aed, transparent)",
          top: "20%",
          right: "10%",
          animation: "float-anim 10s ease-in-out infinite",
        }}
      />
      <div
        className="absolute w-48 h-48 rounded-full opacity-5 blur-3xl pointer-events-none"
        style={{
          background: "radial-gradient(circle, #a855f7, transparent)",
          bottom: "20%",
          left: "10%",
          animation: "float-anim 12s ease-in-out infinite reverse",
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--border-color)] bg-[var(--surface)]/50 text-sm text-[var(--muted)] mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          Open to opportunities
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold mb-4 leading-tight"
        >
          Hi, I&apos;m{" "}
          <span className="gradient-text">Sarunchana</span>
        </motion.h1>

        {/* Typing subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-2xl md:text-3xl font-heading font-medium text-[var(--muted)] mb-6 h-10"
        >
          {displayText}
          <span className="cursor-blink text-[var(--accent-light)]">|</span>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-base md:text-lg text-[var(--muted)] max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Master&apos;s Student in AI, passionate about building intelligent systems
          that turn raw data into actionable insight. Specialising in LLMs, deep learning,
          and end-to-end ML pipelines.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10"
        >
          <button
            onClick={() => {
              document.querySelector("#projects")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="px-8 py-3 rounded-lg font-semibold text-white text-sm transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
            style={{
              background: "linear-gradient(135deg, #7c3aed, #a855f7)",
              boxShadow: "0 0 20px rgba(124, 58, 237, 0.4)",
            }}
          >
            View My Work
          </button>
          <a
            href="/resume.pdf"
            download
            className="px-8 py-3 rounded-lg font-semibold text-sm border border-[var(--border-color)] text-[var(--foreground)] hover:border-[var(--accent)] hover:text-[var(--accent-light)] transition-all duration-200 flex items-center gap-2"
          >
            <Download size={16} />
            Download Resume
          </a>
        </motion.div>

        {/* Social links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="flex items-center justify-center gap-4"
        >
          {socials.map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="p-3 rounded-xl border border-[var(--border-color)] bg-[var(--surface)]/50 text-[var(--muted)] hover:text-[var(--accent-light)] hover:border-[var(--accent)] transition-all duration-200 hover:scale-110"
            >
              <Icon size={20} />
            </a>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-[var(--muted-foreground)]"
      >
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <ChevronDown size={16} className="animate-bounce" />
      </motion.div>
    </section>
  );
}
