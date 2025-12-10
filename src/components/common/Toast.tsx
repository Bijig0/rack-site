"use client";

import { useEffect, useState } from "react";

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info";
  message: string;
}

interface ToastProps {
  toast: ToastMessage;
  onClose: (id: string) => void;
}

function Toast({ toast, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, 5000);
    return () => clearTimeout(timer);
  }, [toast.id, onClose]);

  const bgColor = {
    success: "#d4edda",
    error: "#f8d7da",
    info: "#cce5ff",
  }[toast.type];

  const textColor = {
    success: "#155724",
    error: "#721c24",
    info: "#004085",
  }[toast.type];

  const icon = {
    success: "fas fa-check-circle",
    error: "fas fa-exclamation-circle",
    info: "fas fa-info-circle",
  }[toast.type];

  return (
    <div
      className="d-flex align-items-center p-3 rounded-3 shadow-sm mb-2"
      style={{
        backgroundColor: bgColor,
        color: textColor,
        minWidth: 300,
        animation: "slideIn 0.3s ease-out",
      }}
    >
      <i className={`${icon} me-3 fz18`}></i>
      <span className="flex-grow-1 fz14 fw500">{toast.message}</span>
      <button
        type="button"
        className="btn-close btn-sm"
        style={{ opacity: 0.5 }}
        onClick={() => onClose(toast.id)}
      />
    </div>
  );
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onClose: (id: string) => void;
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 20,
        right: 20,
        zIndex: 9999,
      }}
    >
      <style jsx global>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={onClose} />
      ))}
    </div>
  );
}
