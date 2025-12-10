"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import AddressAutocomplete from "@/components/property/AddressAutocomplete";
import { usePropertyJobs } from "@/context/PropertyJobsContext";
import type { Address } from "@/lib/address-schema";

export default function AddPropertyPage() {
  const router = useRouter();
  const { addJob, showToast } = usePropertyJobs();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validatedAddress, setValidatedAddress] = useState<Address | null>(null);
  const [addressCommonName, setAddressCommonName] = useState("");

  const handleAddressChange = (address: Address | null, commonName: string) => {
    setValidatedAddress(address);
    setAddressCommonName(commonName);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validatedAddress) {
      setError("Please select and validate an address");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Call our same-origin proxy endpoint which forwards to the dedicated server
      const response = await fetch("/api/properties/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          addressLine: validatedAddress.addressLine,
          suburb: validatedAddress.suburb,
          state: validatedAddress.state,
          postcode: validatedAddress.postcode,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || `Server error: ${response.status}`);
      }

      const result = await response.json();

      if (!result.jobId) {
        throw new Error("Invalid response from server - missing jobId");
      }

      // Add job to pending jobs for polling
      addJob({
        jobId: result.jobId,
        statusUrl: result.statusUrl || `/api/properties/jobs/${result.jobId}`,
        addressCommonName,
      });

      showToast("info", `Creating property "${addressCommonName}"...`);

      // Redirect to My Properties page where the job will be polled
      router.push("/dashboard/my-properties");
    } catch (err) {
      console.error("Error creating property:", err);
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
        <div className="col-xl-8">
          <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
            <h4 className="title fz17 mb30">Property Address</h4>

            {error && (
              <div className="alert alert-danger mb30">
                <i className="fas fa-exclamation-circle me-2"></i>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <AddressAutocomplete onAddressChange={handleAddressChange} />

              <div className="d-flex gap-3 mt30">
                <button
                  type="submit"
                  disabled={isSubmitting || !validatedAddress}
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
