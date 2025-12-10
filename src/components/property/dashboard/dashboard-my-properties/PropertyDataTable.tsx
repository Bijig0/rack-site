"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState, useTransition } from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { getUserProperties, type PropertyWithAppraisal } from "@/actions/properties";

const getStatusStyle = (status: string | null) => {
  switch (status) {
    case "pending":
      return "pending-style style1";
    case "completed":
      return "pending-style style2";
    case "processing":
      return "pending-style style3";
    case "failed":
      return "pending-style style4";
    default:
      return "pending-style style1";
  }
};

const getStatusLabel = (status: string | null) => {
  switch (status) {
    case "pending":
      return "Pending";
    case "completed":
      return "Completed";
    case "processing":
      return "Processing";
    case "failed":
      return "Failed";
    default:
      return "No Report";
  }
};

const formatDate = (date: Date | string) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const PlaceholderImage = () => (
  <div
    style={{
      width: 110,
      height: 94,
      backgroundColor: "#f0f0f0",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 4,
    }}
  >
    <svg
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 21H21M5 21V7L12 3L19 7V21M9 21V13H15V21"
        stroke="#999"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

const PropertyDataTable = () => {
  const [properties, setProperties] = useState<PropertyWithAppraisal[]>([]);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    startTransition(async () => {
      try {
        const data = await getUserProperties();
        setProperties(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      }
    });
  }, []);

  if (isPending) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        Error loading properties: {error}
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-5">
        <p className="text-muted">No properties found. Add your first property to get started.</p>
      </div>
    );
  }

  return (
    <table className="table-style3 table at-savesearch">
      <thead className="t-head">
        <tr>
          <th scope="col">Property</th>
          <th scope="col">Date Added</th>
          <th scope="col">Status</th>
          <th scope="col">Report Date</th>
          <th scope="col">Action</th>
        </tr>
      </thead>
      <tbody className="t-body">
        {properties.map((property) => (
          <tr key={property.id}>
            <th scope="row">
              <div className="listing-style1 dashboard-style d-xxl-flex align-items-center mb-0">
                <div className="list-thumb">
                  {property.mainImageUrl ? (
                    <Image
                      width={110}
                      height={94}
                      className="w-100"
                      src={property.mainImageUrl}
                      alt={property.addressCommonName}
                      style={{ objectFit: "cover" }}
                    />
                  ) : (
                    <PlaceholderImage />
                  )}
                </div>
                <div className="list-content py-0 p-0 mt-2 mt-xxl-0 ps-xxl-4">
                  <div className="h6 list-title">
                    <Link href={`/dashboard-my-properties/${property.id}`}>
                      {property.addressCommonName}
                    </Link>
                  </div>
                  <p className="list-text mb-0">
                    {[
                      property.bedroomCount && `${property.bedroomCount} bed`,
                      property.bathroomCount && `${property.bathroomCount} bath`,
                      property.propertyType,
                    ]
                      .filter(Boolean)
                      .join(" • ") || "Property details pending"}
                  </p>
                  {property.landAreaSqm && (
                    <div className="list-price">
                      <span>{property.landAreaSqm} sqm</span>
                    </div>
                  )}
                </div>
              </div>
            </th>
            <td className="vam">{formatDate(property.createdAt)}</td>
            <td className="vam">
              <span className={getStatusStyle(property.latestAppraisal?.status || null)}>
                {getStatusLabel(property.latestAppraisal?.status || null)}
              </span>
            </td>
            <td className="vam">
              {property.latestAppraisal
                ? formatDate(property.latestAppraisal.createdAt)
                : "—"}
            </td>
            <td className="vam">
              <div className="d-flex">
                <Link
                  href={`/dashboard-my-properties/${property.id}`}
                  className="icon"
                  style={{ border: "none" }}
                  data-tooltip-id={`view-${property.id}`}
                >
                  <span className="fas fa-eye fa" />
                </Link>
                <Link
                  href={`/dashboard-my-properties/${property.id}/edit`}
                  className="icon"
                  style={{ border: "none" }}
                  data-tooltip-id={`edit-${property.id}`}
                >
                  <span className="fas fa-pen fa" />
                </Link>
                <button
                  className="icon"
                  style={{ border: "none" }}
                  data-tooltip-id={`delete-${property.id}`}
                >
                  <span className="flaticon-bin" />
                </button>

                <ReactTooltip
                  id={`view-${property.id}`}
                  place="top"
                  content="View"
                />
                <ReactTooltip
                  id={`edit-${property.id}`}
                  place="top"
                  content="Edit"
                />
                <ReactTooltip
                  id={`delete-${property.id}`}
                  place="top"
                  content="Delete"
                />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PropertyDataTable;
