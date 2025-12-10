"use client";

import { useState, useCallback, useRef, useEffect } from "react";

const MAPBOX_TOKEN = "pk.eyJ1IjoiYmlqaWcwIiwiYSI6ImNtaXRjNjQ2bjFtbXozZ29id2FrN2w5aTgifQ.wQhNlZC8qZq4uxpI3fLauw";

interface MapboxSuggestion {
  id: string;
  name: string;
  full_address: string;
}

export default function HeroAddressSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<MapboxSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);

  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const searchAddress = useCallback(async (query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.mapbox.com/search/geocode/v6/forward?q=${encodeURIComponent(query)}&country=au&types=address&access_token=${MAPBOX_TOKEN}`
      );
      const data = await response.json();

      if (data.features) {
        setSuggestions(
          data.features.map((f: any) => ({
            id: f.id,
            name: f.properties.name,
            full_address: f.properties.full_address,
          }))
        );
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error("Error fetching address suggestions:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setSelectedAddress(null);

    // Debounce the search
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    searchTimeout.current = setTimeout(() => {
      searchAddress(value);
    }, 300);
  };

  const selectSuggestion = (suggestion: MapboxSuggestion) => {
    setSearchQuery(suggestion.full_address);
    setSelectedAddress(suggestion.full_address);
    setShowSuggestions(false);
  };

  const handleGenerateReport = () => {
    // TODO: Implement report generation logic
    console.log("Generate report for:", selectedAddress);
  };

  return (
    <div ref={wrapperRef} className="position-relative">
      <div
        className="d-flex align-items-center"
        style={{
          backgroundColor: "#fff",
          borderRadius: 16,
          padding: 6,
          boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
        }}
      >
        <div className="d-flex align-items-center flex-grow-1 px-3">
          <i
            className="fas fa-map-marker-alt"
            style={{ color: "#eb6753", fontSize: 18, marginRight: 12, flexShrink: 0 }}
          />
          <input
            type="text"
            placeholder="Enter property address..."
            value={searchQuery}
            onChange={handleInputChange}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            autoComplete="off"
            style={{
              border: "none",
              outline: "none",
              fontSize: 15,
              width: "100%",
              padding: "12px 0",
              backgroundColor: "transparent",
            }}
          />
          {isLoading && (
            <span
              className="spinner-border spinner-border-sm"
              style={{ color: "#eb6753", marginRight: 8 }}
              role="status"
            />
          )}
        </div>
        <button
          className="ud-btn btn-thm"
          onClick={handleGenerateReport}
          disabled={!selectedAddress}
          style={{
            padding: "14px 24px",
            borderRadius: 12,
            whiteSpace: "nowrap",
            fontSize: 14,
            opacity: selectedAddress ? 1 : 0.7,
          }}
        >
          Generate Report
          <i className="fal fa-arrow-right-long ms-2" />
        </button>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          className="position-absolute w-100 mt-2 bg-white rounded-3 shadow-lg"
          style={{
            maxHeight: 300,
            overflowY: "auto",
            zIndex: 100,
            border: "1px solid #e0e0e0",
          }}
        >
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.id}
              type="button"
              className="d-flex flex-column w-100 text-start p-3 border-0 bg-transparent"
              onClick={() => selectSuggestion(suggestion)}
              style={{ cursor: "pointer", transition: "background-color 0.15s" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f8f9fa")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              <span className="fw500" style={{ color: "#222" }}>
                {suggestion.name}
              </span>
              <small style={{ color: "#666" }}>{suggestion.full_address}</small>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
