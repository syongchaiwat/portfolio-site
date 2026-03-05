"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { Github, Linkedin, Mail, Youtube, Send, CheckCircle2 } from "lucide-react";
import { fadeUp, stagger, slideInLeft, slideInRight } from "@/lib/animations";

interface FormData {
  name: string;
  email: string;
  message: string;
}

const socials = [
  { icon: Github, href: "https://github.com/syongchaiwat", label: "GitHub", handle: "github.com/syongchaiwat" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/sarunchana-y/", label: "LinkedIn", handle: "linkedin.com/in/sarunchana-y" },
  { icon: Mail, href: "mailto:yongchaiwathana.s@gmail.com", label: "Email", handle: "yongchaiwathana.s@gmail.com" },
  { icon: Youtube, href: "https://www.youtube.com/@Wann_4", label: "YouTube", handle: "youtube.com/@Wann_4" },
];

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    // Simulate network request
    await new Promise((res) => setTimeout(res, 1200));
    console.log("Form submitted:", data);
    setSubmitting(false);
    setSubmitted(true);
    reset();
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <section id="contact" className="py-24 px-4 md:px-8">
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
            Get In Touch
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold">
            Let&apos;s Connect
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Left — contact info */}
          <motion.div
            variants={slideInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="flex flex-col gap-6"
          >
            <p className="text-[var(--muted)] leading-relaxed text-base">
              Whether you have a project in mind, want to collaborate on research,
              or just want to say hi — my inbox is always open. I&apos;m especially
              excited about opportunities in AI/ML engineering, data science, and
              applied research.
            </p>
            <p className="text-[var(--muted)] leading-relaxed text-base">
              I typically respond within 24 hours. You can also find me on any
              of the platforms below.
            </p>

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex flex-col gap-4 mt-2"
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
          </motion.div>

          {/* Right — form */}
          <motion.div
            variants={slideInRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            <div className="glass-card p-8">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center gap-4 py-8 text-center"
                >
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(124, 58, 237, 0.15)" }}
                  >
                    <CheckCircle2 size={32} className="text-[var(--accent-light)]" />
                  </div>
                  <h3 className="font-heading font-bold text-lg text-[var(--foreground)]">
                    Message Sent!
                  </h3>
                  <p className="text-sm text-[var(--muted)]">
                    Thanks for reaching out. I&apos;ll get back to you within 24 hours.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
                  {/* Name */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-[var(--foreground)]">
                      Name <span className="text-[var(--accent-light)]">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Your full name"
                      {...register("name", { required: "Name is required" })}
                      className={`w-full px-4 py-3 rounded-lg text-sm bg-[var(--surface-2)] border text-[var(--foreground)] placeholder-[var(--muted-foreground)] outline-none transition-all duration-200 focus:ring-2 focus:ring-[var(--accent)]/40 ${
                        errors.name ? "border-red-500" : "border-[var(--border-color)] focus:border-[var(--accent)]"
                      }`}
                    />
                    {errors.name && (
                      <span className="text-xs text-red-400">{errors.name.message}</span>
                    )}
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-[var(--foreground)]">
                      Email <span className="text-[var(--accent-light)]">*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="your@email.com"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Please enter a valid email address",
                        },
                      })}
                      className={`w-full px-4 py-3 rounded-lg text-sm bg-[var(--surface-2)] border text-[var(--foreground)] placeholder-[var(--muted-foreground)] outline-none transition-all duration-200 focus:ring-2 focus:ring-[var(--accent)]/40 ${
                        errors.email ? "border-red-500" : "border-[var(--border-color)] focus:border-[var(--accent)]"
                      }`}
                    />
                    {errors.email && (
                      <span className="text-xs text-red-400">{errors.email.message}</span>
                    )}
                  </div>

                  {/* Message */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-[var(--foreground)]">
                      Message <span className="text-[var(--accent-light)]">*</span>
                    </label>
                    <textarea
                      rows={5}
                      placeholder="Tell me about your project or just say hello..."
                      {...register("message", {
                        required: "Message is required",
                        minLength: {
                          value: 10,
                          message: "Message must be at least 10 characters",
                        },
                      })}
                      className={`w-full px-4 py-3 rounded-lg text-sm bg-[var(--surface-2)] border text-[var(--foreground)] placeholder-[var(--muted-foreground)] outline-none resize-none transition-all duration-200 focus:ring-2 focus:ring-[var(--accent)]/40 ${
                        errors.message ? "border-red-500" : "border-[var(--border-color)] focus:border-[var(--accent)]"
                      }`}
                    />
                    {errors.message && (
                      <span className="text-xs text-red-400">{errors.message.message}</span>
                    )}
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm text-white transition-all duration-200 hover:opacity-90 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                    style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}
                  >
                    {submitting ? (
                      <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={15} />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
