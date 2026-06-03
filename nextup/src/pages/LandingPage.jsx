import React from "react";
import { ArrowRight, CheckCircle2, MapPin, Sparkles, Star } from "lucide-react";

const FEATURES = [
  {
    icon: <CheckCircle2 size={20} />,
    title: "Track Everything",
    desc: "Organize dreams into curated lists. Every ambition, every adventure — captured.",
  },
  {
    icon: <MapPin size={20} />,
    title: "Life in Lists",
    desc: "Create themed bucket lists for travel, learning, experiences, and beyond.",
  },
  {
    icon: <Sparkles size={20} />,
    title: "Mark Moments",
    desc: "Check off achievements and relive the journey. Your story, beautifully told.",
  },
];

export default function LandingPage({ onGetStarted }) {
  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-8 py-5 bg-white/80 backdrop-blur-xl border-b border-black/5">
        <span className="font-display text-xl font-semibold text-charcoal tracking-tight">
          Next<span className="text-burnt">Up</span>
        </span>
        <button
          onClick={onGetStarted}
          className="text-sm font-body font-medium text-burnt hover:text-terracotta transition-colors"
        >
          Sign In →
        </button>
      </nav>

      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center min-h-screen text-center px-6 pt-24 pb-16">
        {/* Background blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, #BE5103 0%, transparent 70%)" }}
          />
          <div
            className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, #069494 0%, transparent 70%)" }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full opacity-5"
            style={{ background: "radial-gradient(ellipse, #FFCE1B 0%, transparent 70%)" }}
          />
        </div>

        {/* Pill badge */}
        <div className="animate-fade-up mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/20 border border-accent/40 text-xs font-body font-semibold text-terracotta tracking-widest uppercase">
          <Star size={11} fill="currentColor" />
          Your bucket list, reinvented
        </div>

        {/* Headline */}
        <h1 className="animate-fade-up-delay-1 font-display text-6xl md:text-8xl font-bold text-charcoal leading-[1.05] tracking-tight max-w-4xl">
          Live the life{" "}
          <span className="italic shimmer-text">you've</span>
          <br />
          always dreamed.
        </h1>

        {/* Subheadline */}
        <p className="animate-fade-up-delay-2 mt-7 font-body text-lg md:text-xl text-charcoal/50 max-w-xl leading-relaxed font-light">
          NextUp is a beautifully simple bucket list app. Capture your wildest ambitions,
          organize them into lists, and check them off one by one.
        </p>

        {/* CTA */}
        <div className="animate-fade-up-delay-3 mt-10 flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={onGetStarted}
            className="group relative inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-burnt text-white font-body font-semibold text-base shadow-xl shadow-burnt/25 hover:bg-terracotta hover:shadow-terracotta/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          >
            Get Started — it's free
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-200" />
          </button>
          <span className="text-xs font-body text-charcoal/30 font-light">No credit card required</span>
        </div>

        {/* Floating stat chips */}
        <div className="animate-fade-up-delay-4 mt-16 flex flex-wrap justify-center gap-3">
          {["✈️ 2.4k trips planned", "🎯 18k goals achieved", "📋 9.1k lists created"].map((s) => (
            <span
              key={s}
              className="px-4 py-2 rounded-xl bg-surface border border-black/5 text-xs font-body text-charcoal/60 font-medium shadow-sm"
            >
              {s}
            </span>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 bg-surface">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-4xl font-bold text-charcoal text-center mb-3">
            Everything you need.
          </h2>
          <p className="text-center text-charcoal/40 font-body mb-14 text-base">
            Thoughtfully designed. Effortlessly simple.
          </p>
          <div className="grid md:grid-cols-3 gap-5">
            {FEATURES.map(({ icon, title, desc }, i) => (
              <div
                key={title}
                className="group p-7 rounded-3xl bg-white border border-black/5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
              >
                <div className="mb-4 inline-flex p-2.5 rounded-xl bg-burnt/10 text-burnt group-hover:bg-burnt group-hover:text-white transition-colors duration-300">
                  {icon}
                </div>
                <h3 className="font-display text-lg font-semibold text-charcoal mb-2">{title}</h3>
                <p className="text-sm font-body text-charcoal/50 leading-relaxed font-light">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-24 px-6 bg-charcoal text-center">
        <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
          Your next chapter starts{" "}
          <span className="text-accent italic">now.</span>
        </h2>
        <p className="text-white/40 font-body mb-8 text-base font-light">
          Join thousands already living their bucket lists.
        </p>
        <button
          onClick={onGetStarted}
          className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-accent text-charcoal font-body font-semibold text-base hover:bg-yellow-300 hover:-translate-y-0.5 transition-all duration-200 shadow-xl shadow-accent/20"
        >
          Start your list <ArrowRight size={18} />
        </button>
      </section>

      {/* Footer bar */}
      <div className="bg-charcoal border-t border-white/5 py-5 px-8 flex items-center justify-between">
        <span className="font-display text-sm font-semibold text-white/40">
          Next<span className="text-burnt">Up</span>
        </span>
        <span className="text-xs font-body text-white/20">© 2025 NextUp. All rights reserved.</span>
      </div>
    </div>
  );
}