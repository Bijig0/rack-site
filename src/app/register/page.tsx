import SignUp from "@/components/common/login-signup-modal/SignUp";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export const metadata = {
  title: "Register | Property Appraisal Portal",
};

const Register = () => {
  return (
    <section className="our-register" style={{ minHeight: "100vh", display: "flex", alignItems: "center" }}>
      <div className="container-fluid p-0">
        <div className="row g-0" style={{ minHeight: "100vh" }}>
          {/* Left Side - Feature Showcase */}
          <div
            className="col-lg-6 d-none d-lg-flex flex-column justify-content-center align-items-center position-relative"
            style={{
              background: "linear-gradient(135deg, #1f4b43 0%, #2c665c 50%, #3d8b7f 100%)",
              padding: "60px"
            }}
          >
            <div className="text-center text-white" style={{ maxWidth: "500px", zIndex: 1 }}>
              <div className="mb-4">
                <i className="flaticon-new-home" style={{ fontSize: "80px", opacity: 0.9 }}></i>
              </div>
              <h1 className="mb-4" style={{ fontSize: "2.5rem", fontWeight: 600 }}>
                Start Your Journey
              </h1>
              <p className="mb-5" style={{ fontSize: "1.1rem", opacity: 0.9, lineHeight: 1.7 }}>
                Join our platform to create professional rental appraisal reports and manage your property portfolio efficiently.
              </p>

              <div className="text-start" style={{ maxWidth: "380px", margin: "0 auto" }}>
                <div className="d-flex align-items-start mb-4">
                  <div
                    className="me-3 d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{
                      width: "48px",
                      height: "48px",
                      backgroundColor: "rgba(255,255,255,0.15)",
                      borderRadius: "12px"
                    }}
                  >
                    <i className="fas fa-chart-line" style={{ fontSize: "20px" }}></i>
                  </div>
                  <div>
                    <h5 className="mb-1" style={{ fontWeight: 600 }}>Market Analytics</h5>
                    <p className="mb-0" style={{ opacity: 0.8, fontSize: "0.9rem" }}>
                      Access real-time market data and comparable sales
                    </p>
                  </div>
                </div>

                <div className="d-flex align-items-start mb-4">
                  <div
                    className="me-3 d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{
                      width: "48px",
                      height: "48px",
                      backgroundColor: "rgba(255,255,255,0.15)",
                      borderRadius: "12px"
                    }}
                  >
                    <i className="fas fa-file-pdf" style={{ fontSize: "20px" }}></i>
                  </div>
                  <div>
                    <h5 className="mb-1" style={{ fontWeight: 600 }}>Professional Reports</h5>
                    <p className="mb-0" style={{ opacity: 0.8, fontSize: "0.9rem" }}>
                      Generate branded PDF reports instantly
                    </p>
                  </div>
                </div>

                <div className="d-flex align-items-start">
                  <div
                    className="me-3 d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{
                      width: "48px",
                      height: "48px",
                      backgroundColor: "rgba(255,255,255,0.15)",
                      borderRadius: "12px"
                    }}
                  >
                    <i className="fas fa-building" style={{ fontSize: "20px" }}></i>
                  </div>
                  <div>
                    <h5 className="mb-1" style={{ fontWeight: 600 }}>Portfolio Management</h5>
                    <p className="mb-0" style={{ opacity: 0.8, fontSize: "0.9rem" }}>
                      Manage all your properties in one place
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div
              className="position-absolute"
              style={{
                top: "10%",
                left: "10%",
                width: "120px",
                height: "120px",
                border: "2px solid rgba(255,255,255,0.1)",
                borderRadius: "50%"
              }}
            />
            <div
              className="position-absolute"
              style={{
                bottom: "15%",
                right: "10%",
                width: "60px",
                height: "60px",
                backgroundColor: "rgba(255,255,255,0.05)",
                borderRadius: "50%"
              }}
            />
          </div>

          {/* Right Side - Registration Form */}
          <div
            className="col-lg-6 d-flex flex-column justify-content-center align-items-center"
            style={{ backgroundColor: "#f8f9fa", padding: "40px 20px" }}
          >
            <div style={{ width: "100%", maxWidth: "420px" }}>
              <div className="text-center mb-4">
                <Link href="/">
                  <Image
                    width={180}
                    height={57}
                    className="mb-4"
                    src="/images/header-logo2.svg"
                    alt="logo"
                    priority
                  />
                </Link>
                <h2 className="mb-2" style={{ fontSize: "1.75rem", fontWeight: 600, color: "#1f4b43" }}>
                  Create Account
                </h2>
                <p className="text-muted mb-0">
                  Get started with your property appraisals
                </p>
              </div>

              <div
                className="bg-white p-4 p-md-5 rounded-4"
                style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}
              >
                <SignUp />
              </div>

              <div className="text-center mt-4">
                <p className="text-muted small mb-0">
                  By creating an account, you agree to our{" "}
                  <Link href="/terms" className="text-decoration-underline" style={{ color: "#1f4b43" }}>
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-decoration-underline" style={{ color: "#1f4b43" }}>
                    Privacy Policy
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
