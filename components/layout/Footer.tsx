import { Github, Linkedin, Mail, Youtube } from "lucide-react";

const socials = [
  { icon: Github, href: "https://github.com/syongchaiwat", label: "GitHub" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/sarunchana-y/", label: "LinkedIn" },
  { icon: Mail, href: "mailto:yongchaiwathana.s@gmail.com", label: "Email" },
  { icon: Youtube, href: "https://www.youtube.com/@Wann_4", label: "YouTube" },
];

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border-color)] py-8 px-4">
      <div className="max-w-6xl mx-auto flex flex-col items-center gap-4">
        <div className="flex items-center gap-4">
          {socials.map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="p-2 rounded-lg text-[var(--muted)] hover:text-[var(--accent-light)] transition-colors duration-200"
            >
              <Icon size={18} />
            </a>
          ))}
        </div>
        <p className="text-xs text-[var(--muted-foreground)] text-center">
          © {new Date().getFullYear()} Sarunchana Yongchaiwathana. Built with Next.js & Tailwind.
        </p>
      </div>
    </footer>
  );
}
