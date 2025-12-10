import Image from "next/image";
import Link from "next/link";
import MobileMenu from "@/components/common/mobile-menu";
import DefaultHeader from "@/components/common/DefaultHeader";
import Footer from "@/components/home/home-v4/footer";

export const metadata = {
  title: "Rental Appraisal Report Generator",
};

const pricingFeatures = [
  {
    title: "Customizable Data-Driven Smart Pricing",
    description:
      "Intelligent price recommendations considering market trends like supply, demand, seasons, events, and holidays, with full control over the final prices",
  },
  {
    title: "Advanced Minimum Stay Intelligence",
    description:
      "Optimize booking duration with helpful recommendations specific to each property",
  },
  {
    title: "Time-Saving Workflows",
    description:
      "View and update multiple properties in bulk with MultiCalendar, CSVs or APIs to save valuable time",
  },
];

const trustedIndustries = [
  { name: "CoreLogic", img: "/images/corelogic.svg" },
  { name: "AirDNA", img: "/images/airdna.svg" },
  { name: "Wheelhouse", img: "/images/wheelhouse.svg" },
];

const toolFeatures = [
  {
    icon: "flaticon-document",
    title: "Structured Property Checklists",
    description:
      "Capture every detail during site visits, with customizable fields and mobile-friendly design.",
  },
  {
    icon: "flaticon-chart",
    title: "Live Market Data Panel",
    description:
      "Visualize pricing trends, occupancy rates, and demand indicators from trusted APIs—right where you need them.",
  },
  {
    icon: "flaticon-file",
    title: "Automated Rental Appraisal Generator",
    description:
      "Produce sleek, data-backed reports in minutes—perfect for investor presentations or internal evaluations.",
  },
];

const platformComparison = {
  withPlatform: [
    "All your data, aggregated in one place",
    "Standardized reports ready for investors",
    "Instant alerts for planning & risk factors",
    "Make decisions backed by real-time analytics",
  ],
  withoutPlatform: [
    "Manually searching 5+ sites for data",
    "Inconsistent, unstructured appraisals",
    "Overlooking zoning and environmental risks",
    "Relying on gut feeling",
  ],
};

const testimonials = [
  {
    name: "Mark McCarthy",
    avatar: "/images/avatar.svg",
    rating: 5,
    comment:
      "This platform saves me hours every week. The generated reports are investor-ready and backed by real-time data.",
  },
  {
    name: "Robert Fox",
    avatar: "/images/avatar1.svg",
    rating: 5,
    comment:
      "As an investor, I need clarity. This tool gives me the confidence to act quickly on the right properties.",
  },
  {
    name: "James Wilson",
    avatar: "/images/avatar2.svg",
    rating: 5,
    comment:
      "This platform saves me hours every week. The appraisal reports are investor-ready and backed by real-time data.",
  },
];

const pricingPlans = [
  {
    type: "STARTER PLAN",
    price: "$29",
    currency: "AUD",
    period: "/month",
    description: "Ideal For: New buyer agents or low-volume users",
    features: [
      "Create and manage up to 10 properties",
      "Access to 3 checklist templates",
      "Generate up to 10 rental appraisal reports/month",
    ],
    buttonLabel: "Get Started",
    isPopular: false,
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
    buttonLabel: "Get Started",
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
    buttonLabel: "Get Started",
    isPopular: false,
  },
];

const faqItems = [
  {
    question: "What types of properties are supported?",
    answer:
      "Residential properties, with support for short stay market analysis.",
  },
  {
    question: "Can I export or share reports?",
    answer:
      "Yes, all reports can be exported as PDFs and shared directly via email or download link.",
  },
  {
    question: "Is this platform only for buyer agents?",
    answer:
      "No, our platform is designed for buyer agents, property managers, and investors looking to analyze short-stay potential.",
  },
  {
    question: "What data sources are used?",
    answer:
      "We integrate with leading industry APIs including AirDNA, CoreLogic, and other trusted data providers for accurate market insights.",
  },
];

const Home_V4 = () => {
  return (
    <>
      {/* Main Header Nav */}
      <DefaultHeader />
      {/* End Main Header Nav */}

      {/* Mobile Nav */}
      <MobileMenu />
      {/* End Mobile Nav */}

      {/* Hero Section */}
      <section
        className="home-banner-style4 p0"
        style={{
          backgroundImage: "url(/images/home/home-4.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "linear-gradient(135deg, rgba(26, 31, 60, 0.9) 0%, rgba(45, 53, 97, 0.85) 50%, rgba(74, 88, 153, 0.8) 100%)",
            zIndex: 0,
          }}
        />
        <div className="container position-relative" style={{ zIndex: 1 }}>
          <div className="row align-items-center" style={{ minHeight: "600px", paddingTop: 120, paddingBottom: 80 }}>
            <div className="col-lg-6">
              <h1
                className="mb30"
                style={{
                  fontSize: "clamp(32px, 5vw, 56px)",
                  fontWeight: 700,
                  color: "#fff",
                  lineHeight: 1.2,
                }}
              >
                From front door to forecast – Your property investment journey starts here.
              </h1>
              <p
                className="mb30"
                style={{
                  fontSize: 18,
                  color: "rgba(255,255,255,0.9)",
                  lineHeight: 1.6,
                }}
              >
                Discover high-potential short stay properties with dynamic rental appraisals, on-site checklists, and integrated environmental risk data—powered by leading industry APIs.
              </p>
              <Link href="/register" className="ud-btn btn-white">
                Download Sample Report
                <i className="fal fa-arrow-right-long" />
              </Link>
            </div>
            <div className="col-lg-6 text-center d-none d-lg-block">
              <Image
                src="/images/hero-img.svg"
                alt="Property Investment"
                width={600}
                height={500}
                style={{ maxWidth: "100%", height: "auto" }}
              />
            </div>
          </div>
        </div>
      </section>
      {/* End Hero Section */}

      {/* Revenue Section */}
      <section className="pt100 pb100">
        <div className="container">
          <div className="row justify-content-center mb60">
            <div className="col-lg-8 text-center">
              <h2 className="title mb20" style={{ fontSize: 40, fontWeight: 700 }}>
                Increase Revenue With Data-Driven Pricing
              </h2>
              <p className="text fz16">
                From pinpointing a property to presenting investor-ready reports—our dashboard brings every step of the appraisal journey into one seamless workflow.
              </p>
            </div>
          </div>
          <div className="row align-items-center">
            <div className="col-lg-6 mb30">
              <Image
                src="/images/revenue-img.svg"
                alt="Revenue Analytics"
                width={600}
                height={500}
                style={{ maxWidth: "100%", height: "auto" }}
              />
            </div>
            <div className="col-lg-6">
              <h3 className="mb15" style={{ fontSize: 24, fontWeight: 600 }}>
                Dynamic Pricing
              </h3>
              <p className="text mb30">
                Now with Hyper Local Pulse (HLP), our smart pricing algorithm that uses hyper local market data to make accurate pricing decisions
              </p>
              <ul className="list-style-none p-0">
                {pricingFeatures.map((feature, index) => (
                  <li key={index} className="d-flex mb20">
                    <span
                      className="me-3 flex-shrink-0"
                      style={{
                        width: 24,
                        height: 24,
                        backgroundColor: "#e8f5e9",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <i className="fas fa-check" style={{ color: "#4caf50", fontSize: 12 }} />
                    </span>
                    <div>
                      <h6 className="mb5" style={{ fontSize: 16, fontWeight: 600 }}>
                        {feature.title}
                      </h6>
                      <p className="text mb-0 fz14">{feature.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
      {/* End Revenue Section */}

      {/* Trusted Industries */}
      <section className="bgc-dark pt50 pb50">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb20 mb-lg-0">
              <h3 className="text-white mb-0 text-center text-lg-start" style={{ fontSize: 22 }}>
                Powered by Trusted Industry Data Sources
              </h3>
            </div>
            <div className="col-lg-6">
              <div className="d-flex align-items-center justify-content-center justify-content-lg-end gap-4 flex-wrap">
                {trustedIndustries.map((industry) => (
                  <Image
                    key={industry.name}
                    src={industry.img}
                    alt={industry.name}
                    width={150}
                    height={50}
                    style={{ height: 40, width: "auto" }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* End Trusted Industries */}

      {/* Powerful Tools Section */}
      <section className="pt100 pb100 bgc-f7">
        <div className="container">
          <div className="row justify-content-center mb60">
            <div className="col-lg-8 text-center">
              <h2 className="title mb20" style={{ fontSize: 40, fontWeight: 700 }}>
                Powerful Tools. Clean, Modern Interface.
              </h2>
              <p className="text fz16">
                From pinpointing a property to presenting investor-ready reports—our dashboard brings every step of the appraisal journey into one seamless workflow.
              </p>
            </div>
          </div>
          <div className="row align-items-center">
            <div className="col-lg-6 mb30">
              <div className="d-flex flex-column gap-4">
                {toolFeatures.map((feature, index) => (
                  <div
                    key={index}
                    className="p30 bgc-white bdrs12"
                    style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
                  >
                    <h4 className="mb15" style={{ fontSize: 20, fontWeight: 600 }}>
                      <i className={`${feature.icon} me-2`} style={{ color: "#eb6753" }} />
                      {feature.title}
                    </h4>
                    <p className="text mb-0">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-lg-6 text-center">
              <Image
                src="/images/modernimg.svg"
                alt="Modern Interface"
                width={600}
                height={500}
                style={{ maxWidth: "100%", height: "auto" }}
              />
            </div>
          </div>
        </div>
      </section>
      {/* End Powerful Tools Section */}

      {/* Why Use Our Platform */}
      <section className="pt100 pb100">
        <div className="container">
          <div className="row justify-content-center mb60">
            <div className="col-lg-8 text-center">
              <h2 className="title" style={{ fontSize: 40, fontWeight: 700 }}>
                Why Use Our Platform
              </h2>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-md-6 col-lg-5 mb30">
              <div
                className="p30 bgc-white bdrs12 h-100"
                style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
              >
                <h4 className="mb20" style={{ color: "#eb6753", fontSize: 20, fontWeight: 600 }}>
                  With Our Platform
                </h4>
                <ul className="list-style-none p-0 mb-0">
                  {platformComparison.withPlatform.map((item, index) => (
                    <li key={index} className="d-flex align-items-center mb15">
                      <span
                        className="me-3 flex-shrink-0"
                        style={{
                          width: 24,
                          height: 24,
                          backgroundColor: "#e8f5e9",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <i className="fas fa-check" style={{ color: "#4caf50", fontSize: 12 }} />
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="col-md-6 col-lg-5 mb30">
              <div
                className="p30 bgc-white bdrs12 h-100"
                style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
              >
                <h4 className="mb20" style={{ color: "#eb6753", fontSize: 20, fontWeight: 600 }}>
                  Without Our Platform
                </h4>
                <ul className="list-style-none p-0 mb-0">
                  {platformComparison.withoutPlatform.map((item, index) => (
                    <li key={index} className="d-flex align-items-center mb15">
                      <span
                        className="me-3 flex-shrink-0"
                        style={{
                          width: 24,
                          height: 24,
                          backgroundColor: "#ffebee",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <i className="fas fa-times" style={{ color: "#f44336", fontSize: 12 }} />
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* End Why Use Our Platform */}

      {/* Testimonials */}
      <section className="pt100 pb100 bgc-thm">
        <div className="container">
          <div className="row justify-content-center mb60">
            <div className="col-lg-8 text-center">
              <h2 className="title text-white" style={{ fontSize: 40, fontWeight: 700 }}>
                Testimonials
              </h2>
            </div>
          </div>
          <div className="row">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="col-md-4 mb30">
                <div
                  className="p30 bgc-white bdrs12 h-100"
                  style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }}
                >
                  <div className="d-flex align-items-center mb20">
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      width={48}
                      height={48}
                      className="bdrs50 me-3"
                    />
                    <div>
                      <h6 className="mb5" style={{ fontWeight: 600 }}>
                        {testimonial.name}
                      </h6>
                      <div className="d-flex gap-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <i
                            key={i}
                            className="fas fa-star"
                            style={{ color: "#fbbf24", fontSize: 12 }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text mb-0" style={{ lineHeight: 1.6 }}>
                    &ldquo;{testimonial.comment}&rdquo;
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* End Testimonials */}

      {/* Pricing Section */}
      <section className="pt100 pb100" id="pricing">
        <div className="container">
          <div className="row justify-content-center mb60">
            <div className="col-lg-8 text-center">
              <h2 className="title mb20" style={{ fontSize: 40, fontWeight: 700 }}>
                Simple Pricing for Powerful Insights.
              </h2>
              <p className="text fz18">
                Whether you&apos;re a solo agent or managing multiple clients, our plans scale with your needs.
              </p>
            </div>
          </div>
          <div className="row">
            {pricingPlans.map((plan, index) => (
              <div key={index} className="col-md-4 mb30">
                <div
                  className={`p30 bgc-white bdrs12 h-100 d-flex flex-column ${
                    plan.isPopular ? "border-thm" : ""
                  }`}
                  style={{
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    border: plan.isPopular ? "2px solid #eb6753" : "1px solid #eee",
                  }}
                >
                  <div className="mb30">
                    <h6 className="mb15" style={{ fontWeight: 600 }}>
                      {plan.type}
                    </h6>
                    <div className="d-flex align-items-baseline">
                      <span style={{ color: "#eb6753", fontSize: 14, fontWeight: 600 }}>
                        {plan.currency}
                      </span>
                      <span
                        style={{ color: "#eb6753", fontSize: 40, fontWeight: 700, marginLeft: 4 }}
                      >
                        {plan.price}
                      </span>
                      <span className="text">{plan.period}</span>
                    </div>
                  </div>
                  <div className="flex-grow-1">
                    <h6 className="mb15" style={{ fontWeight: 600 }}>
                      What&apos;s Included:
                    </h6>
                    <ul className="list-style-none p-0 mb30">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="d-flex align-items-center mb10 text fz14">
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
                            <i className="fas fa-check" style={{ color: "#4caf50", fontSize: 10 }} />
                          </span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Link
                    href="/register"
                    className={`ud-btn w-100 ${plan.isPopular ? "btn-thm" : "btn-white2"}`}
                  >
                    {plan.buttonLabel}
                    <i className="fal fa-arrow-right-long" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* End Pricing Section */}

      {/* FAQ Section */}
      <section className="pt100 pb100 bgc-f7">
        <div className="container">
          <div className="row justify-content-center mb60">
            <div className="col-lg-8 text-center">
              <h2 className="title" style={{ fontSize: 40, fontWeight: 700 }}>
                Frequently Asked Questions
              </h2>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="accordion" id="faqAccordion">
                {faqItems.map((item, index) => (
                  <div
                    key={index}
                    className="accordion-item mb20 bgc-white bdrs12 overflow-hidden"
                    style={{ border: "1px solid #eee" }}
                  >
                    <h2 className="accordion-header">
                      <button
                        className="accordion-button collapsed fw600"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#faq${index}`}
                        aria-expanded="false"
                        style={{ fontSize: 16 }}
                      >
                        {item.question}
                      </button>
                    </h2>
                    <div
                      id={`faq${index}`}
                      className="accordion-collapse collapse"
                      data-bs-parent="#faqAccordion"
                    >
                      <div className="accordion-body text">{item.answer}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* End FAQ Section */}

      {/* Footer */}
      <section className="footer-style1 at-home4 pt60 pb-0">
        <Footer />
      </section>
      {/* End Footer */}
    </>
  );
};

export default Home_V4;
