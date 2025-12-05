import React, { useState } from "react";

export default function PropertyReportLanding() {
  const [address, setAddress] = useState("");
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 relative overflow-hidden">
      {/* Subtle grid pattern background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Floating decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
      <div
        className="absolute top-40 right-20 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
        style={{ animationDelay: "2s" }}
      />
      <div
        className="absolute bottom-20 left-1/3 w-80 h-80 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-pulse"
        style={{ animationDelay: "4s" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <nav className="flex items-center justify-between mb-16">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <span
              className="text-xl font-semibold text-slate-800 tracking-tight"
              style={{ fontFamily: "system-ui" }}
            >
              PropertyIQ
            </span>
          </div>
          <div className="flex items-center gap-8">
            <a
              href="#"
              className="text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors"
            >
              Features
            </a>
            <a
              href="#"
              className="text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors"
            >
              Pricing
            </a>
            <a
              href="#"
              className="text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors"
            >
              Agents
            </a>
            <button className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 hover:shadow-xl hover:shadow-slate-900/25 hover:-translate-y-0.5">
              Sign In
            </button>
          </div>
        </nav>

        {/* Main Content */}
        <div className="grid grid-cols-12 gap-8 items-start">
          {/* Left Column - Hero Text + Input */}
          <div className="col-span-5 pt-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-blue-100 rounded-full px-4 py-1.5 mb-6 shadow-sm">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-xs font-medium text-slate-600">
                Trusted by 2,400+ agents across Australia
              </span>
            </div>

            <h1
              className="text-5xl font-bold text-slate-900 leading-[1.1] mb-5 tracking-tight"
              style={{ fontFamily: "system-ui" }}
            >
              Generate Property
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Reports Instantly
              </span>
            </h1>

            <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-md">
              Enter any address and get comprehensive rental appraisals, market
              insights, and professional PDFs in seconds.
            </p>

            {/* Address Input */}
            <div className="relative mb-4">
              <div
                className={`bg-white rounded-2xl shadow-xl transition-all duration-300 ${
                  isHovered
                    ? "shadow-2xl shadow-blue-500/15 -translate-y-1"
                    : "shadow-xl shadow-slate-200/50"
                }`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <div className="flex items-center p-2">
                  <div className="flex items-center gap-3 flex-1 px-4">
                    <svg
                      className="w-5 h-5 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Enter property address..."
                      className="flex-1 py-3 text-slate-800 placeholder-slate-400 outline-none text-base"
                      style={{ fontFamily: "system-ui" }}
                    />
                  </div>
                  <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3.5 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40">
                    <span>Generate Report</span>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick stats */}
            <div className="flex items-center gap-6 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-emerald-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>CoreLogic Data</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-emerald-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Planning & Zoning</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-emerald-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>PDF Export</span>
              </div>
            </div>
          </div>

          {/* Center - Workflow Arrow */}
          <div className="col-span-2 flex flex-col items-center justify-center pt-32">
            <svg
              width="120"
              height="200"
              viewBox="0 0 120 200"
              fill="none"
              className="text-slate-400"
            >
              {/* Curved arrow path */}
              <path
                d="M30 10 C30 60, 90 60, 90 110 C90 160, 90 180, 90 180"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="6 4"
                fill="none"
                className="animate-pulse"
              />
              {/* Arrow head */}
              <path
                d="M82 172 L90 185 L98 172"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              {/* Label */}
              <text
                x="20"
                y="100"
                fill="currentColor"
                fontSize="11"
                fontFamily="system-ui"
                fontWeight="500"
              >
                Instant
              </text>
              <text
                x="15"
                y="115"
                fill="currentColor"
                fontSize="11"
                fontFamily="system-ui"
                fontWeight="500"
              >
                Results
              </text>
            </svg>
          </div>

          {/* Right Column - Output Preview */}
          <div className="col-span-5 relative">
            {/* Illustrated Report Cards */}
            <div className="relative">
              {/* Main PDF Preview */}
              <div
                className="bg-white rounded-2xl shadow-2xl shadow-slate-200/50 p-6 border border-slate-100 transform rotate-2 hover:rotate-0 transition-transform duration-500"
                style={{ marginTop: "20px" }}
              >
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-100">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-rose-600 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">
                      Property Appraisal Report
                    </p>
                    <p className="text-xs text-slate-500">
                      PDF • Ready to download
                    </p>
                  </div>
                  <button className="ml-auto bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors">
                    Download
                  </button>
                </div>

                {/* Mini report preview */}
                <div className="space-y-3">
                  <div className="h-3 bg-slate-200 rounded w-3/4" />
                  <div className="h-3 bg-slate-100 rounded w-full" />
                  <div className="h-3 bg-slate-100 rounded w-5/6" />
                  <div className="flex gap-3 mt-4">
                    <div className="flex-1 h-16 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-100" />
                    <div className="flex-1 h-16 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg border border-emerald-100" />
                  </div>
                </div>
              </div>

              {/* Dashboard Metrics Card */}
              <div className="absolute -bottom-16 -left-8 bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-5 border border-slate-100 w-72 transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                  Dashboard Metrics
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-3 border border-blue-100">
                    <p className="text-xs text-blue-600 font-medium">
                      Rental Estimate
                    </p>
                    <p className="text-lg font-bold text-slate-800">$620/wk</p>
                  </div>
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-3 border border-emerald-100">
                    <p className="text-xs text-emerald-600 font-medium">
                      Market Trend
                    </p>
                    <p className="text-lg font-bold text-slate-800">+4.2%</p>
                  </div>
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-3 border border-amber-100">
                    <p className="text-xs text-amber-600 font-medium">
                      Days on Market
                    </p>
                    <p className="text-lg font-bold text-slate-800">23</p>
                  </div>
                  <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl p-3 border border-violet-100">
                    <p className="text-xs text-violet-600 font-medium">Yield</p>
                    <p className="text-lg font-bold text-slate-800">4.8%</p>
                  </div>
                </div>
              </div>

              {/* Small decorative element */}
              <div className="absolute -top-4 right-8 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-full px-3 py-1 text-xs font-medium shadow-lg shadow-indigo-500/30 flex items-center gap-1">
                <svg
                  className="w-3 h-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Instant</span>
              </div>

              {/* Circular badge similar to original */}
              <div className="absolute -top-8 -right-4 w-24 h-24">
                <svg
                  viewBox="0 0 100 100"
                  className="w-full h-full text-slate-700"
                >
                  <defs>
                    <path
                      id="circlePath"
                      d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                    />
                  </defs>
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    opacity="0.3"
                  />
                  <text
                    fontSize="9"
                    fontWeight="500"
                    fill="currentColor"
                    letterSpacing="3"
                  >
                    <textPath href="#circlePath" startOffset="0%">
                      • PROPERTY • REPORTS • AGENTS •
                    </textPath>
                  </text>
                  <g transform="translate(50,50)">
                    <svg
                      x="-12"
                      y="-12"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        d="M9 12l2 2 4-4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Features Strip */}
        <div className="mt-32 pt-8 border-t border-slate-200/50">
          <div className="flex items-center justify-center gap-12">
            <div className="flex items-center gap-3 text-slate-500">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <span className="text-sm font-medium">Market Analytics</span>
            </div>
            <div className="flex items-center gap-3 text-slate-500">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100">
                <svg
                  className="w-5 h-5 text-emerald-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                  />
                </svg>
              </div>
              <span className="text-sm font-medium">Planning & Zoning</span>
            </div>
            <div className="flex items-center gap-3 text-slate-500">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100">
                <svg
                  className="w-5 h-5 text-violet-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <span className="text-sm font-medium">Demographics</span>
            </div>
            <div className="flex items-center gap-3 text-slate-500">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100">
                <svg
                  className="w-5 h-5 text-rose-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <span className="text-sm font-medium">Risk Assessment</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
