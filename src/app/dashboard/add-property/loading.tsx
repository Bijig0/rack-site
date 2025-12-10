export default function AddPropertyLoading() {
  return (
    <>
      {/* Header */}
      <div className="row align-items-center pb40">
        <div className="col-lg-12">
          <div className="dashboard_title_area">
            <div className="skeleton-box mb-2" style={{ width: 200, height: 32 }}></div>
            <div className="skeleton-box" style={{ width: 160, height: 16 }}></div>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div className="row justify-content-center">
        <div className="col-xl-8">
          <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
            <div className="skeleton-box mb30" style={{ width: 160, height: 24 }}></div>

            {/* Address Input Skeleton */}
            <div className="mb20">
              <div className="skeleton-box mb-2" style={{ width: 120, height: 16 }}></div>
              <div className="skeleton-box" style={{ width: "100%", height: 50, borderRadius: 8 }}></div>
            </div>

            {/* Address Details Skeleton */}
            <div className="row mb20">
              <div className="col-md-6 mb20 mb-md-0">
                <div className="skeleton-box mb-2" style={{ width: 80, height: 16 }}></div>
                <div className="skeleton-box" style={{ width: "100%", height: 44, borderRadius: 8 }}></div>
              </div>
              <div className="col-md-3 mb20 mb-md-0">
                <div className="skeleton-box mb-2" style={{ width: 60, height: 16 }}></div>
                <div className="skeleton-box" style={{ width: "100%", height: 44, borderRadius: 8 }}></div>
              </div>
              <div className="col-md-3">
                <div className="skeleton-box mb-2" style={{ width: 80, height: 16 }}></div>
                <div className="skeleton-box" style={{ width: "100%", height: 44, borderRadius: 8 }}></div>
              </div>
            </div>

            {/* Buttons Skeleton */}
            <div className="d-flex gap-3 mt30">
              <div className="skeleton-box flex-grow-1" style={{ height: 48, borderRadius: 8 }}></div>
              <div className="skeleton-box" style={{ width: 100, height: 48, borderRadius: 8 }}></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
