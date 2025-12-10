"use client";

import HeroAddressSearch from "./HeroAddressSearch";

export default function HeroSection() {
  return (
    <section
      className="home-banner-style4 p0"
      style={{
        background:
          "linear-gradient(135deg, #1a1f3c 0%, #2d3561 40%, #3d4785 70%, #4a5899 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Abstract geometric shapes */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
          overflow: "hidden",
        }}
      >
        {/* Large circle top right */}
        <div
          style={{
            position: "absolute",
            top: -150,
            right: -100,
            width: 500,
            height: 500,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(235,103,83,0.15) 0%, transparent 70%)",
          }}
        />
        {/* Medium circle bottom left */}
        <div
          style={{
            position: "absolute",
            bottom: -100,
            left: -50,
            width: 350,
            height: 350,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(74,88,153,0.3) 0%, transparent 70%)",
          }}
        />
        {/* Floating dots pattern */}
        <div
          style={{
            position: "absolute",
            top: "20%",
            left: "15%",
            width: 8,
            height: 8,
            borderRadius: "50%",
            backgroundColor: "rgba(255,255,255,0.1)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "40%",
            left: "10%",
            width: 6,
            height: 6,
            borderRadius: "50%",
            backgroundColor: "rgba(255,255,255,0.08)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "60%",
            left: "5%",
            width: 10,
            height: 10,
            borderRadius: "50%",
            backgroundColor: "rgba(255,255,255,0.06)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "30%",
            right: "25%",
            width: 12,
            height: 12,
            borderRadius: "50%",
            backgroundColor: "rgba(235,103,83,0.2)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "30%",
            right: "15%",
            width: 8,
            height: 8,
            borderRadius: "50%",
            backgroundColor: "rgba(255,255,255,0.1)",
          }}
        />
        {/* Subtle grid lines */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="container position-relative" style={{ zIndex: 1 }}>
        <div
          className="row align-items-center justify-content-between"
          style={{ minHeight: "650px", paddingTop: 120, paddingBottom: 100 }}
        >
          {/* Left Column */}
          <div className="col-lg-5">
            {/* Trusted Badge */}
            <div
              className="d-inline-flex align-items-center mb-4"
              style={{
                backgroundColor: "rgba(255,255,255,0.1)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: 50,
                padding: "8px 16px",
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  backgroundColor: "#10b981",
                  borderRadius: "50%",
                  marginRight: 10,
                }}
              />
              <span
                style={{
                  fontSize: 13,
                  color: "rgba(255,255,255,0.9)",
                  fontWeight: 500,
                }}
              >
                Trusted by 2,400+ agents across Australia
              </span>
            </div>

            <h1
              className="mb30"
              style={{
                fontSize: "clamp(32px, 5vw, 52px)",
                fontWeight: 700,
                color: "#fff",
                lineHeight: 1.4,
              }}
            >
              Generate{" "}
              <span
                style={{
                  position: "relative",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  background: "linear-gradient(135deg, #eb6753 0%, #e85a47 100%)",
                  padding: "6px 18px",
                  borderRadius: 10,
                  whiteSpace: "nowrap",
                  boxShadow: "0 4px 20px rgba(235,103,83,0.35)",
                }}
              >
                Property Reports
                <i
                  className="fas fa-file-alt"
                  style={{
                    fontSize: "0.7em",
                    opacity: 0.9,
                  }}
                />
              </span>
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg, #eb6753 0%, #f4a261 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Instantly
              </span>
            </h1>
            <p
              className="mb30"
              style={{
                fontSize: 17,
                color: "rgba(255,255,255,0.85)",
                lineHeight: 1.7,
                maxWidth: 440,
              }}
            >
              Enter any address and get comprehensive rental appraisals, market
              insights, and professional PDFs in seconds.
            </p>

            {/* Address Input */}
            <div className="mb-4 position-relative" style={{ maxWidth: 480 }}>
              <HeroAddressSearch />
              {/* Arrow pointing to illustration */}
              <svg
                className="d-none d-lg-block"
                style={{
                  position: "absolute",
                  top: "30%",
                  right: -180,
                  transform: "translateY(-50%)",
                  width: 160,
                  height: 80,
                }}
                viewBox="0 0 160 80"
                fill="none"
              >
                <path
                  d="M5 50 C 40 50, 60 30, 100 20 C 120 15, 140 12, 150 12"
                  stroke="rgba(255,255,255,0.5)"
                  strokeWidth="2"
                  strokeDasharray="6 4"
                  fill="none"
                />
                <path
                  d="M142 5 L155 12 L142 19"
                  stroke="rgba(255,255,255,0.5)"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Quick Stats */}
            <div
              className="d-flex align-items-center flex-wrap gap-4"
              style={{ fontSize: 14 }}
            >
              <div
                className="d-flex align-items-center"
                style={{ color: "rgba(255,255,255,0.8)" }}
              >
                <i
                  className="fas fa-check-circle me-2"
                  style={{ color: "#10b981", fontSize: 16 }}
                />
                <span>CoreLogic Data</span>
              </div>
              <div
                className="d-flex align-items-center"
                style={{ color: "rgba(255,255,255,0.8)" }}
              >
                <i
                  className="fas fa-check-circle me-2"
                  style={{ color: "#10b981", fontSize: 16 }}
                />
                <span>Planning & Zoning</span>
              </div>
              <div
                className="d-flex align-items-center"
                style={{ color: "rgba(255,255,255,0.8)" }}
              >
                <i
                  className="fas fa-check-circle me-2"
                  style={{ color: "#10b981", fontSize: 16 }}
                />
                <span>PDF Export</span>
              </div>
            </div>
          </div>

          {/* Right Column - Integrated Illustration */}
          <div className="col-lg-6 d-none d-lg-block">
            <div className="position-relative d-flex justify-content-end" style={{ marginTop: 20, marginBottom: 60 }}>
              {/* Main Report Card - Primary illustration */}
              <div
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 16,
                  padding: 24,
                  boxShadow: "0 25px 80px rgba(0,0,0,0.3)",
                  position: "relative",
                  zIndex: 2,
                  transform: "rotate(2deg)",
                  width: 320,
                }}
              >
                {/* Floating Badge - Instant PDF - attached to card */}
                <div
                  style={{
                    position: "absolute",
                    top: -15,
                    right: -15,
                    backgroundColor: "#eb6753",
                    color: "#fff",
                    padding: "8px 16px",
                    borderRadius: 20,
                    fontSize: 12,
                    fontWeight: 600,
                    boxShadow: "0 4px 15px rgba(235,103,83,0.4)",
                    zIndex: 5,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <i className="fas fa-bolt" style={{ fontSize: 11 }} />
                  <span>Instant PDF</span>
                </div>
                {/* Report Header */}
                <div
                  style={{
                    backgroundColor: "#1a1f3c",
                    borderRadius: 10,
                    padding: 16,
                    marginBottom: 16,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      marginBottom: 8,
                    }}
                  >
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        backgroundColor: "#eb6753",
                        borderRadius: 8,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <i
                        className="fas fa-file-alt"
                        style={{ color: "#fff", fontSize: 14 }}
                      />
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: 12,
                          color: "#fff",
                          fontWeight: 600,
                        }}
                      >
                        RENTAL APPRAISAL
                      </div>
                      <div
                        style={{
                          fontSize: 10,
                          color: "rgba(255,255,255,0.7)",
                        }}
                      >
                        Property Report
                      </div>
                    </div>
                  </div>
                </div>

                {/* Property Info */}
                <div style={{ marginBottom: 16 }}>
                  <div
                    style={{ fontSize: 11, color: "#888", marginBottom: 4 }}
                  >
                    PROPERTY ADDRESS
                  </div>
                  <div
                    style={{ fontSize: 14, color: "#222", fontWeight: 600 }}
                  >
                    123 Sample Street, Sydney NSW
                  </div>
                </div>

                {/* Stats Row */}
                <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                  <div
                    style={{
                      flex: 1,
                      backgroundColor: "#f5f5f5",
                      borderRadius: 8,
                      padding: 12,
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{ fontSize: 10, color: "#888", marginBottom: 2 }}
                    >
                      BEDROOMS
                    </div>
                    <div
                      style={{ fontSize: 18, fontWeight: 700, color: "#222" }}
                    >
                      3
                    </div>
                  </div>
                  <div
                    style={{
                      flex: 1,
                      backgroundColor: "#f5f5f5",
                      borderRadius: 8,
                      padding: 12,
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{ fontSize: 10, color: "#888", marginBottom: 2 }}
                    >
                      BATHROOMS
                    </div>
                    <div
                      style={{ fontSize: 18, fontWeight: 700, color: "#222" }}
                    >
                      2
                    </div>
                  </div>
                  <div
                    style={{
                      flex: 1,
                      backgroundColor: "#f5f5f5",
                      borderRadius: 8,
                      padding: 12,
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{ fontSize: 10, color: "#888", marginBottom: 2 }}
                    >
                      PARKING
                    </div>
                    <div
                      style={{ fontSize: 18, fontWeight: 700, color: "#222" }}
                    >
                      1
                    </div>
                  </div>
                </div>

                {/* Chart Placeholder */}
                <div style={{ marginBottom: 16 }}>
                  <div
                    style={{ fontSize: 11, color: "#888", marginBottom: 8 }}
                  >
                    MARKET COMPARISON
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-end",
                      gap: 6,
                      height: 60,
                    }}
                  >
                    <div
                      style={{
                        flex: 1,
                        backgroundColor: "#e0e0e0",
                        borderRadius: 4,
                        height: "50%",
                      }}
                    />
                    <div
                      style={{
                        flex: 1,
                        backgroundColor: "#e0e0e0",
                        borderRadius: 4,
                        height: "70%",
                      }}
                    />
                    <div
                      style={{
                        flex: 1,
                        backgroundColor: "#eb6753",
                        borderRadius: 4,
                        height: "100%",
                      }}
                    />
                    <div
                      style={{
                        flex: 1,
                        backgroundColor: "#e0e0e0",
                        borderRadius: 4,
                        height: "65%",
                      }}
                    />
                    <div
                      style={{
                        flex: 1,
                        backgroundColor: "#e0e0e0",
                        borderRadius: 4,
                        height: "45%",
                      }}
                    />
                  </div>
                </div>

                {/* Estimated Value */}
                <div
                  style={{
                    backgroundColor: "#e8f5e9",
                    borderRadius: 10,
                    padding: 14,
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{ fontSize: 10, color: "#666", marginBottom: 4 }}
                  >
                    ESTIMATED WEEKLY RENT
                  </div>
                  <div
                    style={{
                      fontSize: 24,
                      color: "#2e7d32",
                      fontWeight: 700,
                    }}
                  >
                    $650 - $720
                  </div>
                </div>
              </div>

              {/* Dashboard Metrics Card - Overlapping */}
              <div
                style={{
                  position: "absolute",
                  bottom: -30,
                  right: 180,
                  backgroundColor: "#fff",
                  borderRadius: 16,
                  padding: 20,
                  boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
                  width: 280,
                  zIndex: 3,
                  transform: "rotate(-4deg)",
                }}
              >
                <p
                  className="mb-3"
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#888",
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    marginBottom: 12,
                  }}
                >
                  Dashboard Metrics
                </p>
                <div className="row g-2">
                  <div className="col-6">
                    <div
                      style={{
                        background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
                        borderRadius: 10,
                        padding: 10,
                        border: "1px solid #bfdbfe",
                      }}
                    >
                      <p style={{ fontSize: 10, color: "#2563eb", fontWeight: 500, marginBottom: 2 }}>
                        Rental Estimate
                      </p>
                      <p style={{ fontSize: 16, fontWeight: 700, color: "#1e293b", marginBottom: 0 }}>
                        $620/wk
                      </p>
                    </div>
                  </div>
                  <div className="col-6">
                    <div
                      style={{
                        background: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)",
                        borderRadius: 10,
                        padding: 10,
                        border: "1px solid #a7f3d0",
                      }}
                    >
                      <p style={{ fontSize: 10, color: "#059669", fontWeight: 500, marginBottom: 2 }}>
                        Market Trend
                      </p>
                      <p style={{ fontSize: 16, fontWeight: 700, color: "#1e293b", marginBottom: 0 }}>
                        +4.2%
                      </p>
                    </div>
                  </div>
                  <div className="col-6">
                    <div
                      style={{
                        background: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)",
                        borderRadius: 10,
                        padding: 10,
                        border: "1px solid #fcd34d",
                      }}
                    >
                      <p style={{ fontSize: 10, color: "#d97706", fontWeight: 500, marginBottom: 2 }}>
                        Days on Market
                      </p>
                      <p style={{ fontSize: 16, fontWeight: 700, color: "#1e293b", marginBottom: 0 }}>
                        23
                      </p>
                    </div>
                  </div>
                  <div className="col-6">
                    <div
                      style={{
                        background: "linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)",
                        borderRadius: 10,
                        padding: 10,
                        border: "1px solid #c4b5fd",
                      }}
                    >
                      <p style={{ fontSize: 10, color: "#7c3aed", fontWeight: 500, marginBottom: 2 }}>
                        Yield
                      </p>
                      <p style={{ fontSize: 16, fontWeight: 700, color: "#1e293b", marginBottom: 0 }}>
                        4.8%
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative circles behind */}
              <div
                style={{
                  position: "absolute",
                  top: 20,
                  right: 20,
                  width: 280,
                  height: 180,
                  backgroundColor: "rgba(255,255,255,0.08)",
                  borderRadius: 16,
                  transform: "rotate(8deg)",
                  zIndex: 0,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: 40,
                  right: 40,
                  width: 280,
                  height: 180,
                  backgroundColor: "rgba(255,255,255,0.05)",
                  borderRadius: 16,
                  transform: "rotate(12deg)",
                  zIndex: 0,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
