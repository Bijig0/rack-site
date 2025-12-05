import { getUserPropertyCount } from "@/actions/properties";

const TopStateBlock = async () => {
  const propertyCount = await getUserPropertyCount();

  return (
    <div className="col-sm-6 col-xxl-3">
      <div className="d-flex justify-content-between statistics_funfact">
        <div className="details">
          <div className="text fz25">Total Properties</div>
          <div className="title">{propertyCount}</div>
        </div>
        <div className="icon text-center">
          <i className="flaticon-home" />
        </div>
      </div>
    </div>
  );
};

export default TopStateBlock;
