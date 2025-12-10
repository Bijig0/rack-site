import SignUp from "@/components/common/login-signup-modal/SignUp";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export const metadata = {
  title: "Register | Property Appraisal Portal",
};

const Register = () => {
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
              radial-gradient(circle at 80% 80%, rgba(235,103,83,0.12) 0%, transparent 50%),
              radial-gradient(circle at 20% 30%, rgba(74,88,153,0.2) 0%, transparent 50%)
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
            Start generating<br />
            <span style={{
              background: "linear-gradient(135deg, #eb6753 0%, #f4a261 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              professional reports
            </span>
          </h1>
          <p style={{ fontSize: "1.125rem", color: "rgba(255,255,255,0.7)", lineHeight: 1.7, maxWidth: 420 }}>
            Join thousands of property professionals using our platform to create stunning rental appraisal reports.
          </p>

          {/* Features List */}
          <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: "rgba(235,103,83,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <i className="fas fa-chart-line" style={{ color: "#eb6753", fontSize: 18 }} />
              </div>
              <div>
                <div style={{ color: "#fff", fontWeight: 600, fontSize: "0.9375rem" }}>Real-time Market Data</div>
                <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.8125rem" }}>CoreLogic integration & comparable sales</div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: "rgba(16,185,129,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <i className="fas fa-file-pdf" style={{ color: "#10b981", fontSize: 18 }} />
              </div>
              <div>
                <div style={{ color: "#fff", fontWeight: 600, fontSize: "0.9375rem" }}>Instant PDF Reports</div>
                <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.8125rem" }}>Professional branded documents</div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: "rgba(99,102,241,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <i className="fas fa-bolt" style={{ color: "#6366f1", fontSize: 18 }} />
              </div>
              <div>
                <div style={{ color: "#fff", fontWeight: 600, fontSize: "0.9375rem" }}>Results in Seconds</div>
                <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.8125rem" }}>Fast, accurate property valuations</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom - Social Proof */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
            {/* Avatar Stack */}
            <div style={{ display: "flex" }}>
              {["JD", "MK", "AS", "RB"].map((initials, i) => (
                <div
                  key={initials}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: i % 2 === 0
                      ? "linear-gradient(135deg, #eb6753 0%, #f4a261 100%)"
                      : "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "2px solid #1a1f3c",
                    marginLeft: i > 0 ? -10 : 0,
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#fff",
                  }}
                >
                  {initials}
                </div>
              ))}
            </div>
            <div>
              <div style={{ color: "#fff", fontWeight: 600, fontSize: "0.875rem" }}>Join 2,400+ agents</div>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.75rem" }}>Already using Property Reports</div>
            </div>
          </div>

          {/* Trust badges */}
          <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <i className="fas fa-shield-alt" style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }} />
              <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.75rem" }}>Bank-level security</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <i className="fas fa-lock" style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }} />
              <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.75rem" }}>Data encrypted</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Registration Form */}
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
              Create your account
            </h2>
            <p style={{ color: "#6b7280", margin: 0 }}>
              Already have an account?{" "}
              <Link href="/login" style={{ color: "#eb6753", fontWeight: 500, textDecoration: "none" }}>
                Sign in
              </Link>
            </p>
          </div>

          <SignUp />

          <div style={{ marginTop: 32, textAlign: "center" }}>
            <p style={{ color: "#9ca3af", fontSize: "0.8125rem", margin: 0 }}>
              By creating an account, you agree to our{" "}
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

export default Register;
