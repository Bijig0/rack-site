"use client";

import { useState, useTransition, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { updateProperty, type UpdatePropertyInput } from "@/actions/properties";
import MultiImageGallery, { type PropertyImageData } from "./MultiImageGallery";

interface PropertyData {
  bedroomCount: number | null;
  bathroomCount: number | null;
  propertyType: string | null;
  landAreaSqm: string | null;
  images: PropertyImageData[];
}

interface EditPropertyFormProps {
  propertyId: string;
  initialData: PropertyData;
  onSaveStateChange: (hasChanges: boolean, isSaving: boolean) => void;
  triggerSave: boolean;
  onSaveComplete: () => void;
}

const PROPERTY_TYPES = [
  "House",
  "Apartment",
  "Townhouse",
  "Unit",
  "Villa",
  "Land",
  "Rural",
  "Other",
];

export default function EditPropertyForm({
  propertyId,
  initialData,
  onSaveStateChange,
  triggerSave,
  onSaveComplete,
}: EditPropertyFormProps) {
  const [isPending, startTransition] = useTransition();

  // Form state
  const [bedroomCount, setBedroomCount] = useState<string>(
    initialData.bedroomCount?.toString() ?? ""
  );
  const [bathroomCount, setBathroomCount] = useState<string>(
    initialData.bathroomCount?.toString() ?? ""
  );
  const [propertyType, setPropertyType] = useState<string>(
    initialData.propertyType ?? ""
  );
  const [landAreaSqm, setLandAreaSqm] = useState<string>(
    initialData.landAreaSqm ?? ""
  );
  const [images, setImages] = useState<PropertyImageData[]>(
    initialData.images || []
  );

  // Track if form has changes
  const hasChanges = useCallback(() => {
    const bedroomChanged =
      bedroomCount !== (initialData.bedroomCount?.toString() ?? "");
    const bathroomChanged =
      bathroomCount !== (initialData.bathroomCount?.toString() ?? "");
    const typeChanged = propertyType !== (initialData.propertyType ?? "");
    const areaChanged = landAreaSqm !== (initialData.landAreaSqm ?? "");

    // Check if images have changed
    const initialImages = initialData.images || [];
    const imagesChanged =
      images.length !== initialImages.length ||
      images.some((img, i) =>
        img.url !== initialImages[i]?.url ||
        img.type !== initialImages[i]?.type ||
        img.sortOrder !== initialImages[i]?.sortOrder
      );

    return (
      bedroomChanged ||
      bathroomChanged ||
      typeChanged ||
      areaChanged ||
      imagesChanged
    );
  }, [
    bedroomCount,
    bathroomCount,
    propertyType,
    landAreaSqm,
    images,
    initialData,
  ]);

  // Notify parent of save state
  useEffect(() => {
    onSaveStateChange(hasChanges(), isPending);
  }, [hasChanges, isPending, onSaveStateChange]);

  // Handle save trigger from parent
  useEffect(() => {
    if (triggerSave && hasChanges() && !isPending) {
      handleSubmit();
    }
  }, [triggerSave]);

  const handleSubmit = () => {
    startTransition(async () => {
      const input: UpdatePropertyInput = {
        bedroomCount: bedroomCount ? parseInt(bedroomCount, 10) : null,
        bathroomCount: bathroomCount ? parseInt(bathroomCount, 10) : null,
        propertyType: propertyType || null,
        landAreaSqm: landAreaSqm || null,
        images: images,
      };

      const result = await updateProperty(propertyId, input);

      if (result.success) {
        toast.success("Property updated");
      } else {
        toast.error(result.error || "Failed to update property");
      }

      onSaveComplete();
    });
  };

  return (
    <div className="ps-widget bgc-white bdrs12 p30 overflow-hidden position-relative">
      <h4 className="title fz17 mb30">Property Details</h4>

      <div className="row">
        {/* Property Images */}
        <div className="col-12 mb30">
          <MultiImageGallery
            images={images}
            onChange={setImages}
            folder="property_images"
            disabled={isPending}
            maxImages={10}
          />
        </div>

        {/* Property Type */}
        <div className="col-sm-6 col-lg-4 mb30">
          <label className="form-label fw600">Property Type</label>
          <select
            className="form-select form-control"
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            disabled={isPending}
            style={{ borderRadius: 8 }}
          >
            <option value="">Select type</option>
            {PROPERTY_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Bedrooms */}
        <div className="col-sm-6 col-lg-4 mb30">
          <label className="form-label fw600">Bedrooms</label>
          <div className="input-group">
            <span className="input-group-text" style={{ borderRadius: "8px 0 0 8px" }}>
              <i className="flaticon-bed" />
            </span>
            <input
              type="number"
              className="form-control"
              placeholder="Number of bedrooms"
              min="0"
              max="20"
              value={bedroomCount}
              onChange={(e) => setBedroomCount(e.target.value)}
              disabled={isPending}
              style={{ borderRadius: "0 8px 8px 0" }}
            />
          </div>
        </div>

        {/* Bathrooms */}
        <div className="col-sm-6 col-lg-4 mb30">
          <label className="form-label fw600">Bathrooms</label>
          <div className="input-group">
            <span className="input-group-text" style={{ borderRadius: "8px 0 0 8px" }}>
              <i className="flaticon-shower" />
            </span>
            <input
              type="number"
              className="form-control"
              placeholder="Number of bathrooms"
              min="0"
              max="20"
              value={bathroomCount}
              onChange={(e) => setBathroomCount(e.target.value)}
              disabled={isPending}
              style={{ borderRadius: "0 8px 8px 0" }}
            />
          </div>
        </div>

        {/* Land Area */}
        <div className="col-sm-6 col-lg-4 mb30">
          <label className="form-label fw600">Land Area</label>
          <div className="input-group">
            <span className="input-group-text" style={{ borderRadius: "8px 0 0 8px" }}>
              <i className="flaticon-expand" />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="e.g., 450"
              value={landAreaSqm}
              onChange={(e) => setLandAreaSqm(e.target.value)}
              disabled={isPending}
            />
            <span className="input-group-text" style={{ borderRadius: "0 8px 8px 0" }}>sqm</span>
          </div>
        </div>
      </div>
    </div>
  );
}
