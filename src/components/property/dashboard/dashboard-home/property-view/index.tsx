import Link from "next/link";
import MyPropertiesList from "../MyPropertiesList";

const PropertyViews = () => {
  return (
    <div className="col-md-12">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h4 className="title fz17 mb-0">My Properties</h4>
        <Link href="/dashboard-add-property" className="ud-btn btn-thm btn-sm">
          <i className="fal fa-plus me-2" />
          Add Property
        </Link>
      </div>
      <MyPropertiesList />
    </div>
  );
};

export default PropertyViews;
