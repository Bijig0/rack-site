"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import toast from "react-hot-toast";

interface ImagePickerProps {
  value: string | null;
  onChange: (url: string | null) => void;
  folder?: string;
  disabled?: boolean;
}

export default function ImagePicker({
  value,
  onChange,
  folder = "properties",
  disabled = false,
}: ImagePickerProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInputValue, setUrlInputValue] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(
    async (file: File) => {
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

        // Small delay to show 100%
        setTimeout(() => {
          onChange(data.url);
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
    [folder, onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (disabled || isUploading) return;

      const file = e.dataTransfer.files?.[0];
      if (file) {
        handleFileSelect(file);
      }
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
      const file = e.target.files?.[0];
      if (file) {
        handleFileSelect(file);
      }
      // Reset input so same file can be selected again
      e.target.value = "";
    },
    [handleFileSelect]
  );

  const handleUrlSubmit = () => {
    if (!urlInputValue.trim()) return;

    // Basic URL validation
    try {
      new URL(urlInputValue.trim());
      onChange(urlInputValue.trim());
      setUrlInputValue("");
      setShowUrlInput(false);
      toast.success("Image URL set");
    } catch {
      toast.error("Invalid URL");
    }
  };

  const handleRemove = () => {
    onChange(null);
    toast.success("Image removed");
  };

  return (
    <div>
      {/* Image Preview / Upload Area */}
      <div
        className={`position-relative overflow-hidden ${
          dragActive ? "border-primary" : ""
        }`}
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
        {value ? (
          // Image Preview
          <div className="position-relative" style={{ minHeight: 200 }}>
            <Image
              src={value}
              alt="Property"
              width={400}
              height={250}
              style={{
                width: "100%",
                height: "auto",
                minHeight: 200,
                maxHeight: 300,
                objectFit: "cover",
              }}
            />

            {/* Overlay controls */}
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
                  <i className="fas fa-upload me-1" />
                  Replace
                </button>
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={handleRemove}
                  disabled={disabled || isUploading}
                  style={{ borderRadius: 8 }}
                >
                  <i className="fas fa-trash me-1" />
                  Remove
                </button>
              </div>
            </div>
          </div>
        ) : isUploading ? (
          // Upload Progress
          <div
            className="d-flex flex-column align-items-center justify-content-center p-5"
            style={{ minHeight: 200 }}
          >
            <div
              className="spinner-border text-primary mb-3"
              role="status"
              style={{ width: 40, height: 40 }}
            >
              <span className="visually-hidden">Uploading...</span>
            </div>
            <div style={{ width: 200 }}>
              <div
                className="progress"
                style={{ height: 6, borderRadius: 3, backgroundColor: "#e0e0e0" }}
              >
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
              <p className="text-muted fz13 text-center mt-2 mb-0">
                Uploading... {uploadProgress}%
              </p>
            </div>
          </div>
        ) : (
          // Upload Prompt
          <div
            className="d-flex flex-column align-items-center justify-content-center p-4"
            style={{ minHeight: 200, cursor: "pointer" }}
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
            <p className="fw500 mb-1">
              {dragActive ? "Drop image here" : "Drop image or click to upload"}
            </p>
            <p className="text-muted fz13 mb-3">JPEG, PNG, GIF, WebP up to 10MB</p>

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

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        onChange={handleFileInputChange}
        style={{ display: "none" }}
        disabled={disabled || isUploading}
      />

      {/* URL Input Modal */}
      {showUrlInput && (
        <>
          <div
            className="modal-backdrop fade show"
            style={{ zIndex: 1050 }}
            onClick={() => setShowUrlInput(false)}
          />
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
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowUrlInput(false)}
                  />
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
                    Use Image
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Current URL display when image is set */}
      {value && (
        <div className="mt-2">
          <small className="text-muted d-flex align-items-center gap-2">
            <i className="fas fa-link fz10" />
            <span
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: 300,
              }}
            >
              {value}
            </span>
          </small>
        </div>
      )}
    </div>
  );
}
