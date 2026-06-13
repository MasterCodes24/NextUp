import React from "react";

const FEATURES = [
  {
    emoji: "✅",
    title: "Capture Everything",
    desc: "From skydiving to learning Portuguese — every dream deserves a home. Add goals in seconds and never let an idea slip away.",
  },
  {
    emoji: "📋",
    title: "Organize Into Lists",
    desc: "Create separate lists for Travel, Career, Fitness, and more. Keep related goals together so your ambitions stay focused.",
  },
  {
    emoji: "🎯",
    title: "Track Your Progress",
    desc: "Check off achievements as you complete them. Watch your progress bar fill up and feel the satisfaction of a life well lived.",
  },
];

const STATS = [
  { value: "2.4k", label: "Trips planned" },
  { value: "18k",  label: "Goals achieved" },
  { value: "9.1k", label: "Lists created" },
];

export default function LandingPage({ onGetStarted }) {
  return (
    <div style={{ fontFamily: "-apple-system,'SF Pro Display','Helvetica Neue',Arial,sans-serif" }} className="min-h-screen bg-white overflow-hidden">

      {/* ── Nav ── */}
      <nav
        style={{ borderBottom: "1px solid rgba(0,0,0,0.08)" }}
        className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-8 py-4 bg-white/90 backdrop-blur-xl"
      >
        <Logo />
        <button
          onClick={onGetStarted}
          style={{
            background: "#FF6B00",
            color: "#fff",
            borderRadius: "10px",
            fontWeight: 600,
            fontSize: "14px",
            padding: "8px 18px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Get Started
        </button>
      </nav>

      {/* ── Hero ── */}
      <section
        className="relative flex flex-col items-center justify-center min-h-screen text-center px-6 pt-28 pb-20"
        style={{ background: "linear-gradient(180deg, #fff 0%, #F2F2F7 100%)" }}
      >
        {/* Soft background blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          <div style={{
            position: "absolute", top: "-120px", right: "-120px",
            width: "600px", height: "600px", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,107,0,0.12) 0%, transparent 70%)",
          }} />
          <div style={{
            position: "absolute", bottom: "-120px", left: "-120px",
            width: "500px", height: "500px", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,122,255,0.08) 0%, transparent 70%)",
          }} />
        </div>

        {/* Badge */}
        <div className="animate-fade-up" style={{ marginBottom: "24px" }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            padding: "6px 16px", borderRadius: "999px",
            background: "rgba(255,107,0,0.1)", border: "1px solid rgba(255,107,0,0.25)",
            fontSize: "12px", fontWeight: 700, color: "#C84B00",
            letterSpacing: "0.08em", textTransform: "uppercase",
          }}>
            ⭐ Your bucket list, reimagined
          </span>
        </div>

        {/* Headline */}
        <h1 className="animate-fade-up-d1" style={{
          fontSize: "clamp(48px, 8vw, 80px)",
          fontWeight: 700,
          lineHeight: 1.05,
          letterSpacing: "-0.03em",
          color: "#1C1C1E",
          maxWidth: "800px",
          marginBottom: "24px",
        }}>
          Live the life{" "}
          <span className="shimmer-text" style={{ fontStyle: "italic" }}>you've</span>
          <br />always dreamed.
        </h1>

        {/* Sub-headline */}
        <p className="animate-fade-up-d2" style={{
          fontSize: "18px", lineHeight: "1.6", fontWeight: 400,
          color: "#636366", maxWidth: "520px", marginBottom: "40px",
        }}>
          NextUp is a beautifully simple bucket list app. Capture your wildest ambitions,
          organize them into lists, and check them off one by one.
        </p>

        {/* CTA */}
        <div className="animate-fade-up-d3" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
          <button
            onClick={onGetStarted}
            style={{
              display: "inline-flex", alignItems: "center", gap: "10px",
              padding: "16px 32px", borderRadius: "16px",
              background: "#FF6B00", color: "#fff",
              fontSize: "16px", fontWeight: 700,
              border: "none", cursor: "pointer",
              boxShadow: "0 8px 32px rgba(255,107,0,0.30)",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "#E05E00"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 36px rgba(255,107,0,0.35)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#FF6B00"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(255,107,0,0.30)"; }}
          >
            Get started — it's free →
          </button>
          <span style={{ fontSize: "13px", color: "#AEAEB2", fontWeight: 400 }}>
            Sign in with Google. No credit card required.
          </span>
        </div>

        {/* Stats */}
        <div className="animate-fade-up-d4" style={{
          display: "flex", flexWrap: "wrap", gap: "12px",
          justifyContent: "center", marginTop: "56px",
        }}>
          {STATS.map(({ value, label }) => (
            <div key={label} style={{
              padding: "12px 20px", borderRadius: "12px",
              background: "#fff", border: "1px solid rgba(0,0,0,0.08)",
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
              display: "flex", flexDirection: "column", alignItems: "center",
              minWidth: "120px",
            }}>
              <span style={{ fontSize: "22px", fontWeight: 700, color: "#1C1C1E", letterSpacing: "-0.02em" }}>{value}</span>
              <span style={{ fontSize: "12px", color: "#8E8E93", fontWeight: 500, marginTop: "2px" }}>{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section style={{ background: "#F2F2F7", padding: "96px 24px" }}>
        <div style={{ maxWidth: "960px", margin: "0 auto" }}>
          <h2 style={{
            fontSize: "clamp(32px,5vw,44px)", fontWeight: 700,
            color: "#1C1C1E", textAlign: "center",
            letterSpacing: "-0.025em", marginBottom: "8px",
          }}>
            Everything you need.
          </h2>
          <p style={{
            textAlign: "center", color: "#636366",
            fontSize: "17px", marginBottom: "56px", fontWeight: 400,
          }}>
            Thoughtfully designed. Effortlessly simple.
          </p>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "16px",
          }}>
            {FEATURES.map(({ emoji, title, desc }) => (
              <div key={title} style={{
                background: "#fff", borderRadius: "20px",
                padding: "32px 28px",
                border: "1px solid rgba(0,0,0,0.06)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}>
                <div style={{
                  width: "52px", height: "52px", borderRadius: "14px",
                  background: "rgba(255,107,0,0.1)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "24px", marginBottom: "20px",
                }}>
                  {emoji}
                </div>
                <h3 style={{
                  fontSize: "18px", fontWeight: 700,
                  color: "#1C1C1E", marginBottom: "8px", letterSpacing: "-0.01em",
                }}>
                  {title}
                </h3>
                <p style={{ fontSize: "15px", color: "#636366", lineHeight: "1.6", fontWeight: 400 }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer CTA ── */}
      <section style={{
        background: "#1C1C1E", padding: "96px 24px",
        textAlign: "center",
      }}>
        <h2 style={{
          fontSize: "clamp(28px,5vw,48px)", fontWeight: 700,
          color: "#fff", letterSpacing: "-0.03em",
          marginBottom: "16px",
        }}>
          Your next chapter starts{" "}
          <span style={{ color: "#FF9500", fontStyle: "italic" }}>now.</span>
        </h2>
        <p style={{ color: "#8E8E93", fontSize: "17px", marginBottom: "36px", fontWeight: 400 }}>
          Join thousands already living their bucket lists.
        </p>
        <button
          onClick={onGetStarted}
          style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            padding: "16px 32px", borderRadius: "16px",
            background: "#FF9500", color: "#1C1C1E",
            fontSize: "16px", fontWeight: 700,
            border: "none", cursor: "pointer",
            boxShadow: "0 8px 32px rgba(255,149,0,0.30)",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "#E08600"; e.currentTarget.style.transform = "translateY(-2px)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "#FF9500"; e.currentTarget.style.transform = "translateY(0)"; }}
        >
          Start your list →
        </button>
      </section>

      {/* ── Footer bar ── */}
      <div style={{
        background: "#1C1C1E", borderTop: "1px solid rgba(255,255,255,0.08)",
        padding: "20px 32px", display: "flex",
        alignItems: "center", justifyContent: "space-between",
      }}>
        <Logo dark />
        <span style={{ fontSize: "12px", color: "#48484A", fontWeight: 400 }}>
          © 2025 NextUp. All rights reserved.
        </span>
      </div>
    </div>
  );
}

function Logo({ dark }) {
  return (
    <span style={{
      fontWeight: 800, fontSize: "20px", letterSpacing: "-0.03em",
      color: dark ? "#fff" : "#1C1C1E",
    }}>
      Next<span style={{ color: "#FF6B00" }}>Up</span>
    </span>
  );
}
