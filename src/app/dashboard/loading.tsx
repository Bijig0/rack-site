export default function DashboardLoading() {
  return (
    <>
      <div className="row pb40">
        <div className="col-lg-12">
          <div className="dashboard_title_area">
            <div className="skeleton-box mb-2" style={{ width: 200, height: 32 }}></div>
            <div className="skeleton-box" style={{ width: 150, height: 16 }}></div>
          </div>
        </div>
      </div>

      <div className="row">
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
      </div>

      <div className="row">
        <div className="col-xl-8">
          <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
            <div className="d-flex align-items-center justify-content-between mb-4">
              <div className="skeleton-box" style={{ width: 140, height: 24 }}></div>
              <div className="skeleton-box" style={{ width: 120, height: 36 }}></div>
            </div>
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
          </div>
        </div>

        <div className="col-xl-4">
          <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
            <div className="skeleton-box mb25" style={{ width: 120, height: 20 }}></div>
            {[1, 2, 3].map((i) => (
              <div key={i} className="d-flex align-items-center mb20">
                <div className="skeleton-box me-3" style={{ width: 60, height: 60, borderRadius: 4 }}></div>
                <div className="flex-grow-1">
                  <div className="skeleton-box mb-2" style={{ width: "80%", height: 14 }}></div>
                  <div className="skeleton-box" style={{ width: "50%", height: 12 }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </>
  );
}
