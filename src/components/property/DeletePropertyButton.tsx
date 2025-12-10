"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteProperty } from "@/actions/properties";
import { usePropertyJobs } from "@/context/PropertyJobsContext";

interface DeletePropertyButtonProps {
  propertyId: string;
  propertyName: string;
}

export default function DeletePropertyButton({
  propertyId,
  propertyName,
}: DeletePropertyButtonProps) {
  const router = useRouter();
  const { showToast } = usePropertyJobs();
  const [showModal, setShowModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);

    const result = await deleteProperty(propertyId);

    if (result.success) {
      showToast("success", `Property "${propertyName}" has been deleted`);
      router.push("/dashboard/my-properties");
    } else {
      setError(result.error || "Failed to delete property");
      setIsDeleting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setShowModal(true)}
        className="ud-btn btn-white2 text-danger"
      >
        <i className="fas fa-trash-alt me-2"></i>Delete Property
      </button>

      {/* Delete Confirmation Modal */}
      {showModal && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={() => !isDeleting && setShowModal(false)}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title text-danger">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  Delete Property
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => !isDeleting && setShowModal(false)}
                  disabled={isDeleting}
                />
              </div>
              <div className="modal-body">
                <p className="mb-2">
                  Are you sure you want to delete this property?
                </p>
                <p className="fw600 mb-3">{propertyName}</p>
                <div
                  className="alert alert-warning fz14 mb-0"
                  role="alert"
                >
                  <i className="fas fa-info-circle me-2"></i>
                  This action cannot be undone. All appraisal reports associated
                  with this property will also be permanently deleted.
                </div>
                {error && (
                  <div className="alert alert-danger fz14 mt-3 mb-0" role="alert">
                    <i className="fas fa-exclamation-circle me-2"></i>
                    {error}
                  </div>
                )}
              </div>
              <div className="modal-footer border-0 pt-0">
                <button
                  type="button"
                  className="ud-btn btn-white2"
                  onClick={() => setShowModal(false)}
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="ud-btn btn-thm"
                  style={{ backgroundColor: "#dc3545", borderColor: "#dc3545" }}
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-trash-alt me-2"></i>
                      Delete Property
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
