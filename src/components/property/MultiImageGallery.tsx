"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import toast from "react-hot-toast";

export interface PropertyImageData {
  id?: string;
  url: string;
  type: "main" | "gallery" | "floor_plan" | "streetview";
  sortOrder: number;
}

interface MultiImageGalleryProps {
  images: PropertyImageData[];
  onChange: (images: PropertyImageData[]) => void;
  folder?: string;
  disabled?: boolean;
  maxImages?: number;
}

const IMAGE_TYPES: { value: PropertyImageData["type"]; label: string }[] = [
  { value: "main", label: "Main Photo" },
  { value: "gallery", label: "Gallery" },
  { value: "floor_plan", label: "Floor Plan" },
  { value: "streetview", label: "Street View" },
];

export default function MultiImageGallery({
  images,
  onChange,
  folder = "property_images",
  disabled = false,
  maxImages = 10,
}: MultiImageGalleryProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInputValue, setUrlInputValue] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get main image
  const mainImage = images.find((img) => img.type === "main");
  const galleryImages = images.filter((img) => img.type !== "main").sort((a, b) => a.sortOrder - b.sortOrder);

  const handleFileSelect = useCallback(
    async (file: File, imageType: PropertyImageData["type"] = "gallery") => {
      // Validate file type
      const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
      if (!validTypes.includes(file.type)) {
        toast.error("Invalid file type. Use JPEG, PNG, GIF, or WebP");
        return;
      }

      // Validate file size (10MB max)
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error("File too large. Maximum size is 10MB");
        return;
      }

      // Check max images limit
      if (images.length >= maxImages) {
        toast.error(`Maximum ${maxImages} images allowed`);
        return;
      }

      setIsUploading(true);
      setUploadProgress(0);

      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", folder);

        // Simulate progress for better UX
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => Math.min(prev + 10, 90));
        }, 100);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        clearInterval(progressInterval);

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Upload failed");
        }

        const data = await response.json();
        setUploadProgress(100);

        // Determine sort order and type
        const isFirstImage = images.length === 0;
        const newImage: PropertyImageData = {
          url: data.url,
          type: isFirstImage ? "main" : imageType,
          sortOrder: images.length,
        };

        setTimeout(() => {
          onChange([...images, newImage]);
          setIsUploading(false);
          setUploadProgress(0);
          toast.success("Image uploaded");
        }, 300);
      } catch (error) {
        console.error("Upload error:", error);
        toast.error(error instanceof Error ? error.message : "Upload failed");
        setIsUploading(false);
        setUploadProgress(0);
      }
    },
    [folder, images, maxImages, onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (disabled || isUploading) return;

      const files = Array.from(e.dataTransfer.files);
      // Upload files sequentially
      files.forEach((file, index) => {
        setTimeout(() => {
          handleFileSelect(file);
        }, index * 500);
      });
    },
    [disabled, isUploading, handleFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      files.forEach((file, index) => {
        setTimeout(() => {
          handleFileSelect(file);
        }, index * 500);
      });
      e.target.value = "";
    },
    [handleFileSelect]
  );

  const handleUrlSubmit = () => {
    if (!urlInputValue.trim()) return;

    try {
      new URL(urlInputValue.trim());
      const isFirstImage = images.length === 0;
      const newImage: PropertyImageData = {
        url: urlInputValue.trim(),
        type: isFirstImage ? "main" : "gallery",
        sortOrder: images.length,
      };
      onChange([...images, newImage]);
      setUrlInputValue("");
      setShowUrlInput(false);
      toast.success("Image added");
    } catch {
      toast.error("Invalid URL");
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    // If we removed the main image and there are other images, make the first one main
    if (images[index].type === "main" && newImages.length > 0) {
      newImages[0] = { ...newImages[0], type: "main" };
    }
    // Re-assign sort orders
    const reorderedImages = newImages.map((img, i) => ({ ...img, sortOrder: i }));
    onChange(reorderedImages);
    setSelectedImageIndex(null);
    toast.success("Image removed");
  };

  const handleSetAsMain = (index: number) => {
    const newImages = images.map((img, i) => ({
      ...img,
      type: i === index ? ("main" as const) : img.type === "main" ? ("gallery" as const) : img.type,
    }));
    onChange(newImages);
    toast.success("Set as main image");
  };

  const handleChangeType = (index: number, newType: PropertyImageData["type"]) => {
    // If setting as main, demote current main
    if (newType === "main") {
      const newImages = images.map((img, i) => ({
        ...img,
        type: i === index ? "main" : img.type === "main" ? ("gallery" as const) : img.type,
      }));
      onChange(newImages as PropertyImageData[]);
    } else {
      const newImages = [...images];
      newImages[index] = { ...newImages[index], type: newType };
      onChange(newImages);
    }
  };

  const handleMoveImage = (fromIndex: number, direction: "up" | "down") => {
    const toIndex = direction === "up" ? fromIndex - 1 : fromIndex + 1;
    if (toIndex < 0 || toIndex >= images.length) return;

    const newImages = [...images];
    [newImages[fromIndex], newImages[toIndex]] = [newImages[toIndex], newImages[fromIndex]];
    // Re-assign sort orders
    const reorderedImages = newImages.map((img, i) => ({ ...img, sortOrder: i }));
    onChange(reorderedImages);
  };

  return (
    <div>
      {/* Main Image Section */}
      <div className="mb-4">
        <label className="form-label fw600 mb15 d-flex align-items-center gap-2">
          <i className="fas fa-star text-warning" />
          Main Property Photo
        </label>
        <div
          className={`position-relative overflow-hidden ${dragActive ? "border-primary" : ""}`}
          style={{
            borderRadius: 12,
            border: dragActive ? "2px solid #3b82f6" : "2px dashed #e0e0e0",
            backgroundColor: dragActive ? "#f0f7ff" : "#fafafa",
            transition: "all 0.2s ease",
          }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {mainImage ? (
            <div className="position-relative" style={{ minHeight: 250 }}>
              <Image
                src={mainImage.url}
                alt="Main property photo"
                width={800}
                height={400}
                style={{
                  width: "100%",
                  height: "auto",
                  minHeight: 250,
                  maxHeight: 400,
                  objectFit: "cover",
                }}
              />
              <div
                className="position-absolute top-0 start-0 end-0 bottom-0 d-flex align-items-center justify-content-center"
                style={{
                  background: "rgba(0,0,0,0.4)",
                  opacity: 0,
                  transition: "opacity 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "0")}
              >
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-light btn-sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={disabled || isUploading}
                    style={{ borderRadius: 8 }}
                  >
                    <i className="fas fa-plus me-1" />
                    Add More
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => handleRemoveImage(images.indexOf(mainImage))}
                    disabled={disabled || isUploading}
                    style={{ borderRadius: 8 }}
                  >
                    <i className="fas fa-trash me-1" />
                    Remove
                  </button>
                </div>
              </div>
              <span
                className="position-absolute badge bg-warning text-dark"
                style={{ top: 10, left: 10, fontSize: 11 }}
              >
                <i className="fas fa-star me-1" />
                Main
              </span>
            </div>
          ) : isUploading ? (
            <div
              className="d-flex flex-column align-items-center justify-content-center p-5"
              style={{ minHeight: 250 }}
            >
              <div className="spinner-border text-primary mb-3" role="status" style={{ width: 40, height: 40 }}>
                <span className="visually-hidden">Uploading...</span>
              </div>
              <div style={{ width: 200 }}>
                <div className="progress" style={{ height: 6, borderRadius: 3, backgroundColor: "#e0e0e0" }}>
                  <div
                    className="progress-bar"
                    style={{
                      width: `${uploadProgress}%`,
                      backgroundColor: "#3b82f6",
                      transition: "width 0.2s ease",
                      borderRadius: 3,
                    }}
                  />
                </div>
                <p className="text-muted fz13 text-center mt-2 mb-0">Uploading... {uploadProgress}%</p>
              </div>
            </div>
          ) : (
            <div
              className="d-flex flex-column align-items-center justify-content-center p-4"
              style={{ minHeight: 250, cursor: "pointer" }}
              onClick={() => fileInputRef.current?.click()}
            >
              <div
                className="d-flex align-items-center justify-content-center mb-3"
                style={{
                  width: 56,
                  height: 56,
                  backgroundColor: "#e3f2fd",
                  borderRadius: 14,
                }}
              >
                <i className="fas fa-cloud-upload-alt text-primary fz24" />
              </div>
              <p className="fw500 mb-1">{dragActive ? "Drop images here" : "Drop images or click to upload"}</p>
              <p className="text-muted fz13 mb-3">JPEG, PNG, GIF, WebP up to 10MB each</p>

              <div className="d-flex gap-2">
                <button
                  type="button"
                  className="btn btn-dark btn-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  disabled={disabled}
                  style={{ borderRadius: 8, padding: "6px 16px" }}
                >
                  <i className="fas fa-folder-open me-2" />
                  Browse
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowUrlInput(true);
                  }}
                  disabled={disabled}
                  style={{ borderRadius: 8, padding: "6px 16px" }}
                >
                  <i className="fas fa-link me-2" />
                  Use URL
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Gallery Images Section */}
      {images.length > 0 && (
        <div className="mb-4">
          <label className="form-label fw600 mb15 d-flex align-items-center justify-content-between">
            <span>
              <i className="fas fa-images me-2 text-muted" />
              Additional Photos ({images.length - (mainImage ? 1 : 0)})
            </span>
            {images.length < maxImages && (
              <button
                type="button"
                className="btn btn-sm btn-outline-dark"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled || isUploading}
                style={{ borderRadius: 6, fontSize: 12 }}
              >
                <i className="fas fa-plus me-1" />
                Add Image
              </button>
            )}
          </label>

          <div className="row g-3">
            {galleryImages.map((image, idx) => {
              const globalIndex = images.indexOf(image);
              return (
                <div key={image.id || `gallery-${idx}`} className="col-6 col-md-4 col-lg-3">
                  <div
                    className="position-relative overflow-hidden"
                    style={{
                      borderRadius: 8,
                      border: selectedImageIndex === globalIndex ? "2px solid #3b82f6" : "1px solid #e0e0e0",
                      cursor: "pointer",
                    }}
                    onClick={() => setSelectedImageIndex(selectedImageIndex === globalIndex ? null : globalIndex)}
                  >
                    <Image
                      src={image.url}
                      alt={`Property photo ${idx + 1}`}
                      width={200}
                      height={150}
                      style={{
                        width: "100%",
                        height: 120,
                        objectFit: "cover",
                      }}
                    />

                    {/* Type badge */}
                    <span
                      className="position-absolute badge"
                      style={{
                        top: 5,
                        left: 5,
                        fontSize: 10,
                        backgroundColor:
                          image.type === "floor_plan"
                            ? "#9333ea"
                            : image.type === "streetview"
                            ? "#0891b2"
                            : "#6b7280",
                        color: "#fff",
                      }}
                    >
                      {IMAGE_TYPES.find((t) => t.value === image.type)?.label || "Gallery"}
                    </span>

                    {/* Actions overlay */}
                    {selectedImageIndex === globalIndex && (
                      <div
                        className="position-absolute top-0 start-0 end-0 bottom-0 d-flex flex-column align-items-center justify-content-center gap-1 p-2"
                        style={{ background: "rgba(0,0,0,0.7)" }}
                      >
                        <button
                          type="button"
                          className="btn btn-warning btn-sm w-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSetAsMain(globalIndex);
                          }}
                          style={{ fontSize: 11, padding: "4px 8px" }}
                        >
                          <i className="fas fa-star me-1" />
                          Set as Main
                        </button>
                        <select
                          className="form-select form-select-sm"
                          value={image.type}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleChangeType(globalIndex, e.target.value as PropertyImageData["type"]);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          style={{ fontSize: 11 }}
                        >
                          {IMAGE_TYPES.filter((t) => t.value !== "main").map((t) => (
                            <option key={t.value} value={t.value}>
                              {t.label}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm w-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveImage(globalIndex);
                          }}
                          style={{ fontSize: 11, padding: "4px 8px" }}
                        >
                          <i className="fas fa-trash me-1" />
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Add more placeholder */}
            {images.length < maxImages && (
              <div className="col-6 col-md-4 col-lg-3">
                <div
                  className="d-flex flex-column align-items-center justify-content-center"
                  style={{
                    height: 120,
                    borderRadius: 8,
                    border: "2px dashed #e0e0e0",
                    backgroundColor: "#fafafa",
                    cursor: "pointer",
                  }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <i className="fas fa-plus text-muted fz20 mb-1" />
                  <span className="text-muted fz12">Add Photo</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        onChange={handleFileInputChange}
        style={{ display: "none" }}
        disabled={disabled || isUploading}
        multiple
      />

      {/* URL Input Modal */}
      {showUrlInput && (
        <>
          <div className="modal-backdrop fade show" style={{ zIndex: 1050 }} onClick={() => setShowUrlInput(false)} />
          <div
            className="modal fade show d-block"
            tabIndex={-1}
            style={{ zIndex: 1055 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowUrlInput(false);
            }}
          >
            <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: 450 }}>
              <div
                className="modal-content"
                style={{
                  borderRadius: 16,
                  border: "none",
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                }}
              >
                <div className="modal-header border-0 pb-0">
                  <h5 className="modal-title fw600 fz17">
                    <i className="fas fa-link me-2 text-primary" />
                    Enter Image URL
                  </h5>
                  <button type="button" className="btn-close" onClick={() => setShowUrlInput(false)} />
                </div>

                <div className="modal-body">
                  <p className="text-muted fz13 mb-3">
                    Paste a direct link to an image from CoreLogic, Google Street View, or any other source.
                  </p>

                  <input
                    type="url"
                    className="form-control"
                    placeholder="https://example.com/image.jpg"
                    value={urlInputValue}
                    onChange={(e) => setUrlInputValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleUrlSubmit();
                      }
                    }}
                    autoFocus
                    style={{ borderRadius: 8, padding: "10px 14px" }}
                  />
                </div>

                <div className="modal-footer border-0 pt-0" style={{ gap: 8 }}>
                  <button
                    className="btn btn-light"
                    onClick={() => setShowUrlInput(false)}
                    style={{ borderRadius: 8, padding: "8px 20px" }}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-dark"
                    onClick={handleUrlSubmit}
                    disabled={!urlInputValue.trim()}
                    style={{ borderRadius: 8, padding: "8px 20px" }}
                  >
                    Add Image
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Image count info */}
      <p className="text-muted fz12 mb-0">
        <i className="fas fa-info-circle me-1" />
        {images.length} of {maxImages} images uploaded. The first image will be used as the main property photo.
      </p>
    </div>
  );
}
