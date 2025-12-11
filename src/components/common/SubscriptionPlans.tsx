"use client";

import Link from "next/link";

const pricingPlans = [
  {
    type: "STARTER PLAN",
    price: "$0",
    currency: "",
    period: "/month",
    description: "Free during launch! Perfect for getting started.",
    features: [
      "Create and manage up to 10 properties",
      "Access to 3 checklist templates",
      "Generate up to 10 rental appraisal reports/month",
    ],
    buttonLabel: "Current Plan",
    isPopular: false,
    isFreeLaunch: true,
  },
  {
    type: "PROFESSIONAL PLAN",
    price: "$59",
    currency: "AUD",
    period: "/month",
    description: "Ideal For: Active agents managing multiple properties",
    features: [
      "Create and manage up to 50 properties",
      "Access to unlimited checklist templates",
      "Generate up to 50 rental appraisal reports/month",
      "Email support",
    ],
    buttonLabel: "Contact Us",
    isPopular: true,
  },
  {
    type: "PREMIUM PLAN",
    price: "$99",
    currency: "AUD",
    period: "/month",
    description: "Ideal For: Power users and agencies",
    features: [
      "Create and manage unlimited properties",
      "Access to all available checklist templates",
      "Generate unlimited appraisal reports",
      "Priority email support",
      "Early access to new features",
    ],
    buttonLabel: "Contact Us",
    isPopular: false,
  },
];

type SubscriptionPlansProps = {
  showTitle?: boolean;
  compact?: boolean;
};

export default function SubscriptionPlans({ showTitle = true, compact = false }: SubscriptionPlansProps) {
  return (
    <div className={compact ? "" : "container"}>
      {showTitle && (
        <div className="row justify-content-center mb60">
          <div className="col-lg-8 text-center">
            <h2
              className="title mb20"
              style={{ fontSize: compact ? 28 : 40, fontWeight: 700 }}
            >
              Simple Pricing for Powerful Insights.
            </h2>
            <p className="text fz18">
              Whether you&apos;re a solo agent or managing multiple clients,
              our plans scale with your needs.
            </p>
          </div>
        </div>
      )}
      <div className="row">
        {pricingPlans.map((plan, index) => (
          <div key={index} className="col-md-4 mb30">
            <div
              className={`p30 bgc-white bdrs12 h-100 d-flex flex-column ${
                plan.isPopular ? "border-thm" : ""
              }`}
              style={{
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                border: plan.isPopular
                  ? "2px solid #eb6753"
                  : "1px solid #eee",
              }}
            >
              {(plan as any).isFreeLaunch && (
                <div
                  className="mb15"
                  style={{
                    backgroundColor: "#4caf50",
                    color: "white",
                    padding: "4px 12px",
                    borderRadius: 4,
                    fontSize: 12,
                    fontWeight: 600,
                    display: "inline-block",
                    width: "fit-content",
                  }}
                >
                  FREE DURING LAUNCH
                </div>
              )}
              {plan.isPopular && (
                <div
                  className="mb15"
                  style={{
                    backgroundColor: "#eb6753",
                    color: "white",
                    padding: "4px 12px",
                    borderRadius: 4,
                    fontSize: 12,
                    fontWeight: 600,
                    display: "inline-block",
                    width: "fit-content",
                  }}
                >
                  MOST POPULAR
                </div>
              )}
              <div className="mb30">
                <h6 className="mb15" style={{ fontWeight: 600 }}>
                  {plan.type}
                </h6>
                <div className="d-flex align-items-baseline">
                  <span
                    style={{
                      color: "#eb6753",
                      fontSize: 14,
                      fontWeight: 600,
                    }}
                  >
                    {plan.currency}
                  </span>
                  <span
                    style={{
                      color: "#eb6753",
                      fontSize: compact ? 32 : 40,
                      fontWeight: 700,
                      marginLeft: 4,
                    }}
                  >
                    {plan.price}
                  </span>
                  <span className="text">{plan.period}</span>
                </div>
                <p className="text fz14 mt10 mb-0">{plan.description}</p>
              </div>
              <div className="flex-grow-1">
                <h6 className="mb15" style={{ fontWeight: 600 }}>
                  What&apos;s Included:
                </h6>
                <ul className="list-style-none p-0 mb30">
                  {plan.features.map((feature, i) => (
                    <li
                      key={i}
                      className="d-flex align-items-center mb10 text fz14"
                    >
                      <span
                        className="me-2 flex-shrink-0"
                        style={{
                          width: 20,
                          height: 20,
                          backgroundColor: "#e8f5e9",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <i
                          className="fas fa-check"
                          style={{ color: "#4caf50", fontSize: 10 }}
                        />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              {(plan as any).isFreeLaunch ? (
                <button
                  className="ud-btn w-100 btn-dark"
                  disabled
                  style={{ opacity: 0.8, cursor: "default" }}
                >
                  {plan.buttonLabel}
                  <i className="fas fa-check ms-2" />
                </button>
              ) : (
                <Link
                  href="/contact"
                  className={`ud-btn w-100 ${plan.isPopular ? "btn-thm" : "btn-white2"}`}
                >
                  {plan.buttonLabel}
                  <i className="fal fa-arrow-right-long" />
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
