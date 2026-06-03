import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import LandingPage from "./pages/LandingPage";
import SignIn from "./pages/SignIn";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage]       = useState("landing"); // "landing" | "signin" | "dashboard"

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
      if (firebaseUser) setPage("dashboard");
    });
    return unsub;
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-burnt border-t-transparent animate-spin" />
          <span className="text-sm text-charcoal/40 font-body tracking-wide">Loading…</span>
        </div>
      </div>
    );
  }

  if (user) {
    return <Dashboard user={user} />;
  }

  if (page === "signin") {
    return <SignIn onBack={() => setPage("landing")} />;
  }

  return <LandingPage onGetStarted={() => setPage("signin")} />;
}