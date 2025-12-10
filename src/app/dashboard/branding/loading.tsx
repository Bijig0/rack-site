export default function BrandingLoading() {
  return (
    <>
      {/* Header */}
      <div className="row align-items-center pb40">
        <div className="col-lg-8">
          <div className="dashboard_title_area">
            <div className="skeleton-box mb-2" style={{ width: 200, height: 32 }}></div>
            <div className="skeleton-box" style={{ width: 360, height: 16 }}></div>
          </div>
        </div>
        <div className="col-lg-4 text-lg-end">
          <div className="skeleton-box ms-lg-auto" style={{ width: 140, height: 44, borderRadius: 8 }}></div>
        </div>
      </div>

      <div className="row">
        <div className="col-xl-8">
          {/* Status Banner Skeleton */}
          <div
            className="d-flex align-items-center gap-3 p20 mb30 bdrs12"
            style={{ backgroundColor: "#f5f5f5", border: "1px solid #e0e0e0" }}
          >
            <div className="skeleton-box flex-shrink-0" style={{ width: 48, height: 48, borderRadius: 12 }}></div>
            <div className="flex-grow-1">
              <div className="skeleton-box mb-2" style={{ width: 160, height: 18 }}></div>
              <div className="skeleton-box" style={{ width: 280, height: 14 }}></div>
            </div>
          </div>

          {/* Main Branding Form Skeleton */}
          <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30">
            {/* Company Logo Section */}
            <div className="mb30">
              <div className="skeleton-box mb20" style={{ width: 140, height: 20 }}></div>
              <div className="d-flex align-items-start gap-4">
                <div className="skeleton-box flex-shrink-0" style={{ width: 140, height: 140, borderRadius: 12 }}></div>
                <div className="flex-grow-1">
                  <div className="skeleton-box mb15" style={{ width: "70%", height: 16 }}></div>
                  <div className="skeleton-box mb15" style={{ width: "90%", height: 14 }}></div>
                  <div className="skeleton-box mb20" style={{ width: "60%", height: 14 }}></div>
                  <div className="d-flex gap-2">
                    <div className="skeleton-box" style={{ width: 140, height: 44, borderRadius: 8 }}></div>
                  </div>
                </div>
              </div>
            </div>

            <hr className="my-4" style={{ borderColor: "#eee" }} />

            {/* Company Name Section */}
            <div>
              <div className="skeleton-box mb20" style={{ width: 140, height: 20 }}></div>
              <div className="skeleton-box mb-2" style={{ width: 280, height: 14 }}></div>
              <div className="skeleton-box mb20" style={{ width: "100%", height: 50, borderRadius: 8 }}></div>
              <div className="skeleton-box" style={{ width: 180, height: 44, borderRadius: 8 }}></div>
            </div>
          </div>
        </div>

        {/* Preview Sidebar Skeleton */}
        <div className="col-xl-4">
          <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30">
            <div className="skeleton-box mb20" style={{ width: 120, height: 20 }}></div>
            <div className="skeleton-box mb20" style={{ width: "100%", height: 14 }}></div>

            {/* Preview Card Skeleton */}
            <div
              className="bdrs8 p20"
              style={{ backgroundColor: "#f8f9fa", border: "1px solid #e9ecef" }}
            >
              <div className="d-flex align-items-center gap-3 mb15 pb15" style={{ borderBottom: "1px solid #e0e0e0" }}>
                <div className="skeleton-box flex-shrink-0" style={{ width: 50, height: 50, borderRadius: 8 }}></div>
                <div className="flex-grow-1">
                  <div className="skeleton-box mb-2" style={{ width: 100, height: 14 }}></div>
                  <div className="skeleton-box" style={{ width: 130, height: 11 }}></div>
                </div>
              </div>
              <div className="skeleton-box mb-2" style={{ width: "100%", height: 8, borderRadius: 4 }}></div>
              <div className="skeleton-box mb-2" style={{ width: "90%", height: 8, borderRadius: 4 }}></div>
              <div className="skeleton-box" style={{ width: "70%", height: 8, borderRadius: 4 }}></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
