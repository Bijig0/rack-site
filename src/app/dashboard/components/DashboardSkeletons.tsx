// Skeleton for StatsBlock
export function StatsBlockSkeleton() {
  return (
    <div className="col-sm-6 col-xxl-3">
      <div className="d-flex justify-content-between statistics_funfact">
        <div className="details">
          <div className="skeleton-box mb-2" style={{ width: 120, height: 20 }}></div>
          <div className="skeleton-box" style={{ width: 40, height: 32 }}></div>
        </div>
        <div className="icon text-center">
          <i className="flaticon-home" />
        </div>
      </div>
    </div>
  );
}

// Skeleton for PropertiesList
export function PropertiesListSkeleton() {
  return (
    <>
      {[1, 2, 3].map((i) => (
        <div key={i} className="d-flex align-items-center p-3 bgc-white bdrs8 mb15">
          <div className="skeleton-box" style={{ width: 60, height: 60, borderRadius: 8 }}></div>
          <div className="ms-3 flex-grow-1">
            <div className="skeleton-box mb-2" style={{ width: "60%", height: 16 }}></div>
            <div className="skeleton-box" style={{ width: "40%", height: 12 }}></div>
          </div>
          <div className="skeleton-box" style={{ width: 70, height: 24 }}></div>
        </div>
      ))}
    </>
  );
}

// Skeleton for CompanyBrandingCard
export function CompanyBrandingCardSkeleton() {
  return (
    <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
      <div className="skeleton-box mb-3" style={{ width: 150, height: 20 }}></div>
      <div className="d-flex align-items-center gap-3">
        <div className="skeleton-box" style={{ width: 56, height: 56, borderRadius: 10 }}></div>
        <div className="flex-grow-1">
          <div className="skeleton-box mb-2" style={{ width: "70%", height: 16 }}></div>
          <div className="skeleton-box" style={{ width: "50%", height: 12 }}></div>
        </div>
      </div>
    </div>
  );
}

// Skeleton for AppraisalReportsList
export function AppraisalReportsListSkeleton() {
  return (
    <>
      {[1, 2, 3].map((i) => (
        <div key={i} className={`d-flex align-items-start justify-content-between py-3 ${i !== 3 ? "border-bottom" : ""}`}>
          <div className="flex-grow-1">
            <div className="skeleton-box mb-2" style={{ width: "80%", height: 16 }}></div>
            <div className="d-flex flex-wrap gap-3 mb-2">
              <div className="skeleton-box" style={{ width: 80, height: 12 }}></div>
              <div className="skeleton-box" style={{ width: 80, height: 12 }}></div>
            </div>
            <div className="skeleton-box" style={{ width: 120, height: 12 }}></div>
          </div>
          <div className="skeleton-box ms-3" style={{ width: 80, height: 28, borderRadius: 6 }}></div>
        </div>
      ))}
    </>
  );
}
