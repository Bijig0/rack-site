"use client";

import { useEffect, useRef } from "react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  variant?: "danger" | "warning" | "primary";
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isLoading = false,
  variant = "danger",
}: ConfirmModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isLoading) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, isLoading, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const variantClasses = {
    danger: "btn-danger",
    warning: "btn-warning",
    primary: "btn-primary",
  };

  return (
    <div
      className="modal-backdrop"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !isLoading) {
          onClose();
        }
      }}
    >
      <div
        ref={modalRef}
        className="modal-content bgc-white bdrs12"
        style={{
          maxWidth: 400,
          width: "90%",
          padding: 24,
          boxShadow: "0 4px 24px rgba(0, 0, 0, 0.15)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h5 className="fw600 mb15" style={{ fontSize: 18 }}>
          {title}
        </h5>
        <p className="text-muted mb20" style={{ fontSize: 14, lineHeight: 1.5 }}>
          {message}
        </p>
        <div className="d-flex justify-content-end gap-2">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="btn btn-secondary"
            style={{ padding: "8px 16px", fontSize: 14 }}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`btn ${variantClasses[variant]}`}
            style={{ padding: "8px 16px", fontSize: 14, minWidth: 80 }}
          >
            {isLoading ? (
              <span
                className="spinner-border spinner-border-sm"
                style={{ width: 16, height: 16 }}
              />
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
