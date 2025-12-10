"use client";

import MainMenu from "@/components/common/MainMenu";
import LoginSignupModal from "@/components/common/login-signup-modal";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const DefaultHeader = () => {
  const [navbar, setNavbar] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const changeBackground = () => {
    if (window.scrollY >= 10) {
      setNavbar(true);
    } else {
      setNavbar(false);
    }
  };

  // Check authentication status on mount via API (since httpOnly cookie can't be read by JS)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/status');
        const data = await response.json();
        setIsAuthenticated(data.authenticated);
      } catch (error) {
        console.error('Error checking auth status:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", changeBackground);
    return () => {
      window.removeEventListener("scroll", changeBackground);
    };
  }, []);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.profile-menu-wrapper')) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <header
        className={`header-nav nav-homepage-style light-header menu-home4 main-menu ${
          navbar ? "sticky slideInDown animated" : ""
        }`}
        style={{
          position: navbar ? "fixed" : "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 999,
        }}
      >
        <nav className="posr">
          <div className="container posr menu_bdrt1">
            <div className="row align-items-center justify-content-between">
              <div className="col-auto">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="logos mr40">
                    <Link className="header-logo logo1" href="/">
                      <Image
                        width={138}
                        height={44}
                        src="/images/header-logo2.svg"
                        alt="Header Logo"
                      />
                    </Link>
                    <Link className="header-logo logo2" href="/">
                      <Image
                        width={138}
                        height={44}
                        src="/images/header-logo2.svg"
                        alt="Header Logo"
                      />
                    </Link>
                  </div>
                  {/* End Logo */}

                  <MainMenu />
                  {/* End Main Menu */}
                </div>
              </div>
              {/* End .col-auto */}

              <div className="col-auto">
                <div className="d-flex align-items-center">
                  {isLoading ? (
                    // Loading state - show placeholder
                    <div className="login-info d-flex align-items-center" style={{ opacity: 0.5 }}>
                      <i className="far fa-user-circle fz16 me-2" />
                      <span className="d-none d-xl-block">...</span>
                    </div>
                  ) : isAuthenticated ? (
                    // Authenticated: Show profile icon with dropdown
                    <div className="profile-menu-wrapper position-relative">
                      <button
                        className="login-info d-flex align-items-center border-0 bg-transparent"
                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                        style={{ cursor: 'pointer' }}
                      >
                        <i className="far fa-user-circle fz16 me-2" />
                        <span className="d-none d-xl-block">My Account</span>
                        <i className={`fas fa-chevron-down ms-2 fz12 transition-all ${showProfileMenu ? 'rotate-180' : ''}`} style={{ transition: 'transform 0.2s' }} />
                      </button>

                      {/* Profile Dropdown */}
                      {showProfileMenu && (
                        <div
                          className="position-absolute bg-white rounded-3 shadow-lg"
                          style={{
                            top: 'calc(100% + 10px)',
                            right: 0,
                            minWidth: 200,
                            zIndex: 1000,
                            border: '1px solid #e0e0e0',
                            overflow: 'hidden',
                          }}
                        >
                          <Link
                            href="/dashboard"
                            className="d-flex align-items-center px-4 py-3 text-decoration-none"
                            style={{
                              color: '#222',
                              transition: 'background-color 0.15s',
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            onClick={() => setShowProfileMenu(false)}
                          >
                            <i className="fas fa-tachometer-alt me-3" style={{ color: '#eb6753', width: 20 }} />
                            <span className="fw500">Dashboard</span>
                          </Link>
                        </div>
                      )}
                    </div>
                  ) : (
                    // Not authenticated: Show login/register
                    <a
                      href="#"
                      className="login-info d-flex align-items-center"
                      data-bs-toggle="modal"
                      data-bs-target="#loginSignupModal"
                      role="button"
                    >
                      <i className="far fa-user-circle fz16 me-2" />{" "}
                      <span className="d-none d-xl-block">Login / Register</span>
                    </a>
                  )}
                </div>
              </div>
              {/* End .col-auto */}
            </div>
            {/* End .row */}
          </div>
        </nav>
      </header>
      {/* End Header */}

      {/* Signup Modal */}
      <div className="signup-modal">
        <div
          className="modal fade"
          id="loginSignupModal"
          tabIndex={-1}
          aria-labelledby="loginSignupModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog  modal-dialog-scrollable modal-dialog-centered">
            <LoginSignupModal />
          </div>
        </div>
      </div>
      {/* End Signup Modal */}
    </>
  );
};

export default DefaultHeader;
