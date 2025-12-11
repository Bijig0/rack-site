"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { env } from "@/lib/config";

const GOOGLE_MAPS_API_KEY = env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

// Track if Google Maps script is loaded globally
let googleMapsLoaded = false;
let googleMapsLoading = false;
const loadCallbacks: Array<() => void> = [];

function loadGoogleMapsScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (googleMapsLoaded || window.google?.maps?.places) {
      googleMapsLoaded = true;
      resolve();
      return;
    }

    if (googleMapsLoading) {
      loadCallbacks.push(() => resolve());
      return;
    }

    googleMapsLoading = true;

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      googleMapsLoaded = true;
      googleMapsLoading = false;
      loadCallbacks.forEach((cb) => cb());
      loadCallbacks.length = 0;
      resolve();
    };

    script.onerror = () => {
      googleMapsLoading = false;
      reject(new Error("Failed to load Google Maps script"));
    };

    document.head.appendChild(script);
  });
}

// Clean up pac-container elements created by Google Maps
function cleanupPacContainers() {
  const pacContainers = document.querySelectorAll(".pac-container");
  pacContainers.forEach((container) => container.remove());
}

export default function HeroAddressSearch() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const isMountedRef = useRef(true);

  // Load Google Maps script
  useEffect(() => {
    isMountedRef.current = true;

    if (!GOOGLE_MAPS_API_KEY) {
      console.error("Google Maps API key is not configured");
      setIsLoading(false);
      return;
    }

    loadGoogleMapsScript()
      .then(() => {
        if (isMountedRef.current) {
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error(err);
        if (isMountedRef.current) {
          setIsLoading(false);
        }
      });

    return () => {
      isMountedRef.current = false;
      // Clean up autocomplete on unmount
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
        autocompleteRef.current = null;
      }
      // Clean up pac-container elements
      cleanupPacContainers();
    };
  }, []);

  // Initialize autocomplete when Google Maps is loaded and input is ready
  useEffect(() => {
    if (isLoading || !inputRef.current || !window.google?.maps?.places) {
      return;
    }

    // Prevent re-initialization
    if (autocompleteRef.current) {
      return;
    }

    const input = inputRef.current;
    const autocomplete = new window.google.maps.places.Autocomplete(input, {
      componentRestrictions: { country: "au" },
      types: ["address"],
      fields: ["formatted_address", "address_components", "geometry"],
    });

    // Prevent form submission when pressing Enter on autocomplete selection
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        const pacContainer = document.querySelector(".pac-container");
        if (pacContainer && pacContainer.querySelector(".pac-item-selected")) {
          e.preventDefault();
        }
      }
    };
    input.addEventListener("keydown", handleKeyDown);

    autocomplete.addListener("place_changed", () => {
      if (!isMountedRef.current) return;

      const place = autocomplete.getPlace();

      if (!place.formatted_address) {
        return;
      }

      setSearchQuery(place.formatted_address);
      setSelectedAddress(place.formatted_address);
    });

    autocompleteRef.current = autocomplete;

    return () => {
      // Remove keydown listener
      input.removeEventListener("keydown", handleKeyDown);
      // Clean up autocomplete listeners
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
        autocompleteRef.current = null;
      }
    };
  }, [isLoading]);

  const handleGenerateReport = () => {
    if (selectedAddress) {
      // Navigate to the add property page with the address pre-filled
      const encodedAddress = encodeURIComponent(selectedAddress);
      router.push(`/dashboard/add-property?address=${encodedAddress}`);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    // Clear selection if user types
    if (selectedAddress && e.target.value !== selectedAddress) {
      setSelectedAddress(null);
    }
  };

  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <div
        className="d-flex align-items-center justify-content-center"
        style={{
          backgroundColor: "#fff",
          borderRadius: 16,
          padding: "20px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
        }}
      >
        <span className="text-muted">Address search is not available</span>
      </div>
    );
  }

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
            ref={inputRef}
            type="text"
            placeholder={isLoading ? "Loading..." : "Enter property address..."}
            value={searchQuery}
            onChange={handleInputChange}
            disabled={isLoading}
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
    </div>
  );
}
