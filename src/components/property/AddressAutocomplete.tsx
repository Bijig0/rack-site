"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { AddressSchema, AustralianStateSchema, parseMapboxAddress, type Address, type AustralianState } from "@/lib/address-schema";
import { ZodError } from "zod";

const MAPBOX_TOKEN = "pk.eyJ1IjoiYmlqaWcwIiwiYSI6ImNtaXRjNjQ2bjFtbXozZ29id2FrN2w5aTgifQ.wQhNlZC8qZq4uxpI3fLauw";

interface AddressAutocompleteProps {
  onAddressChange: (address: Address | null, addressCommonName: string) => void;
  initialAddress?: Partial<Address>;
}

interface MapboxSuggestion {
  id: string;
  name: string;
  full_address: string;
  mapbox_id: string;
}

interface MapboxFeature {
  properties: {
    name: string;
    address?: string;
    full_address?: string;
    context?: {
      locality?: { name: string };
      place?: { name: string };
      region?: { name: string; region_code?: string };
      postcode?: { name: string };
      country?: { name: string };
    };
  };
}

export default function AddressAutocomplete({ onAddressChange, initialAddress }: AddressAutocompleteProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<MapboxSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isAddressSelected, setIsAddressSelected] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const [address, setAddress] = useState<Partial<Address>>({
    addressLine: initialAddress?.addressLine || "",
    suburb: initialAddress?.suburb || "",
    state: initialAddress?.state || undefined,
    postcode: initialAddress?.postcode || "",
  });

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
            mapbox_id: f.id,
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
    setIsAddressSelected(false);
    setValidationErrors({});

    // Debounce the search
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    searchTimeout.current = setTimeout(() => {
      searchAddress(value);
    }, 300);
  };

  const selectSuggestion = async (suggestion: MapboxSuggestion) => {
    setSearchQuery(suggestion.full_address);
    setShowSuggestions(false);

    // Fetch full details for the selected address
    try {
      const response = await fetch(
        `https://api.mapbox.com/search/geocode/v6/forward?q=${encodeURIComponent(suggestion.full_address)}&country=au&types=address&limit=1&access_token=${MAPBOX_TOKEN}`
      );
      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const feature = data.features[0];
        const parsedAddress = parseMapboxAddress(feature);

        setAddress(parsedAddress);
        setIsAddressSelected(true);
        validateAndNotify(parsedAddress, suggestion.full_address);
      }
    } catch (error) {
      console.error("Error fetching address details:", error);
    }
  };

  const validateAndNotify = (addr: Partial<Address>, commonName: string) => {
    try {
      const validatedAddress = AddressSchema.parse(addr);
      setValidationErrors({});
      onAddressChange(validatedAddress, commonName);
    } catch (error) {
      if (error instanceof ZodError) {
        const errors: Record<string, string> = {};
        // Zod 4 uses .issues instead of .errors
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

  const australianStates: AustralianState[] = ["ACT", "NSW", "NT", "QLD", "SA", "TAS", "VIC", "WA"];

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
              type="text"
              className="form-control form-control-lg"
              placeholder="Start typing an Australian address..."
              value={searchQuery}
              onChange={handleInputChange}
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
              autoComplete="off"
            />
            {isLoading && (
              <div className="position-absolute end-0 top-50 translate-middle-y me-3">
                <span className="spinner-border spinner-border-sm text-primary" role="status" />
              </div>
            )}
          </div>

          {/* Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="position-absolute w-100 mt-1 bg-white border rounded shadow-sm z-3" style={{ maxHeight: "300px", overflowY: "auto" }}>
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion.id}
                  type="button"
                  className="d-block w-100 text-start p-3 border-0 bg-transparent hover-bg-light"
                  onClick={() => selectSuggestion(suggestion)}
                  style={{ cursor: "pointer" }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f8f9fa")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  <div className="fw500">{suggestion.name}</div>
                  <small className="text-muted">{suggestion.full_address}</small>
                </button>
              ))}
            </div>
          )}
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
              onClick={() => {
                setIsAddressSelected(false);
                setSearchQuery("");
                setAddress({ addressLine: "", suburb: "", state: undefined, postcode: "" });
                onAddressChange(null, "");
              }}
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
