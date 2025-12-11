"use client";

import { useState, useRef, useEffect } from "react";
import { AddressSchema, parseGooglePlacesAddress, type Address, type AustralianState } from "@/lib/address-schema";
import { ZodError } from "zod";
import { env } from "@/lib/config";

const GOOGLE_MAPS_API_KEY = env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

interface AddressAutocompleteProps {
  onAddressChange: (address: Address | null, addressCommonName: string) => void;
  initialAddress?: Partial<Address>;
}

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
      loadCallbacks.forEach(cb => cb());
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
  pacContainers.forEach(container => container.remove());
}

export default function AddressAutocomplete({ onAddressChange, initialAddress }: AddressAutocompleteProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAddressSelected, setIsAddressSelected] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [searchValue, setSearchValue] = useState("");

  const [address, setAddress] = useState<Partial<Address>>({
    addressLine: initialAddress?.addressLine || "",
    suburb: initialAddress?.suburb || "",
    state: initialAddress?.state || undefined,
    postcode: initialAddress?.postcode || "",
  });

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
    if (isLoading || !inputRef.current || !window.google?.maps?.places || isAddressSelected) {
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
      fields: ["address_components", "formatted_address", "geometry"],
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

      if (!place.address_components) {
        return;
      }

      const parsedAddress = parseGooglePlacesAddress(place);
      const formattedAddress = place.formatted_address || "";

      setAddress(parsedAddress);
      setSearchValue(formattedAddress);
      setIsAddressSelected(true);
      validateAndNotify(parsedAddress, formattedAddress);
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
  }, [isLoading, isAddressSelected]);

  const validateAndNotify = (addr: Partial<Address>, commonName: string) => {
    try {
      const validatedAddress = AddressSchema.parse(addr);
      setValidationErrors({});
      onAddressChange(validatedAddress, commonName);
    } catch (error) {
      if (error instanceof ZodError) {
        const errors: Record<string, string> = {};
        const issues = (error as any).issues || (error as any).errors || [];
        issues.forEach((err: any) => {
          if (err.path?.[0]) {
            errors[err.path[0] as string] = err.message;
          }
        });
        setValidationErrors(errors);
        onAddressChange(null, commonName);
      }
    }
  };

  const handleFieldChange = (field: keyof Address, value: string) => {
    const newAddress = { ...address, [field]: value };
    setAddress(newAddress);

    // Reconstruct common name
    const commonName = [
      newAddress.addressLine,
      newAddress.suburb,
      newAddress.state,
      newAddress.postcode
    ].filter(Boolean).join(", ");

    validateAndNotify(newAddress, commonName);
  };

  const handleReset = () => {
    setIsAddressSelected(false);
    setSearchValue("");
    setAddress({ addressLine: "", suburb: "", state: undefined, postcode: "" });
    onAddressChange(null, "");
    // Clear autocomplete reference so it reinitializes
    if (autocompleteRef.current) {
      google.maps.event.clearInstanceListeners(autocompleteRef.current);
      autocompleteRef.current = null;
    }
    // Clean up any stale pac-container elements
    cleanupPacContainers();
  };

  const australianStates: AustralianState[] = ["ACT", "NSW", "NT", "QLD", "SA", "TAS", "VIC", "WA"];

  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <div className="alert alert-warning">
        <i className="fas fa-exclamation-triangle me-2"></i>
        Google Maps API key is not configured. Please set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY.
      </div>
    );
  }

  return (
    <div ref={wrapperRef} className="address-autocomplete">
      {/* Search Input */}
      {!isAddressSelected && (
        <div className="mb25 position-relative">
          <label className="form-label fw500 fz16">
            Search for address
          </label>
          <div className="position-relative">
            <input
              ref={inputRef}
              type="text"
              className="form-control form-control-lg"
              placeholder={isLoading ? "Loading Google Maps..." : "Start typing an Australian address..."}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              disabled={isLoading}
              autoComplete="off"
            />
            {isLoading && (
              <div className="position-absolute end-0 top-50 translate-middle-y me-3">
                <span className="spinner-border spinner-border-sm text-primary" role="status" />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Address Fields (shown after selection) */}
      {isAddressSelected && (
        <>
          <div className="d-flex justify-content-between align-items-center mb20">
            <span className="text-success">
              <i className="fas fa-check-circle me-2"></i>
              Address selected
            </span>
            <button
              type="button"
              className="btn btn-link p-0 text-decoration-underline"
              onClick={handleReset}
            >
              Change address
            </button>
          </div>

          <div className="row">
            <div className="col-12 mb20">
              <label className="form-label fw500 fz15">Street Address</label>
              <input
                type="text"
                className={`form-control ${validationErrors.addressLine ? "is-invalid" : ""}`}
                value={address.addressLine || ""}
                onChange={(e) => handleFieldChange("addressLine", e.target.value)}
                placeholder="123 Main Street"
              />
              {validationErrors.addressLine && (
                <div className="invalid-feedback">{validationErrors.addressLine}</div>
              )}
            </div>

            <div className="col-md-6 mb20">
              <label className="form-label fw500 fz15">Suburb</label>
              <input
                type="text"
                className={`form-control ${validationErrors.suburb ? "is-invalid" : ""}`}
                value={address.suburb || ""}
                onChange={(e) => handleFieldChange("suburb", e.target.value)}
                placeholder="Sydney"
              />
              {validationErrors.suburb && (
                <div className="invalid-feedback">{validationErrors.suburb}</div>
              )}
            </div>

            <div className="col-md-3 mb20">
              <label className="form-label fw500 fz15">State</label>
              <select
                className={`form-select ${validationErrors.state ? "is-invalid" : ""}`}
                value={address.state || ""}
                onChange={(e) => handleFieldChange("state", e.target.value)}
              >
                <option value="">Select</option>
                {australianStates.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
              {validationErrors.state && (
                <div className="invalid-feedback">{validationErrors.state}</div>
              )}
            </div>

            <div className="col-md-3 mb20">
              <label className="form-label fw500 fz15">Postcode</label>
              <input
                type="text"
                className={`form-control ${validationErrors.postcode ? "is-invalid" : ""}`}
                value={address.postcode || ""}
                onChange={(e) => handleFieldChange("postcode", e.target.value)}
                placeholder="2000"
                maxLength={4}
              />
              {validationErrors.postcode && (
                <div className="invalid-feedback">{validationErrors.postcode}</div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
