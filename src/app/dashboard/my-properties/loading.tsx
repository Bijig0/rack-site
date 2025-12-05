export default function MyPropertiesLoading() {
  return (
    <>
      <div className="row align-items-center pb40">
        <div className="col-lg-8">
          <div className="dashboard_title_area">
            <div className="skeleton-box mb-2" style={{ width: 180, height: 32 }}></div>
            <div className="skeleton-box" style={{ width: 300, height: 16 }}></div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="d-flex justify-content-lg-end">
            <div className="skeleton-box rounded-1" style={{ width: 140, height: 44 }}></div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
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
                  {[1, 2, 3, 4, 5].map((i) => (
                    <tr key={i} className="border-bottom">
                      <td className="py-3 ps-3">
                        <div className="d-flex align-items-center">
                          <div className="skeleton-box" style={{ width: 56, height: 56, borderRadius: 10 }}></div>
                          <div className="ms-3">
                            <div className="skeleton-box mb-2" style={{ width: 180, height: 15 }}></div>
                            <div className="skeleton-box" style={{ width: 100, height: 13 }}></div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="skeleton-box" style={{ width: 70, height: 14 }}></div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <div className="skeleton-box mx-auto" style={{ width: 50, height: 14 }}></div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <div className="skeleton-box mx-auto rounded-pill" style={{ width: 90, height: 26 }}></div>
                      </td>
                      <td className="py-3 pe-3 text-end">
                        <div className="d-inline-flex gap-2">
                          <div className="skeleton-box rounded-1" style={{ width: 60, height: 34 }}></div>
                          <div className="skeleton-box rounded-1" style={{ width: 60, height: 34 }}></div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
