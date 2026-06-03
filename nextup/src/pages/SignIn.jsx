import React, { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, googleProvider, db } from "../firebase";
import { ArrowLeft, Loader2 } from "lucide-react";

// Google G SVG icon
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

export default function SignIn({ onBack }) {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user   = result.user;

      // Persist user record in Firestore (merge so existing data is preserved)
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
      // Auth state change in App.jsx will redirect to dashboard
    } catch (err) {
      console.error(err);
      if (err.code !== "auth/popup-closed-by-user") {
        setError("Sign-in failed. Please try again.");
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background decorations */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #FFCE1B 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #069494 0%, transparent 70%)" }}
        />
      </div>

      {/* Back button */}
      <button
        onClick={onBack}
        className="absolute top-6 left-6 inline-flex items-center gap-1.5 text-sm font-body font-medium text-charcoal/50 hover:text-burnt transition-colors"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      {/* Card */}
      <div className="animate-fade-up relative w-full max-w-sm bg-white rounded-3xl border border-black/5 shadow-2xl shadow-black/8 p-10 flex flex-col items-center text-center">
        {/* Logo */}
        <div className="mb-2 inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-burnt/10">
          <span className="font-display text-2xl font-bold text-burnt">N</span>
        </div>

        <h1 className="font-display text-2xl font-bold text-charcoal mt-4 mb-1">
          Welcome to NextUp
        </h1>
        <p className="text-sm font-body text-charcoal/40 font-light mb-8 leading-relaxed">
          Sign in to start building your bucket list.
          <br />One account. All your dreams.
        </p>

        {/* Google Sign-In Button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-2xl bg-white border border-black/10 text-charcoal font-body font-medium text-sm shadow-sm hover:shadow-md hover:border-black/20 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 transition-all duration-200"
        >
          {loading ? (
            <Loader2 size={18} className="animate-spin text-burnt" />
          ) : (
            <GoogleIcon />
          )}
          {loading ? "Signing in…" : "Continue with Google"}
        </button>

        {/* Error message */}
        {error && (
          <p className="mt-4 text-xs font-body text-terracotta bg-terracotta/8 px-4 py-2.5 rounded-xl">
            {error}
          </p>
        )}

        <p className="mt-8 text-xs font-body text-charcoal/25 leading-relaxed">
          By continuing, you agree to our Terms of Service
          <br />and Privacy Policy.
        </p>
      </div>
    </div>
  );
}