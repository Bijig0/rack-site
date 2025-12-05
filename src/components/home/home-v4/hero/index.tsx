"use client";

import HeroContent from "./HeroContent";

const Hero = () => {
  return (
    <>
      <div
        className="inner-banner-style4 position-relative overflow-hidden"
        style={{
          backgroundImage: 'url(/images/home/home-4.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          minHeight: '600px',
          paddingTop: '120px',
          paddingBottom: '80px',
        }}
      >
        {/* Dark overlay for text readability */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(26, 31, 60, 0.85) 0%, rgba(45, 53, 97, 0.75) 50%, rgba(74, 88, 153, 0.7) 100%)',
            zIndex: 0,
          }}
        />
        <h2
          className="hero-title animate-up-1"
          style={{ color: '#ffffff', position: 'relative', zIndex: 1 }}
        >
          Generate Professional <br className="d-none d-md-block" /> Rental Appraisal Reports
        </h2>
        <p
          className="hero-text fz15 animate-up-2"
          style={{ color: 'rgba(255,255,255,0.8)', position: 'relative', zIndex: 1 }}
        >
          Enter a property address and get a comprehensive PDF report in seconds
        </p>

        {/* PDF Report Visual - Bottom Right */}
        <div
          className="d-none d-xl-block"
          style={{
            position: 'absolute',
            right: '80px',
            bottom: '40px',
            transform: 'rotate(-5deg)',
            zIndex: 1,
          }}
        >
          {/* Report Stack Effect */}
          <div style={{ position: 'relative' }}>
            {/* Back page */}
            <div
              style={{
                position: 'absolute',
                width: '200px',
                height: '260px',
                backgroundColor: '#e8e8e8',
                borderRadius: '8px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                transform: 'rotate(8deg) translateX(20px) translateY(10px)',
              }}
            />
            {/* Middle page */}
            <div
              style={{
                position: 'absolute',
                width: '200px',
                height: '260px',
                backgroundColor: '#f0f0f0',
                borderRadius: '8px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
                transform: 'rotate(4deg) translateX(10px) translateY(5px)',
              }}
            />
            {/* Main Report */}
            <div
              style={{
                width: '200px',
                height: '260px',
                backgroundColor: '#ffffff',
                borderRadius: '8px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
                padding: '20px',
                position: 'relative',
              }}
            >
              {/* PDF Icon Badge */}
              <div
                style={{
                  position: 'absolute',
                  top: '-15px',
                  right: '-15px',
                  width: '50px',
                  height: '50px',
                  backgroundColor: '#eb6753',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 15px rgba(235,103,83,0.4)',
                }}
              >
                <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '12px' }}>PDF</span>
              </div>

              {/* Report Header */}
              <div
                style={{
                  backgroundColor: '#1a1f3c',
                  borderRadius: '4px',
                  padding: '10px',
                  marginBottom: '12px',
                }}
              >
                <div style={{ fontSize: '8px', color: '#fff', fontWeight: '600', marginBottom: '2px' }}>
                  RENTAL APPRAISAL
                </div>
                <div style={{ fontSize: '6px', color: 'rgba(255,255,255,0.7)' }}>
                  Property Report
                </div>
              </div>

              {/* Fake content lines */}
              <div style={{ marginBottom: '10px' }}>
                <div style={{ height: '6px', backgroundColor: '#e0e0e0', borderRadius: '3px', marginBottom: '6px', width: '100%' }} />
                <div style={{ height: '6px', backgroundColor: '#e0e0e0', borderRadius: '3px', marginBottom: '6px', width: '80%' }} />
                <div style={{ height: '6px', backgroundColor: '#e0e0e0', borderRadius: '3px', width: '60%' }} />
              </div>

              {/* Fake chart */}
              <div
                style={{
                  backgroundColor: '#f5f5f5',
                  borderRadius: '4px',
                  padding: '8px',
                  marginBottom: '10px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '40px' }}>
                  <div style={{ flex: 1, backgroundColor: '#4a5899', borderRadius: '2px', height: '60%' }} />
                  <div style={{ flex: 1, backgroundColor: '#4a5899', borderRadius: '2px', height: '80%' }} />
                  <div style={{ flex: 1, backgroundColor: '#eb6753', borderRadius: '2px', height: '100%' }} />
                  <div style={{ flex: 1, backgroundColor: '#4a5899', borderRadius: '2px', height: '70%' }} />
                  <div style={{ flex: 1, backgroundColor: '#4a5899', borderRadius: '2px', height: '50%' }} />
                </div>
              </div>

              {/* Value highlight */}
              <div
                style={{
                  backgroundColor: '#e8f5e9',
                  borderRadius: '4px',
                  padding: '8px',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '6px', color: '#666', marginBottom: '2px' }}>
                  ESTIMATED WEEKLY RENT
                </div>
                <div style={{ fontSize: '14px', color: '#2e7d32', fontWeight: '700' }}>
                  $650 - $720
                </div>
              </div>

              {/* More content lines */}
              <div style={{ marginTop: '10px' }}>
                <div style={{ height: '4px', backgroundColor: '#e0e0e0', borderRadius: '2px', marginBottom: '4px', width: '100%' }} />
                <div style={{ height: '4px', backgroundColor: '#e0e0e0', borderRadius: '2px', width: '70%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div
          className="d-none d-lg-block"
          style={{
            position: 'absolute',
            left: '50px',
            top: '150px',
            width: '100px',
            height: '100px',
            border: '2px solid rgba(255,255,255,0.1)',
            borderRadius: '50%',
            zIndex: 1,
          }}
        />
        <div
          className="d-none d-lg-block"
          style={{
            position: 'absolute',
            left: '100px',
            bottom: '100px',
            width: '60px',
            height: '60px',
            backgroundColor: 'rgba(235,103,83,0.2)',
            borderRadius: '50%',
            zIndex: 1,
          }}
        />

        <HeroContent />
      </div>
    </>
  );
};

export default Hero;
