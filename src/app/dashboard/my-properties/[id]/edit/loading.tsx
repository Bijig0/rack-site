export default function EditPropertyLoading() {
  return (
    <>
      {/* Header */}
      <div className="row align-items-center pb40">
        <div className="col-lg-9">
          <div className="dashboard_title_area">
            <div className="skeleton-box mb-2" style={{ width: 200, height: 32 }}></div>
            <div className="skeleton-box" style={{ width: 300, height: 16 }}></div>
          </div>
        </div>
        <div className="col-lg-3">
          <div className="d-flex gap-2 justify-content-lg-end">
            <div className="skeleton-box" style={{ width: 100, height: 44, borderRadius: 8 }}></div>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div className="row">
        <div className="col-xl-8">
          <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30">
            {/* Property Details Section */}
            <div className="skeleton-box mb25" style={{ width: 150, height: 24 }}></div>
            <div className="row">
              <div className="col-md-6 mb20">
                <div className="skeleton-box mb-2" style={{ width: 80, height: 16 }}></div>
                <div className="skeleton-box" style={{ width: "100%", height: 44, borderRadius: 8 }}></div>
              </div>
              <div className="col-md-6 mb20">
                <div className="skeleton-box mb-2" style={{ width: 80, height: 16 }}></div>
                <div className="skeleton-box" style={{ width: "100%", height: 44, borderRadius: 8 }}></div>
              </div>
              <div className="col-md-6 mb20">
                <div className="skeleton-box mb-2" style={{ width: 100, height: 16 }}></div>
                <div className="skeleton-box" style={{ width: "100%", height: 44, borderRadius: 8 }}></div>
              </div>
              <div className="col-md-6 mb20">
                <div className="skeleton-box mb-2" style={{ width: 80, height: 16 }}></div>
                <div className="skeleton-box" style={{ width: "100%", height: 44, borderRadius: 8 }}></div>
              </div>
            </div>

            {/* Images Section */}
            <hr className="my-4" />
            <div className="skeleton-box mb25" style={{ width: 150, height: 24 }}></div>
            <div className="d-flex gap-3 flex-wrap">
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton-box" style={{ width: 150, height: 150, borderRadius: 8 }}></div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="col-xl-4">
          <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30">
            <div className="skeleton-box mb20" style={{ width: 100, height: 20 }}></div>
            <div className="skeleton-box mb-2" style={{ width: "100%", height: 14 }}></div>
            <div className="skeleton-box mb-2" style={{ width: "90%", height: 14 }}></div>
            <div className="skeleton-box" style={{ width: "70%", height: 14 }}></div>
          </div>
        </div>
      </div>
    </>
  );
}
