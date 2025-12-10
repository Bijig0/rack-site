import SignIn from "@/components/common/login-signup-modal/SignIn";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export const metadata = {
  title: "Login | Property Appraisal Portal",
};

const Login = () => {
  return (
    <section className="our-login" style={{ minHeight: "100vh", display: "flex", alignItems: "center" }}>
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
                <i className="flaticon-home-1" style={{ fontSize: "80px", opacity: 0.9 }}></i>
              </div>
              <h1 className="mb-4" style={{ fontSize: "2.5rem", fontWeight: 600 }}>
                Property Appraisal Portal
              </h1>
              <p className="mb-5" style={{ fontSize: "1.1rem", opacity: 0.9, lineHeight: 1.7 }}>
                Generate professional rental appraisal reports for your properties with our streamlined platform designed for real estate agents.
              </p>
              <div className="d-flex justify-content-center gap-4 mb-5">
                <div className="text-center">
                  <div style={{ fontSize: "2rem", fontWeight: 700 }}>Fast</div>
                  <small style={{ opacity: 0.8 }}>Reports in minutes</small>
                </div>
                <div style={{ width: "1px", backgroundColor: "rgba(255,255,255,0.3)" }}></div>
                <div className="text-center">
                  <div style={{ fontSize: "2rem", fontWeight: 700 }}>Accurate</div>
                  <small style={{ opacity: 0.8 }}>Data-driven insights</small>
                </div>
                <div style={{ width: "1px", backgroundColor: "rgba(255,255,255,0.3)" }}></div>
                <div className="text-center">
                  <div style={{ fontSize: "2rem", fontWeight: 700 }}>Professional</div>
                  <small style={{ opacity: 0.8 }}>Branded PDFs</small>
                </div>
              </div>
            </div>
            {/* Decorative Elements */}
            <div
              className="position-absolute"
              style={{
                bottom: "10%",
                left: "10%",
                width: "150px",
                height: "150px",
                border: "2px solid rgba(255,255,255,0.1)",
                borderRadius: "50%"
              }}
            />
            <div
              className="position-absolute"
              style={{
                top: "15%",
                right: "15%",
                width: "80px",
                height: "80px",
                backgroundColor: "rgba(255,255,255,0.05)",
                borderRadius: "50%"
              }}
            />
          </div>

          {/* Right Side - Login Form */}
          <div
            className="col-lg-6 d-flex flex-column justify-content-center align-items-center"
            style={{ backgroundColor: "#f8f9fa", padding: "40px 20px" }}
          >
            <div style={{ width: "100%", maxWidth: "420px" }}>
              <div className="text-center mb-5">
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
                  Welcome Back
                </h2>
                <p className="text-muted mb-0">
                  Sign in to access your property dashboard
                </p>
              </div>

              <div
                className="bg-white p-4 p-md-5 rounded-4"
                style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}
              >
                <SignIn />
              </div>

              <div className="text-center mt-4">
                <p className="text-muted small mb-0">
                  By signing in, you agree to our{" "}
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

export default Login;
