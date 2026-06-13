import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import LandingPage from "./pages/LandingPage";
import SignIn from "./pages/SignIn";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [page,    setPage]    = useState("landing"); // "landing" | "signin" | "dashboard"

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
      <div style={{
        minHeight: "100vh", background: "#F2F2F7",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexDirection: "column", gap: "12px",
        fontFamily: "-apple-system,'SF Pro Display','Helvetica Neue',Arial,sans-serif",
      }}>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div style={{
          width: "28px", height: "28px", borderRadius: "50%",
          border: "2.5px solid rgba(255,107,0,0.2)",
          borderTopColor: "#FF6B00",
          animation: "spin 0.7s linear infinite",
        }} />
        <span style={{ fontSize: "14px", color: "#AEAEB2", fontWeight: 500 }}>Loading…</span>
      </div>
    );
  }

  if (user) return <Dashboard user={user} />;

  if (page === "signin") return <SignIn onBack={() => setPage("landing")} />;

  return <LandingPage onGetStarted={() => setPage("signin")} />;
}
