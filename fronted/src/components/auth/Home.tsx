import {
  Twitter,
  Facebook,
  Instagram,
  Sparkles,
  Zap,
  Shield,
  MessageSquare,
  Moon,
  Sun,
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export default function Home() {
  const { theme, toggleTheme } = useTheme();

  const features = [
    {
      icon: <Sparkles className="w-6 h-6 text-pink-500" />,
      title: "Smart Conversations",
      description: "Natural, context-aware AI chats that feel human.",
    },
    {
      icon: <Zap className="w-6 h-6 text-yellow-500" />,
      title: "Lightning Fast",
      description: "Instant responses powered by next-gen models.",
    },
    {
      icon: <Shield className="w-6 h-6 text-emerald-500" />,
      title: "Secure & Private",
      description: "Your data stays encrypted and protected.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-pink-50 to-emerald-50 
                    dark:from-gray-950 dark:via-gray-900 dark:to-black 
                    text-foreground transition-colors duration-500 font-inter">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur bg-white/70 dark:bg-black/40 border-b border-black/5 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold tracking-widest uppercase">
            <MessageSquare className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            ChatAI
          </div>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-full border bg-background hover:bg-accent transition"
          >
            {theme === "light" ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Gradient Orbs */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-pink-400/30 rounded-full blur-3xl" />
        <div className="absolute top-40 -right-32 w-96 h-96 bg-indigo-400/30 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div>
            <span className="inline-block mb-6 text-xs tracking-widest uppercase 
                             bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 
                             px-4 py-2 rounded-full">
              Next-Gen AI Platform
            </span>

            <h1 className="font-playfair text-5xl md:text-6xl xl:text-7xl leading-tight mb-8">
              Your AI Assistant
              <br />
              <span className="bg-gradient-to-r from-indigo-500 via-pink-500 to-emerald-500 
                               bg-clip-text text-transparent">
                Is Here
              </span>
            </h1>

            <p className="max-w-lg text-muted-foreground mb-10">
              ChatAI helps you write, code, brainstorm, and learn faster with
              secure, intelligent conversations — all in one place.
            </p>

            <div className="flex flex-col sm:flex-row gap-6">
              <a
                href="/register"
                className="px-10 py-4 rounded-xl bg-gradient-to-r 
                           from-indigo-500 to-pink-500 text-white 
                           font-bold tracking-widest text-xs 
                           hover:scale-105 transition-transform text-center"
              >
                CREATE ACCOUNT
              </a>

              <a
                href="/login"
                className="px-10 py-4 rounded-xl border 
                           border-black/10 dark:border-white/20 
                           font-bold tracking-widest text-xs 
                           hover:bg-black hover:text-white 
                           dark:hover:bg-white dark:hover:text-black 
                           transition-colors text-center"
              >
                LOG IN
              </a>
            </div>
          </div>

          {/* Right */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="rounded-2xl p-6 backdrop-blur bg-white/70 
                           dark:bg-white/5 border border-black/5 dark:border-white/10
                           hover:translate-y-[-4px] transition-transform"
              >
                <div className="mb-4">{f.icon}</div>
                <h3 className="text-sm font-bold tracking-widest uppercase mb-2">
                  {f.title}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-black/5 dark:border-white/10 py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <span className="text-xs tracking-widest uppercase opacity-60">
            © 2026 ChatAI • Intelligence in Motion
          </span>

          <div className="flex gap-6">
            <Facebook className="w-5 h-5 opacity-40 hover:opacity-100 transition" />
            <Twitter className="w-5 h-5 opacity-40 hover:opacity-100 transition" />
            <Instagram className="w-5 h-5 opacity-40 hover:opacity-100 transition" />
          </div>
        </div>
      </footer>

      {/* Fonts */}
      <style>{`
        .font-inter {
          font-family: 'Inter', sans-serif;
        }
        .font-playfair {
          font-family: 'Playfair Display', serif;
        }
      `}</style>
    </div>
  );
}
