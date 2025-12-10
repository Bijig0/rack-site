"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import {
  addPropertyTag,
  removePropertyTag,
  type TagData,
} from "@/actions/tags";

// Predefined tag colors for visual variety
const TAG_COLORS = [
  { bg: "#e3f2fd", text: "#1565c0" }, // Blue
  { bg: "#f3e5f5", text: "#7b1fa2" }, // Purple
  { bg: "#e8f5e9", text: "#2e7d32" }, // Green
  { bg: "#fff8e1", text: "#f57c00" }, // Orange
  { bg: "#fce4ec", text: "#c2185b" }, // Pink
  { bg: "#e0f7fa", text: "#00838f" }, // Cyan
  { bg: "#fff3e0", text: "#e65100" }, // Deep Orange
  { bg: "#f1f8e9", text: "#558b2f" }, // Light Green
];

function getTagColor(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = value.charCodeAt(i) + ((hash << 5) - hash);
  }
  return TAG_COLORS[Math.abs(hash) % TAG_COLORS.length];
}

interface PropertyTagsProps {
  propertyId: string;
  initialTags?: TagData[];
}

export default function PropertyTags({
  propertyId,
  initialTags = [],
}: PropertyTagsProps) {
  const [tags, setTags] = useState<TagData[]>(initialTags);
  const [, startTransition] = useTransition();
  const [showModal, setShowModal] = useState(false);
  const [newTagValue, setNewTagValue] = useState("");
  const [modalError, setModalError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when modal opens
  useEffect(() => {
    if (showModal && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [showModal]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showModal) {
        handleCloseModal();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [showModal]);

  const handleCloseModal = () => {
    setShowModal(false);
    setNewTagValue("");
    setModalError(null);
  };

  // Optimistic add tag
  const handleAddTag = () => {
    if (!newTagValue.trim()) return;

    const trimmedValue = newTagValue.trim();

    // Check for duplicates client-side
    if (tags.some((t) => t.value.toLowerCase() === trimmedValue.toLowerCase())) {
      setModalError("Tag already exists");
      return;
    }

    const tempId = `temp-${Date.now()}`;
    const optimisticTag: TagData = {
      id: tempId,
      propertyId,
      value: trimmedValue,
      createdAt: new Date(),
    };

    // Optimistically add
    setTags((prev) => [...prev, optimisticTag]);
    handleCloseModal();

    startTransition(async () => {
      const result = await addPropertyTag(propertyId, trimmedValue);
      if (result.success && result.tagId) {
        // Replace temp with real ID
        setTags((prev) =>
          prev.map((t) => (t.id === tempId ? { ...t, id: result.tagId! } : t))
        );
        toast.success("Tag added");
      } else {
        // Rollback
        setTags((prev) => prev.filter((t) => t.id !== tempId));
        toast.error(result.error || "Failed to add tag");
      }
    });
  };

  // Optimistic remove tag
  const handleRemoveTag = (tagId: string) => {
    const deletedTag = tags.find((t) => t.id === tagId);

    // Optimistic delete
    setTags((prev) => prev.filter((t) => t.id !== tagId));

    startTransition(async () => {
      const result = await removePropertyTag(tagId);
      if (result.success) {
        toast.success("Tag removed");
      } else {
        // Rollback
        if (deletedTag) {
          setTags((prev) => [...prev, deletedTag]);
        }
        toast.error("Failed to remove tag");
      }
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  // Preview color for new tag
  const previewColor = newTagValue.trim() ? getTagColor(newTagValue.trim()) : null;

  return (
    <>
      <div className="d-flex flex-wrap align-items-center gap-2">
        {tags.map((tag) => {
          const color = getTagColor(tag.value);
          return (
            <span
              key={tag.id}
              className="d-inline-flex align-items-center rounded-pill"
              style={{
                backgroundColor: color.bg,
                color: color.text,
                padding: "4px 12px",
                fontSize: 13,
                fontWeight: 500,
                transition: "all 0.2s ease",
              }}
            >
              {tag.value}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag.id)}
                style={{
                  background: "none",
                  border: "none",
                  padding: "0 0 0 8px",
                  color: color.text,
                  opacity: 0.6,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.6")}
                aria-label="Remove tag"
              >
                <i className="fas fa-times" style={{ fontSize: 10 }} />
              </button>
            </span>
          );
        })}

        <button
          onClick={() => setShowModal(true)}
          style={{
            border: "1.5px dashed #ccc",
            background: "transparent",
            borderRadius: 20,
            padding: "4px 14px",
            fontSize: 13,
            color: "#666",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
            transition: "all 0.2s ease",
          }}
        >
          <i className="fas fa-plus" style={{ fontSize: 10 }} />
          Add Tag
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <>
          <div
            className="modal-backdrop fade show"
            style={{ zIndex: 1050 }}
            onClick={handleCloseModal}
          />
          <div
            className="modal fade show d-block"
            tabIndex={-1}
            style={{ zIndex: 1055 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) handleCloseModal();
            }}
          >
            <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: 420 }}>
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
                    <i className="fas fa-tag me-2 text-primary" />
                    Add Tag
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={handleCloseModal}
                  />
                </div>

                <div className="modal-body">
                  <p className="text-muted fz13 mb-3">
                    Add tags to categorize this property (e.g., "High Risk", "Investment", "Renovated")
                  </p>

                  <div className="mb-3">
                    <input
                      ref={inputRef}
                      type="text"
                      className={`form-control ${modalError ? "is-invalid" : ""}`}
                      placeholder="Enter tag name..."
                      value={newTagValue}
                      onChange={(e) => {
                        setNewTagValue(e.target.value);
                        setModalError(null);
                      }}
                      onKeyDown={handleKeyDown}
                      style={{ borderRadius: 8, padding: "10px 14px" }}
                    />
                    {modalError && (
                      <div className="invalid-feedback">{modalError}</div>
                    )}
                  </div>

                  {/* Preview */}
                  {previewColor && (
                    <div className="mb-3">
                      <span className="fz12 text-muted d-block mb-2">Preview:</span>
                      <span
                        className="d-inline-flex align-items-center rounded-pill"
                        style={{
                          backgroundColor: previewColor.bg,
                          color: previewColor.text,
                          padding: "6px 14px",
                          fontSize: 13,
                          fontWeight: 500,
                        }}
                      >
                        {newTagValue.trim()}
                      </span>
                    </div>
                  )}

                  {/* Existing tags */}
                  {tags.length > 0 && (
                    <div className="pt-3 border-top">
                      <span className="fz12 text-muted">Existing: </span>
                      {tags.map((tag, i) => (
                        <span key={tag.id} className="fz12 text-muted">
                          {tag.value}{i < tags.length - 1 ? ", " : ""}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="modal-footer border-0 pt-0" style={{ gap: 8 }}>
                  <button
                    className="btn btn-light"
                    onClick={handleCloseModal}
                    style={{ borderRadius: 8, padding: "8px 20px" }}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-dark"
                    onClick={handleAddTag}
                    disabled={!newTagValue.trim()}
                    style={{ borderRadius: 8, padding: "8px 20px" }}
                  >
                    Add Tag
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
