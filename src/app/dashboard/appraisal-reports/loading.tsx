// Report card skeleton
function CardSkeleton() {
  return (
    <div className="col-sm-6 col-xl-4">
      <div
        className="ps-widget bgc-white bdrs12 p30 mb30 overflow-hidden position-relative"
        style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}
      >
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div className="skeleton-box" style={{ width: "70%", height: 20 }}></div>
          <div className="skeleton-box" style={{ width: 90, height: 34, borderRadius: 6 }}></div>
        </div>
        <div className="skeleton-box mb-2" style={{ width: "40%", height: 16 }}></div>
        <div className="d-flex gap-4 mb-3">
          <div className="skeleton-box" style={{ width: 100, height: 16 }}></div>
          <div className="skeleton-box" style={{ width: 100, height: 16 }}></div>
        </div>
        <div className="skeleton-box" style={{ width: "50%", height: 16 }}></div>
      </div>
    </div>
  );
}

// Skeleton for branding banner
function BrandingBannerSkeleton() {
  return (
    <div className="mb30">
      <div
        className="d-flex align-items-center gap-3 p20 bgc-white bdrs12"
        style={{ border: "1px solid #e0e0e0" }}
      >
        <div className="skeleton-box flex-shrink-0" style={{ width: 48, height: 48, borderRadius: 8 }}></div>
        <div className="flex-grow-1">
          <div className="skeleton-box mb-2" style={{ width: "50%", height: 16 }}></div>
          <div className="skeleton-box" style={{ width: "70%", height: 12 }}></div>
        </div>
        <div className="skeleton-box flex-shrink-0" style={{ width: 80, height: 36, borderRadius: 6 }}></div>
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <>
      {/* Branding banner skeleton */}
      <BrandingBannerSkeleton />

      {/* Header skeleton */}
      <div className="row align-items-center pb30">
        <div className="col-lg-6">
          <div className="dashboard_title_area">
            <div className="skeleton-box mb-2" style={{ width: 200, height: 32 }}></div>
            <div className="skeleton-box" style={{ width: 320, height: 16 }}></div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="d-flex flex-wrap justify-content-lg-end gap-3">
            <div className="skeleton-box" style={{ width: 220, height: 44, borderRadius: 8 }}></div>
          </div>
        </div>
      </div>

      {/* Cards skeleton */}
      <div className="row">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </>
  );
}
