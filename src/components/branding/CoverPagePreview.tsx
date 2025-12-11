"use client";

import Image from "next/image";

interface CoverPagePreviewProps {
  companyName?: string;
  companyLogoUrl?: string | null;
}

export function CoverPagePreview({
  companyName,
  companyLogoUrl,
}: CoverPagePreviewProps) {
  return (
    <div
      style={{
        backgroundColor: "#fff",
        borderRadius: 8,
        boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        overflow: "hidden",
        aspectRatio: "210 / 297", // A4 ratio
        position: "relative",
      }}
    >
      {/* Header - matches actual cover page */}
      <div
        style={{
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        {companyLogoUrl ? (
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              overflow: "hidden",
              backgroundColor: "#fff",
              flexShrink: 0,
              position: "relative",
            }}
          >
            <Image
              src={companyLogoUrl}
              alt="Logo"
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
        ) : (
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              backgroundColor: "#793CF9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <i
              className="fas fa-building"
              style={{ color: "#fff", fontSize: 12 }}
            />
          </div>
        )}
        <span
          style={{
            fontSize: 10,
            color: companyName ? "#793CF9" : "#ccc",
            fontWeight: 400,
            letterSpacing: "0.1px",
          }}
        >
          {companyName || "Your Company"}
        </span>
      </div>

      {/* Decorative waves (simplified purple curves) */}
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 40,
          width: 80,
          height: "70%",
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        <svg
          width="80"
          height="100%"
          viewBox="0 0 80 200"
          fill="none"
          preserveAspectRatio="none"
          style={{ height: "100%" }}
        >
          <path
            d="M80 0C30 30 15 60 45 100C75 140 30 170 80 200"
            stroke="#793CF9"
            strokeWidth="1"
            fill="none"
            opacity="0.3"
          />
          <path
            d="M70 0C20 40 5 70 35 110C65 150 20 180 70 200"
            stroke="#9B6DFF"
            strokeWidth="1"
            fill="none"
            opacity="0.25"
          />
          <path
            d="M60 0C10 35 0 65 30 105C60 145 10 175 60 200"
            stroke="#A78BFA"
            strokeWidth="1"
            fill="none"
            opacity="0.2"
          />
          <path
            d="M90 0C40 45 25 80 55 120C85 160 40 185 90 200"
            stroke="#C4B5FD"
            strokeWidth="0.8"
            fill="none"
            opacity="0.15"
          />
        </svg>
      </div>

      {/* Main title */}
      <div
        style={{
          position: "absolute",
          left: 16,
          top: "35%",
          transform: "translateY(-50%)",
        }}
      >
        <p
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: "#0F172B",
            margin: 0,
            letterSpacing: 0.5,
            lineHeight: 1,
          }}
        >
          PROPERTY
        </p>
        <p
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: "#A684FF",
            margin: 0,
            marginTop: 4,
            letterSpacing: 0.5,
            lineHeight: 1,
          }}
        >
          REPORT
        </p>
        <p
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: "#0F172B",
            marginTop: 8,
            margin: 0,
            marginBlockStart: 8,
          }}
        >
          2025
        </p>
      </div>

      {/* Footer contact placeholder */}
      <div
        style={{
          position: "absolute",
          bottom: 16,
          left: 16,
        }}
      >
        <p
          style={{
            fontSize: 7,
            color: "#793CF9",
            margin: 0,
            lineHeight: 1.4,
          }}
        >
          +1-555-REALTY
        </p>
        <p
          style={{
            fontSize: 7,
            color: "#793CF9",
            margin: 0,
            lineHeight: 1.4,
          }}
        >
          www.example.com
        </p>
        <p
          style={{
            fontSize: 7,
            color: "#793CF9",
            margin: 0,
            lineHeight: 1.4,
          }}
        >
          info@example.com
        </p>
      </div>
    </div>
  );
}
