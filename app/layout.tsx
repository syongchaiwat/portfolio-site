import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/ThemeProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sarunchana Yongchaiwathana | Data Scientist & AI Researcher",
  description:
    "Portfolio of Sarunchana Yongchaiwathana — Data Scientist, Machine Learning Engineer, and Master's Student in AI. Explore projects in LLMs, deep learning, and big data.",
  openGraph: {
    title: "Sarunchana Yongchaiwathana | Data Scientist & AI Researcher",
    description:
      "Explore the portfolio of Sarunchana Yongchaiwathana — Data Scientist and Master's Student in AI.",
    type: "website",
    locale: "en_US",
  },
  keywords: [
    "data scientist",
    "machine learning",
    "AI",
    "deep learning",
    "LLM",
    "portfolio",
    "Sarunchana Yongchaiwathana",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${spaceGrotesk.variable} antialiased`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
