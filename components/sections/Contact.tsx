"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Mail, Youtube } from "lucide-react";
import { fadeUp, stagger } from "@/lib/animations";

const socials = [
  { icon: Github, href: "https://github.com/syongchaiwat", label: "GitHub", handle: "github.com/syongchaiwat" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/sarunchana-y/", label: "LinkedIn", handle: "linkedin.com/in/sarunchana-y" },
  { icon: Mail, href: "mailto:yongchaiwathana.s@gmail.com", label: "Email", handle: "yongchaiwathana.s@gmail.com" },
  { icon: Youtube, href: "https://www.youtube.com/@Wann_4", label: "YouTube", handle: "youtube.com/@Wann_4" },
];

export default function Contact() {
  return (
    <section id="contact" className="py-24 px-4 md:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-12"
        >
          <span className="text-sm font-medium text-[var(--accent-light)] tracking-widest uppercase mb-3 block">
            Get In Touch
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold">
            Let&apos;s Connect
          </h2>
          <p className="text-[var(--muted)] mt-4 leading-relaxed">
            Whether you have a project in mind, want to collaborate on research,
            or just want to say hi — feel free to reach out on any of the platforms below.
            I typically respond within 24 hours.
          </p>
        </motion.div>

        {/* Social links */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="flex flex-col gap-4"
        >
          {socials.map(({ icon: Icon, href, label, handle }) => (
            <motion.a
              key={label}
              variants={fadeUp}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 glass-card hover:border-[var(--accent)] transition-all duration-200 group"
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-200"
                style={{ background: "rgba(124, 58, 237, 0.15)" }}
              >
                <Icon size={18} className="text-[var(--accent-light)]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--foreground)]">{label}</p>
                <p className="text-xs text-[var(--muted)]">{handle}</p>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
