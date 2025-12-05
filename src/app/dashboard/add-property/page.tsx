"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { revalidateProperties } from "@/actions/properties";

export default function AddPropertyPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      addressCommonName: formData.get("addressCommonName"),
    };

    try {
      const response = await fetch("/api/properties", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Failed to create property");
      }

      const result = await response.json();

      // Revalidate caches
      await revalidateProperties();

      // Redirect to the new property
      router.push(`/dashboard/my-properties/${result.payload.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="row align-items-center pb40">
        <div className="col-lg-12">
          <div className="dashboard_title_area">
            <h2>Add New Property</h2>
            <p className="text">
              <Link href="/dashboard/my-properties" className="text-decoration-underline">
                ← Back to My Properties
              </Link>
            </p>
          </div>
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-xl-6">
          <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
            <h4 className="title fz17 mb30">Property Address</h4>

            {error && (
              <div className="alert alert-danger mb30">
                <i className="fas fa-exclamation-circle me-2"></i>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb30">
                <label className="form-label fw500 fz16">
                  Enter the full property address
                </label>
                <input
                  type="text"
                  name="addressCommonName"
                  className="form-control form-control-lg"
                  placeholder="e.g., 123 Main Street, Sydney NSW 2000"
                  required
                  autoFocus
                />
                <small className="text-muted mt-2 d-block">
                  Include street number, street name, suburb, state, and postcode
                </small>
              </div>

              <div className="d-flex gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="ud-btn btn-thm flex-grow-1"
                >
                  {isSubmitting ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Creating...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-plus me-2"></i>
                      Add Property
                    </>
                  )}
                </button>
                <Link href="/dashboard/my-properties" className="ud-btn btn-white2">
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
