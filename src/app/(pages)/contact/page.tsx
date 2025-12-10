import DefaultHeader from "@/components/common/DefaultHeader";
import MobileMenu from "@/components/common/mobile-menu";
import Footer from "@/components/home/home-v4/footer";
import ContactForm from "./ContactForm";

export const metadata = {
  title: "Contact Us | Property Appraisal Portal",
};

const ContactPage = () => {
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
        className="breadcumb-section pt200 pb100"
        style={{
          background: "linear-gradient(135deg, #1a1f3c 0%, #2d3561 40%, #3d4785 70%, #4a5899 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Abstract geometric shapes */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 0,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -100,
              right: -50,
              width: 400,
              height: 400,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(235,103,83,0.12) 0%, transparent 70%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: -80,
              left: -30,
              width: 300,
              height: 300,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(74,88,153,0.25) 0%, transparent 70%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
              `,
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="container position-relative" style={{ zIndex: 1 }}>
          <div className="row">
            <div className="col-lg-8">
              <div className="breadcumb-style1">
                <h1 className="title text-white mb15" style={{ fontSize: 48, fontWeight: 700 }}>
                  Contact Us
                </h1>
                <p className="text-white-50 fz16 mb-0">
                  Have questions? We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* End Hero Section */}

      {/* Contact Section */}
      <section className="pt80 pb100">
        <div className="container">
          <div className="row">
            {/* Contact Info */}
            <div className="col-lg-4 mb30">
              <div className="h-100">
                <h4 className="mb30" style={{ fontWeight: 600 }}>Get in Touch</h4>

                <div className="d-flex mb25">
                  <div
                    className="flex-shrink-0 me-3 d-flex align-items-center justify-content-center"
                    style={{
                      width: 52,
                      height: 52,
                      backgroundColor: "#f5f5f5",
                      borderRadius: 12,
                    }}
                  >
                    <i className="fas fa-map-marker-alt" style={{ color: "#eb6753", fontSize: 20 }} />
                  </div>
                  <div>
                    <h6 className="mb5" style={{ fontWeight: 600 }}>Office Location</h6>
                    <p className="text mb-0 fz14">
                      123 Business Street<br />
                      Sydney, NSW 2000<br />
                      Australia
                    </p>
                  </div>
                </div>

                <div className="d-flex mb25">
                  <div
                    className="flex-shrink-0 me-3 d-flex align-items-center justify-content-center"
                    style={{
                      width: 52,
                      height: 52,
                      backgroundColor: "#f5f5f5",
                      borderRadius: 12,
                    }}
                  >
                    <i className="fas fa-envelope" style={{ color: "#eb6753", fontSize: 20 }} />
                  </div>
                  <div>
                    <h6 className="mb5" style={{ fontWeight: 600 }}>Email</h6>
                    <p className="text mb-0 fz14">
                      support@propertyappraisal.com<br />
                      sales@propertyappraisal.com
                    </p>
                  </div>
                </div>

                <div className="d-flex mb25">
                  <div
                    className="flex-shrink-0 me-3 d-flex align-items-center justify-content-center"
                    style={{
                      width: 52,
                      height: 52,
                      backgroundColor: "#f5f5f5",
                      borderRadius: 12,
                    }}
                  >
                    <i className="fas fa-phone-alt" style={{ color: "#eb6753", fontSize: 20 }} />
                  </div>
                  <div>
                    <h6 className="mb5" style={{ fontWeight: 600 }}>Phone</h6>
                    <p className="text mb-0 fz14">
                      +61 2 1234 5678<br />
                      Mon - Fri, 9am - 5pm AEST
                    </p>
                  </div>
                </div>

                <div className="d-flex">
                  <div
                    className="flex-shrink-0 me-3 d-flex align-items-center justify-content-center"
                    style={{
                      width: 52,
                      height: 52,
                      backgroundColor: "#f5f5f5",
                      borderRadius: 12,
                    }}
                  >
                    <i className="fas fa-clock" style={{ color: "#eb6753", fontSize: 20 }} />
                  </div>
                  <div>
                    <h6 className="mb5" style={{ fontWeight: 600 }}>Business Hours</h6>
                    <p className="text mb-0 fz14">
                      Monday - Friday: 9:00 AM - 5:00 PM<br />
                      Saturday - Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="col-lg-8">
              <div
                className="bgc-white p30 bdrs12"
                style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
              >
                <h4 className="mb25" style={{ fontWeight: 600 }}>Send Us a Message</h4>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* End Contact Section */}

      {/* Footer */}
      <section className="footer-style1 at-home4 pt60 pb-0">
        <Footer />
      </section>
      {/* End Footer */}
    </>
  );
};

export default ContactPage;
