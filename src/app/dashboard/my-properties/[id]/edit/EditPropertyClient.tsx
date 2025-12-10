"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import EditPropertyForm from "@/components/property/EditPropertyForm";

interface PropertyData {
  bedroomCount: number | null;
  bathroomCount: number | null;
  propertyType: string | null;
  landAreaSqm: string | null;
  mainImageUrl: string | null;
}

interface EditPropertyClientProps {
  propertyId: string;
  addressCommonName: string;
  initialData: PropertyData;
}

export default function EditPropertyClient({
  propertyId,
  addressCommonName,
  initialData,
}: EditPropertyClientProps) {
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [triggerSave, setTriggerSave] = useState(false);

  const handleSaveStateChange = useCallback(
    (changes: boolean, saving: boolean) => {
      setHasChanges(changes);
      setIsSaving(saving);
    },
    []
  );

  const handleSaveClick = () => {
    setTriggerSave(true);
  };

  const handleSaveComplete = () => {
    setTriggerSave(false);
  };

  return (
    <>
      <div className="row align-items-center pb40">
        <div className="col-lg-8">
          <div className="dashboard_title_area">
            <h2>Edit Property</h2>
            <p className="text">
              <Link
                href={`/dashboard/my-properties/${propertyId}`}
                className="text-decoration-underline"
              >
                ← Back to Property Details
              </Link>
            </p>
            <p className="text-muted fz14 mt-2 mb-0">{addressCommonName}</p>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="d-flex gap-2 justify-content-lg-end">
            <button
              className="ud-btn"
              onClick={handleSaveClick}
              disabled={!hasChanges || isSaving}
              style={{
                backgroundColor: hasChanges && !isSaving ? "#eb6753" : "#e0e0e0",
                color: hasChanges && !isSaving ? "#fff" : "#999",
                cursor: hasChanges && !isSaving ? "pointer" : "not-allowed",
                transition: "all 0.3s ease",
                border: "none",
              }}
            >
              {isSaving ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  />
                  Saving...
                </>
              ) : (
                <>
                  <i className="fas fa-save me-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-xl-12">
          <EditPropertyForm
            propertyId={propertyId}
            initialData={initialData}
            onSaveStateChange={handleSaveStateChange}
            triggerSave={triggerSave}
            onSaveComplete={handleSaveComplete}
          />
        </div>
      </div>
    </>
  );
}
