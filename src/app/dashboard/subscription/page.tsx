import SubscriptionPlans from "@/components/common/SubscriptionPlans";

export const metadata = {
  title: "Subscription Plans | Dashboard",
};

export default function SubscriptionPage() {
  return (
    <>
      <div className="row pb40">
        <div className="col-lg-12">
          <div className="dashboard_title_area">
            <h2>Subscription Plans</h2>
            <p className="text">Choose the plan that best fits your needs</p>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <SubscriptionPlans showTitle={false} compact={false} />
        </div>
      </div>
    </>
  );
}
