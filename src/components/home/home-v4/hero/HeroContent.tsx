"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const HeroContent = () => {
  const router = useRouter();
  const [address, setAddress] = useState("");

  const handleGenerateReport = () => {
    if (address.trim()) {
      // Navigate to report generation with address
      router.push(`/dashboard-home?address=${encodeURIComponent(address)}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleGenerateReport();
    }
  };

  return (
    <div className="advance-search-tab mt60 mt30-lg mx-auto animate-up-3" style={{ maxWidth: '700px' }}>
      <div
        className="advance-content-style1"
        style={{
          backgroundColor: 'rgba(255,255,255,0.95)',
          borderRadius: '16px',
          padding: '8px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        }}
      >
        <div className="row align-items-center">
          <div className="col-md-9">
            <div className="advance-search-field position-relative text-start">
              <form className="form-search position-relative" onSubmit={(e) => e.preventDefault()}>
                <div className="box-search" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span
                    className="flaticon-location"
                    style={{
                      fontSize: '20px',
                      color: '#eb6753',
                      marginLeft: '16px',
                    }}
                  />
                  <input
                    className="form-control border-0"
                    type="text"
                    name="address"
                    placeholder="Enter property address..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    onKeyDown={handleKeyDown}
                    style={{
                      fontSize: '16px',
                      padding: '16px 0',
                      backgroundColor: 'transparent',
                    }}
                  />
                </div>
              </form>
            </div>
          </div>
          {/* End .col-md-9 */}

          <div className="col-md-3">
            <button
              className="ud-btn btn-dark w-100"
              type="button"
              onClick={handleGenerateReport}
              style={{
                borderRadius: '12px',
                padding: '16px 24px',
                fontSize: '15px',
                fontWeight: '600',
              }}
            >
              Generate
              <i className="fas fa-file-pdf ms-2" />
            </button>
          </div>
        </div>
      </div>

      {/* Feature badges */}
      <div
        className="mt-4 d-flex flex-wrap justify-content-center gap-3 animate-up-4"
        style={{ opacity: 0.9 }}
      >
        <div
          className="d-flex align-items-center gap-2"
          style={{
            backgroundColor: 'rgba(255,255,255,0.15)',
            borderRadius: '20px',
            padding: '8px 16px',
            color: '#fff',
            fontSize: '13px',
          }}
        >
          <i className="fas fa-check-circle" style={{ color: '#4ade80' }} />
          Instant Results
        </div>
        <div
          className="d-flex align-items-center gap-2"
          style={{
            backgroundColor: 'rgba(255,255,255,0.15)',
            borderRadius: '20px',
            padding: '8px 16px',
            color: '#fff',
            fontSize: '13px',
          }}
        >
          <i className="fas fa-check-circle" style={{ color: '#4ade80' }} />
          Market Comparisons
        </div>
        <div
          className="d-flex align-items-center gap-2"
          style={{
            backgroundColor: 'rgba(255,255,255,0.15)',
            borderRadius: '20px',
            padding: '8px 16px',
            color: '#fff',
            fontSize: '13px',
          }}
        >
          <i className="fas fa-check-circle" style={{ color: '#4ade80' }} />
          Professional PDF Export
        </div>
      </div>
    </div>
  );
};

export default HeroContent;
