"use client";

import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface AddPropertyFormData {
  address: string;
}

interface AddPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

// Mapbox access token - should be moved to env variable in production
const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";

const AddPropertyModal = ({ isOpen, onClose, onSuccess }: AddPropertyModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AddPropertyFormData>();

  const queryClient = useQueryClient();
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const addressValue = watch("address");

  // Fetch address suggestions from Mapbox
  const fetchSuggestions = async (query: string) => {
    if (!query || query.length < 3 || !MAPBOX_ACCESS_TOKEN) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${MAPBOX_ACCESS_TOKEN}&types=address&limit=5`
      );
      const data = await response.json();
      setSuggestions(data.features || []);
      setShowSuggestions(true);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    }
  };

  // Debounce address input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (addressValue) {
        fetchSuggestions(addressValue);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [addressValue]);

  // Mutation for creating a new property
  const createPropertyMutation = useMutation({
    mutationFn: async (data: AddPropertyFormData) => {
      const response = await fetch("/api/getRentalAppraisalData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address: data.address }),
      });

      if (!response.ok) {
        throw new Error("Failed to create property");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      reset();
      onSuccess();
      onClose();
    },
    onError: (error) => {
      console.error("Error creating property:", error);
      alert("Failed to add property. Please try again.");
    },
  });

  const onSubmit = (data: AddPropertyFormData) => {
    createPropertyMutation.mutate(data);
  };

  const handleSelectSuggestion = (suggestion: any) => {
    setValue("address", suggestion.place_name);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleClose = () => {
    reset();
    setSuggestions([]);
    setShowSuggestions(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="modal-backdrop fade show"
        style={{ zIndex: 1040 }}
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className="modal fade show d-block"
        tabIndex={-1}
        style={{ zIndex: 1050 }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content" style={{ borderRadius: "12px" }}>
            <div className="modal-header border-0 pb-0">
              <h5 className="modal-title fw-bold">Add New Property</h5>
              <button
                type="button"
                className="btn-close"
                onClick={handleClose}
                aria-label="Close"
              />
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="modal-body pt-3">
                <p className="text-muted mb-3">
                  Enter the property address to generate a rental appraisal report.
                </p>

                <div className="position-relative">
                  <label className="form-label fw-medium">Property Address</label>
                  <div className="input-group">
                    <span className="input-group-text bg-white">
                      <i className="flaticon-location text-primary" />
                    </span>
                    <input
                      {...register("address", {
                        required: "Address is required",
                        minLength: {
                          value: 5,
                          message: "Please enter a valid address",
                        },
                      })}
                      ref={(e) => {
                        register("address").ref(e);
                        (inputRef as any).current = e;
                      }}
                      type="text"
                      className={`form-control ${errors.address ? "is-invalid" : ""}`}
                      placeholder="Start typing an address..."
                      autoComplete="off"
                      onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                      onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    />
                  </div>
                  {errors.address && (
                    <div className="invalid-feedback d-block">
                      {errors.address.message}
                    </div>
                  )}

                  {/* Suggestions Dropdown */}
                  {showSuggestions && suggestions.length > 0 && (
                    <div
                      className="position-absolute w-100 bg-white border rounded-3 mt-1 shadow-sm"
                      style={{ zIndex: 1060, maxHeight: "200px", overflowY: "auto" }}
                    >
                      {suggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          className="px-3 py-2 cursor-pointer hover-bg-light"
                          style={{ cursor: "pointer" }}
                          onMouseDown={() => handleSelectSuggestion(suggestion)}
                        >
                          <i className="flaticon-location me-2 text-muted" />
                          <span className="small">{suggestion.place_name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="modal-footer border-0 pt-0">
                <button
                  type="button"
                  className="ud-btn btn-light"
                  onClick={handleClose}
                  disabled={isSubmitting || createPropertyMutation.isPending}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="ud-btn btn-dark"
                  disabled={isSubmitting || createPropertyMutation.isPending}
                >
                  {createPropertyMutation.isPending ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      />
                      Generating...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-plus me-2" />
                      Add New Property
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddPropertyModal;
