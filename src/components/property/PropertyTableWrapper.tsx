"use client";

import { ReactNode } from "react";
import PendingPropertyJobs from "./PendingPropertyJobs";

interface PropertyTableWrapperProps {
  children: ReactNode;
  hasProperties: boolean;
}

export default function PropertyTableWrapper({ children, hasProperties }: PropertyTableWrapperProps) {
  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle mb-0">
        <thead>
          <tr className="text-uppercase fz12 fw600">
            <th className="py-3 ps-3 border-bottom text-muted" style={{ minWidth: 280 }}>Property</th>
            <th className="py-3 px-3 border-bottom text-muted" style={{ minWidth: 100 }}>Type</th>
            <th className="py-3 px-3 border-bottom text-muted text-center" style={{ minWidth: 100 }}>Beds / Baths</th>
            <th className="py-3 px-3 border-bottom text-muted text-center" style={{ minWidth: 120 }}>Status</th>
            <th className="py-3 pe-3 border-bottom text-muted text-end" style={{ minWidth: 140 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* Show pending jobs at the top */}
          <PendingPropertyJobs />
          {/* Show existing properties */}
          {children}
        </tbody>
      </table>
    </div>
  );
}
