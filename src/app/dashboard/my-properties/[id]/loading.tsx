export default function PropertyDetailLoading() {
  return (
    <>
      {/* Header */}
      <div className="row align-items-center pb40">
        <div className="col-xxl-9">
          <div className="dashboard_title_area">
            <div className="skeleton-box mb-2" style={{ width: 180, height: 32 }}></div>
            <div className="skeleton-box" style={{ width: 160, height: 16 }}></div>
          </div>
        </div>
        <div className="col-xxl-3">
          <div className="d-flex gap-2 justify-content-xxl-end">
            <div className="skeleton-box" style={{ width: 130, height: 44, borderRadius: 8 }}></div>
          </div>
        </div>
      </div>

      {/* Property Header */}
      <div className="row mb30">
        <div className="col-lg-8">
          <div className="single-property-content mb30-md">
            <div className="skeleton-box mb-3" style={{ width: "80%", height: 28 }}></div>
            <div className="d-flex gap-3 mb-3">
              <div className="skeleton-box" style={{ width: 100, height: 16 }}></div>
              <div className="skeleton-box" style={{ width: 120, height: 16 }}></div>
              <div className="skeleton-box" style={{ width: 140, height: 16 }}></div>
            </div>
            <div className="d-flex gap-3">
              <div className="skeleton-box" style={{ width: 70, height: 16 }}></div>
              <div className="skeleton-box" style={{ width: 70, height: 16 }}></div>
              <div className="skeleton-box" style={{ width: 80, height: 16 }}></div>
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="d-flex gap-2 justify-content-lg-end">
            <div className="skeleton-box" style={{ width: 120, height: 44, borderRadius: 8 }}></div>
            <div className="skeleton-box" style={{ width: 120, height: 44, borderRadius: 8 }}></div>
          </div>
        </div>
      </div>

      {/* Property Images */}
      <div className="row mb30">
        <div className="col-12">
          <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 overflow-hidden position-relative">
            <div className="row">
              <div className="col-md-8">
                <div className="skeleton-box" style={{ width: "100%", height: 400, borderRadius: 12 }}></div>
              </div>
              <div className="col-md-4">
                <div className="row g-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="col-6">
                      <div className="skeleton-box" style={{ width: "100%", height: 120, borderRadius: 8 }}></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overview */}
      <div className="row">
        <div className="col-xl-12">
          <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
            <div className="skeleton-box mb30" style={{ width: 100, height: 24 }}></div>
            <div className="row">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="col-sm-6 col-lg-3">
                  <div className="d-flex align-items-center mb25">
                    <div className="skeleton-box me-3" style={{ width: 40, height: 40, borderRadius: 8 }}></div>
                    <div>
                      <div className="skeleton-box mb-1" style={{ width: 80, height: 14 }}></div>
                      <div className="skeleton-box" style={{ width: 40, height: 18 }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
