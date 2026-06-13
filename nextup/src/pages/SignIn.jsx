import React, { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, googleProvider, db } from "../firebase";

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" fill="#FFC107"/>
      <path d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" fill="#FF3D00"/>
      <path d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" fill="#4CAF50"/>
      <path d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" fill="#1976D2"/>
    </svg>
  );
}

function Spinner() {
  return (
    <div style={{
      width: "18px", height: "18px", borderRadius: "50%",
      border: "2px solid rgba(255,107,0,0.3)",
      borderTopColor: "#FF6B00",
      animation: "spin 0.7s linear infinite",
    }} />
  );
}

const spinKeyframes = `@keyframes spin { to { transform: rotate(360deg); } }`;

export default function SignIn({ onBack }) {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user   = result.user;
      await setDoc(
        doc(db, "users", user.uid),
        {
          displayName: user.displayName,
          email:       user.email,
          photoURL:    user.photoURL,
          lastLogin:   serverTimestamp(),
        },
        { merge: true }
      );
    } catch (err) {
      console.error(err);
      if (err.code !== "auth/popup-closed-by-user") {
        setError("Sign-in failed. Please try again.");
      }
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      background: "#F2F2F7", padding: "24px", position: "relative",
      fontFamily: "-apple-system,'SF Pro Display','Helvetica Neue',Arial,sans-serif",
    }}>
      <style>{spinKeyframes}</style>

      {/* Background decoration */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }} aria-hidden>
        <div style={{
          position: "absolute", top: 0, right: 0,
          width: "400px", height: "400px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,149,0,0.10) 0%, transparent 70%)",
        }} />
        <div style={{
          position: "absolute", bottom: 0, left: 0,
          width: "350px", height: "350px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,122,255,0.08) 0%, transparent 70%)",
        }} />
      </div>

      {/* Back button */}
      <button
        onClick={onBack}
        style={{
          position: "absolute", top: "24px", left: "24px",
          display: "inline-flex", alignItems: "center", gap: "6px",
          fontSize: "14px", fontWeight: 500, color: "#636366",
          background: "none", border: "none", cursor: "pointer",
          padding: "6px 10px", borderRadius: "8px",
          transition: "color 0.15s",
        }}
        onMouseEnter={e => e.currentTarget.style.color = "#FF6B00"}
        onMouseLeave={e => e.currentTarget.style.color = "#636366"}
      >
        ← Back
      </button>

      {/* Card */}
      <div className="animate-fade-up" style={{
        width: "100%", maxWidth: "380px",
        background: "#fff", borderRadius: "24px",
        border: "1px solid rgba(0,0,0,0.07)",
        boxShadow: "0 20px 60px rgba(0,0,0,0.10), 0 4px 16px rgba(0,0,0,0.06)",
        padding: "48px 40px",
        display: "flex", flexDirection: "column", alignItems: "center",
        textAlign: "center", position: "relative",
      }}>
        {/* Logo mark */}
        <div style={{
          width: "60px", height: "60px", borderRadius: "18px",
          background: "rgba(255,107,0,0.10)", display: "flex",
          alignItems: "center", justifyContent: "center",
          marginBottom: "8px",
        }}>
          <span style={{ fontSize: "26px", fontWeight: 800, color: "#FF6B00" }}>N</span>
        </div>

        <h1 style={{
          fontSize: "24px", fontWeight: 700, color: "#1C1C1E",
          letterSpacing: "-0.02em", marginTop: "20px", marginBottom: "8px",
        }}>
          Welcome to NextUp
        </h1>
        <p style={{
          fontSize: "15px", color: "#636366", lineHeight: "1.5",
          fontWeight: 400, marginBottom: "36px",
        }}>
          Sign in to start building your bucket list.
          <br />One account. All your dreams.
        </p>

        {/* Google Sign-In */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          style={{
            width: "100%", display: "flex", alignItems: "center",
            justifyContent: "center", gap: "12px",
            padding: "14px 24px", borderRadius: "14px",
            background: "#fff", border: "1.5px solid rgba(0,0,0,0.12)",
            color: "#1C1C1E", fontSize: "15px", fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={e => {
            if (!loading) {
              e.currentTarget.style.borderColor = "rgba(0,0,0,0.22)";
              e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.10)";
              e.currentTarget.style.transform = "translateY(-1px)";
            }
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = "rgba(0,0,0,0.12)";
            e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          {loading ? <Spinner /> : <GoogleIcon />}
          <span>{loading ? "Signing in…" : "Continue with Google"}</span>
        </button>

        {/* Error */}
        {error && (
          <div style={{
            marginTop: "16px", width: "100%",
            padding: "12px 16px", borderRadius: "12px",
            background: "rgba(255,59,48,0.08)", border: "1px solid rgba(255,59,48,0.20)",
            color: "#D0190B", fontSize: "13px", fontWeight: 500,
          }}>
            {error}
          </div>
        )}

        <p style={{
          marginTop: "32px", fontSize: "12px", color: "#AEAEB2",
          lineHeight: "1.6", fontWeight: 400,
        }}>
          By continuing, you agree to our Terms of Service
          <br />and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
