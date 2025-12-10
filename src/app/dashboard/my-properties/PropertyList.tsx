"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { PropertyWithAppraisal } from "@/actions/properties";

function PropertyCard({ property }: { property: PropertyWithAppraisal }) {
  const lastAppraisalDate = property.latestAppraisal?.createdAt
    ? new Date(property.latestAppraisal.createdAt).toLocaleDateString("en-AU", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="col-sm-6 col-xl-4">
      <div
        className="ps-widget bgc-white bdrs12 p30 mb30 overflow-hidden position-relative"
        style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}
      >
        {/* Three dots menu */}
        <div className="dropdown position-absolute" style={{ top: 16, right: 16, zIndex: 1 }}>
          <button
            className="btn p-0 three-dots-menu"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="fas fa-ellipsis-v" />
          </button>
          <ul className="dropdown-menu dropdown-menu-end" style={{ border: "1px solid #e0e0e0", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
            <li>
              <Link className="dropdown-item fz14" href={`/dashboard/my-properties/${property.id}`}>
                <i className="fas fa-eye me-2" /> View Details
              </Link>
            </li>
            <li>
              <Link className="dropdown-item fz14" href={`/dashboard/my-properties/${property.id}/edit`}>
                <i className="fas fa-edit me-2" /> Edit Property
              </Link>
            </li>
            <li>
              <Link className="dropdown-item fz14" href={`/dashboard/my-properties/${property.id}/generate-report`}>
                <i className="fas fa-file-pdf me-2" /> Generate Report
              </Link>
            </li>
          </ul>
        </div>

        {/* Property Thumbnail */}
        <Link href={`/dashboard/my-properties/${property.id}`} className="d-block mb20">
          {property.mainImageUrl ? (
            <Image
              src={property.mainImageUrl}
              alt={property.addressCommonName}
              width={400}
              height={140}
              className="property-thumbnail"
              style={{ objectFit: "cover" }}
            />
          ) : (
            <div
              className="d-flex align-items-center justify-content-center"
              style={{
                width: "100%",
                height: 140,
                borderRadius: 8,
                backgroundColor: "#f5f5f5",
              }}
            >
              <i className="flaticon-home" style={{ fontSize: 40, color: "#ccc" }} />
            </div>
          )}
        </Link>

        {/* Address */}
        <Link
          href={`/dashboard/my-properties/${property.id}`}
          className="text-decoration-none"
        >
          <h5
            className="fw600 mb15"
            style={{
              color: "#222",
              fontSize: 16,
              lineHeight: 1.4,
            }}
          >
            {property.addressCommonName}
          </h5>
        </Link>

        {/* Property Info */}
        <div className="d-flex flex-wrap gap-4 mb15 fz14">
          {property.bedroomCount && (
            <div>
              <span style={{ color: "#888" }}>Bedrooms</span>
              <span className="ms-2 fw500" style={{ color: "#222" }}>{property.bedroomCount}</span>
            </div>
          )}
          {property.bathroomCount && (
            <div>
              <span style={{ color: "#888" }}>Bathrooms</span>
              <span className="ms-2 fw500" style={{ color: "#222" }}>{property.bathroomCount}</span>
            </div>
          )}
          {property.propertyType && (
            <div>
              <span style={{ color: "#888" }}>Type</span>
              <span className="ms-2 fw500" style={{ color: "#222" }}>{property.propertyType}</span>
            </div>
          )}
        </div>

        {/* Last Appraisal Date */}
        <div className="fz14">
          <span style={{ color: "#888" }}>Last Appraisal</span>
          <span className="ms-3" style={{ color: "#222" }}>
            {lastAppraisalDate || "N/A"}
          </span>
        </div>
      </div>
    </div>
  );
}

interface PropertyListProps {
  properties: PropertyWithAppraisal[];
}

export default function PropertyList({ properties }: PropertyListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProperties = properties.filter((property) =>
    property.addressCommonName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Header */}
      <div className="row align-items-center pb30">
        <div className="col-lg-6">
          <div className="dashboard_title_area">
            <h2>My Properties</h2>
            <p className="text">Manage your properties and appraisal reports</p>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="d-flex flex-wrap justify-content-lg-end gap-3">
            {/* Search input */}
            <div className="position-relative">
              <i
                className="fas fa-search position-absolute"
                style={{ left: 14, top: "50%", transform: "translateY(-50%)", color: "#888", fontSize: 14 }}
              />
              <input
                type="text"
                placeholder="Search..."
                className="form-control"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  paddingLeft: 40,
                  borderRadius: 8,
                  border: "1px solid #e0e0e0",
                  width: 200,
                  fontSize: 14,
                }}
              />
            </div>

            {/* Add Property button */}
            <Link href="/dashboard/add-property" className="ud-btn btn-thm">
              <i className="fal fa-plus me-2" />
              Add Property
            </Link>
          </div>
        </div>
      </div>

      {/* Property Cards Grid */}
      <div className="row">
        {filteredProperties.length === 0 ? (
          <div className="col-12">
            <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 text-center">
              {searchQuery ? (
                <>
                  <i className="fas fa-search fz60 text-muted mb-4 d-block" />
                  <h4 className="mb-3">No properties found</h4>
                  <p className="text-muted mb-4">
                    No properties match &quot;{searchQuery}&quot;
                  </p>
                  <button
                    onClick={() => setSearchQuery("")}
                    className="ud-btn btn-thm"
                  >
                    Clear Search
                  </button>
                </>
              ) : (
                <>
                  <i className="flaticon-home fz60 text-muted mb-4 d-block" />
                  <h4 className="mb-3">No properties yet</h4>
                  <p className="text-muted mb-4">
                    Add your first property to start generating appraisal reports.
                  </p>
                  <Link href="/dashboard/add-property" className="ud-btn btn-thm">
                    <i className="fal fa-plus me-2" />
                    Add Property
                  </Link>
                </>
              )}
            </div>
          </div>
        ) : (
          filteredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))
        )}
      </div>
    </>
  );
}
