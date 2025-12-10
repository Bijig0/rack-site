export default function GenerateReportLoading() {
  return (
    <>
      {/* Header */}
      <div className="row align-items-center pb40">
        <div className="col-lg-12">
          <div className="dashboard_title_area">
            <div className="skeleton-box mb-2" style={{ width: 220, height: 32 }}></div>
            <div className="skeleton-box" style={{ width: 140, height: 16 }}></div>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div className="row">
        <div className="col-xl-8">
          <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
            <div className="skeleton-box mb30" style={{ width: 240, height: 24 }}></div>

            {/* Description skeleton */}
            <div className="skeleton-box mb-2" style={{ width: "100%", height: 16 }}></div>
            <div className="skeleton-box mb20" style={{ width: "70%", height: 16 }}></div>

            {/* Info alert skeleton */}
            <div
              className="mb30 p-3 bdrs8"
              style={{ backgroundColor: "#e8f4fc" }}
            >
              <div className="d-flex align-items-start gap-2">
                <div className="skeleton-box flex-shrink-0" style={{ width: 20, height: 20, borderRadius: 4 }}></div>
                <div className="flex-grow-1">
                  <div className="skeleton-box mb-1" style={{ width: "90%", height: 14 }}></div>
                  <div className="skeleton-box" style={{ width: "60%", height: 14 }}></div>
                </div>
              </div>
            </div>

            {/* Branding preview skeleton */}
            <div
              className="mb30 p-3 bdrs8"
              style={{ backgroundColor: "#f8f9fa", border: "1px solid #e0e0e0" }}
            >
              <div className="skeleton-box mb-3" style={{ width: 140, height: 16 }}></div>
              <div className="d-flex align-items-center gap-3">
                <div className="skeleton-box flex-shrink-0" style={{ width: 60, height: 60, borderRadius: 8 }}></div>
                <div className="flex-grow-1">
                  <div className="skeleton-box mb-2" style={{ width: 140, height: 16 }}></div>
                  <div className="skeleton-box" style={{ width: 200, height: 12 }}></div>
                </div>
              </div>
            </div>

            {/* Buttons skeleton */}
            <div className="d-flex gap-3">
              <div className="skeleton-box" style={{ width: 180, height: 48, borderRadius: 8 }}></div>
              <div className="skeleton-box" style={{ width: 100, height: 48, borderRadius: 8 }}></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
