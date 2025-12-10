import SignIn from "@/components/common/login-signup-modal/SignIn";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export const metadata = {
  title: "Login | Property Appraisal Portal",
};

const Login = () => {
  return (
    <div style={{ minHeight: "100vh", display: "flex" }}>
      {/* Left Side - Branding & Visual */}
      <div
        className="d-none d-lg-flex"
        style={{
          width: "50%",
          background: "linear-gradient(135deg, #1a1f3c 0%, #2d3561 50%, #3d4785 100%)",
          position: "relative",
          overflow: "hidden",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "48px",
        }}
      >
        {/* Background Pattern */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `
              radial-gradient(circle at 20% 80%, rgba(235,103,83,0.15) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(74,88,153,0.2) 0%, transparent 50%)
            `,
          }}
        />

        {/* Subtle grid overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />

        {/* Top - Logo */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <Link href="/">
            <Image
              width={140}
              height={44}
              src="/images/header-logo2.svg"
              alt="Logo"
              style={{ filter: "brightness(0) invert(1)" }}
            />
          </Link>
        </div>

        {/* Center - Main Content */}
        <div style={{ position: "relative", zIndex: 1, flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <h1 style={{ fontSize: "3rem", fontWeight: 700, color: "#fff", lineHeight: 1.2, marginBottom: 24 }}>
            Welcome back to<br />
            <span style={{
              background: "linear-gradient(135deg, #eb6753 0%, #f4a261 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              Property Reports
            </span>
          </h1>
          <p style={{ fontSize: "1.125rem", color: "rgba(255,255,255,0.7)", lineHeight: 1.7, maxWidth: 400 }}>
            Access your dashboard to manage properties, generate reports, and track market insights.
          </p>

          {/* Stats */}
          <div style={{ display: "flex", gap: 48, marginTop: 48 }}>
            <div>
              <div style={{ fontSize: "2rem", fontWeight: 700, color: "#fff" }}>2,400+</div>
              <div style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.5)" }}>Active Agents</div>
            </div>
            <div>
              <div style={{ fontSize: "2rem", fontWeight: 700, color: "#fff" }}>50K+</div>
              <div style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.5)" }}>Reports Generated</div>
            </div>
            <div>
              <div style={{ fontSize: "2rem", fontWeight: 700, color: "#eb6753" }}>4.9</div>
              <div style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.5)" }}>User Rating</div>
            </div>
          </div>
        </div>

        {/* Bottom - Testimonial */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            background: "rgba(255,255,255,0.08)",
            backdropFilter: "blur(10px)",
            borderRadius: 16,
            padding: 24,
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #eb6753 0%, #f4a261 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <span style={{ color: "#fff", fontWeight: 600, fontSize: 18 }}>SM</span>
            </div>
            <div>
              <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "0.9375rem", lineHeight: 1.6, marginBottom: 12, fontStyle: "italic" }}>
                &ldquo;This platform has completely transformed how we handle rental appraisals. What used to take hours now takes minutes.&rdquo;
              </p>
              <div>
                <div style={{ color: "#fff", fontWeight: 600, fontSize: "0.875rem" }}>Sarah Mitchell</div>
                <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.8125rem" }}>Property Manager, Ray White</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div
        style={{
          width: "50%",
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "48px 24px",
          background: "#fff",
        }}
        className="flex-grow-1"
      >
        <div style={{ width: "100%", maxWidth: 400 }}>
          {/* Mobile Logo */}
          <div className="d-lg-none text-center mb-4">
            <Link href="/">
              <Image
                width={140}
                height={44}
                src="/images/header-logo2.svg"
                alt="Logo"
              />
            </Link>
          </div>

          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: "1.75rem", fontWeight: 600, color: "#1a1f3c", marginBottom: 8 }}>
              Sign in
            </h2>
            <p style={{ color: "#6b7280", margin: 0 }}>
              Don&apos;t have an account?{" "}
              <Link href="/register" style={{ color: "#eb6753", fontWeight: 500, textDecoration: "none" }}>
                Create one
              </Link>
            </p>
          </div>

          <SignIn />

          <div style={{ marginTop: 32, textAlign: "center" }}>
            <p style={{ color: "#9ca3af", fontSize: "0.8125rem", margin: 0 }}>
              By signing in, you agree to our{" "}
              <Link href="/terms" style={{ color: "#6b7280", textDecoration: "underline" }}>
                Terms
              </Link>{" "}
              and{" "}
              <Link href="/privacy" style={{ color: "#6b7280", textDecoration: "underline" }}>
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
