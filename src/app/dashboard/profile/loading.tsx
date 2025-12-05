export default function ProfileLoading() {
  return (
    <>
      <div className="row align-items-center pb40">
        <div className="col-lg-12">
          <div className="dashboard_title_area">
            <div className="skeleton-box mb-2" style={{ width: 150, height: 32 }}></div>
            <div className="skeleton-box" style={{ width: 200, height: 16 }}></div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-xl-6">
          {/* Name Section Skeleton */}
          <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30">
            <div className="skeleton-box mb25" style={{ width: 120, height: 20 }}></div>
            <div className="mb20">
              <div className="skeleton-box mb10" style={{ width: 50, height: 14 }}></div>
              <div className="skeleton-box" style={{ width: "100%", height: 44 }}></div>
            </div>
            <div className="skeleton-box" style={{ width: 120, height: 44 }}></div>
          </div>

          {/* Email Section Skeleton */}
          <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30">
            <div className="skeleton-box mb25" style={{ width: 130, height: 20 }}></div>
            <div className="mb20">
              <div className="skeleton-box mb10" style={{ width: 50, height: 14 }}></div>
              <div className="skeleton-box" style={{ width: "100%", height: 44 }}></div>
            </div>
            <div className="skeleton-box" style={{ width: 120, height: 44 }}></div>
          </div>

          {/* Password Section Skeleton */}
          <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30">
            <div className="skeleton-box mb25" style={{ width: 150, height: 20 }}></div>
            <div className="mb20">
              <div className="skeleton-box mb10" style={{ width: 120, height: 14 }}></div>
              <div className="skeleton-box" style={{ width: "100%", height: 44 }}></div>
            </div>
            <div className="mb20">
              <div className="skeleton-box mb10" style={{ width: 100, height: 14 }}></div>
              <div className="skeleton-box" style={{ width: "100%", height: 44 }}></div>
            </div>
            <div className="mb20">
              <div className="skeleton-box mb10" style={{ width: 140, height: 14 }}></div>
              <div className="skeleton-box" style={{ width: "100%", height: 44 }}></div>
            </div>
            <div className="skeleton-box" style={{ width: 150, height: 44 }}></div>
          </div>
        </div>

        {/* Account Info Sidebar Skeleton */}
        <div className="col-xl-6">
          <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30">
            <div className="skeleton-box mb25" style={{ width: 170, height: 20 }}></div>
            <div className="d-flex justify-content-between py-2 border-bottom">
              <div className="skeleton-box" style={{ width: 80, height: 16 }}></div>
              <div className="skeleton-box" style={{ width: 120, height: 16 }}></div>
            </div>
            <div className="d-flex justify-content-between py-2 border-bottom">
              <div className="skeleton-box" style={{ width: 100, height: 16 }}></div>
              <div className="skeleton-box" style={{ width: 140, height: 16 }}></div>
            </div>
            <div className="d-flex justify-content-between py-2">
              <div className="skeleton-box" style={{ width: 90, height: 16 }}></div>
              <div className="skeleton-box" style={{ width: 80, height: 16 }}></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
