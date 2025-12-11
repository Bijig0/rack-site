"use client";

import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import emailjs from "@emailjs/browser";

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

// EmailJS configuration - set these in your .env.local file
const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "";
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "";
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "";

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  useEffect(() => {
    // Initialize EmailJS
    if (EMAILJS_PUBLIC_KEY) {
      emailjs.init(EMAILJS_PUBLIC_KEY);
    }
  }, []);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Check if EmailJS is configured
      if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
        console.warn("EmailJS not configured, logging form data instead");
        console.log("Form submitted:", data);
        setSubmitSuccess(true);
        reset();
        setTimeout(() => setSubmitSuccess(false), 5000);
        return;
      }

      // Send email using EmailJS
      const templateParams = {
        from_name: `${data.firstName} ${data.lastName}`,
        from_email: data.email,
        phone: data.phone || "Not provided",
        subject: data.subject,
        message: data.message,
        to_name: "Rack Team",
      };

      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams
      );

      setSubmitSuccess(true);
      reset();
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitError("Failed to send message. Please try again or email us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="row">
        {/* First Name */}
        <div className="col-md-6 mb20">
          <label className="form-label fz14 fw500 mb10">First Name *</label>
          <input
            type="text"
            className={`form-control ${errors.firstName ? "is-invalid" : ""}`}
            placeholder="Enter your first name"
            {...register("firstName", {
              required: "First name is required",
              minLength: { value: 2, message: "First name must be at least 2 characters" },
            })}
            style={{
              padding: "12px 16px",
              borderRadius: 8,
              border: errors.firstName ? "1px solid #dc3545" : "1px solid #e0e0e0",
              fontSize: 14,
            }}
          />
          {errors.firstName && (
            <div className="invalid-feedback d-block fz12">
              {errors.firstName.message}
            </div>
          )}
        </div>

        {/* Last Name */}
        <div className="col-md-6 mb20">
          <label className="form-label fz14 fw500 mb10">Last Name *</label>
          <input
            type="text"
            className={`form-control ${errors.lastName ? "is-invalid" : ""}`}
            placeholder="Enter your last name"
            {...register("lastName", {
              required: "Last name is required",
              minLength: { value: 2, message: "Last name must be at least 2 characters" },
            })}
            style={{
              padding: "12px 16px",
              borderRadius: 8,
              border: errors.lastName ? "1px solid #dc3545" : "1px solid #e0e0e0",
              fontSize: 14,
            }}
          />
          {errors.lastName && (
            <div className="invalid-feedback d-block fz12">
              {errors.lastName.message}
            </div>
          )}
        </div>

        {/* Email */}
        <div className="col-md-6 mb20">
          <label className="form-label fz14 fw500 mb10">Email Address *</label>
          <input
            type="email"
            className={`form-control ${errors.email ? "is-invalid" : ""}`}
            placeholder="Enter your email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
            style={{
              padding: "12px 16px",
              borderRadius: 8,
              border: errors.email ? "1px solid #dc3545" : "1px solid #e0e0e0",
              fontSize: 14,
            }}
          />
          {errors.email && (
            <div className="invalid-feedback d-block fz12">
              {errors.email.message}
            </div>
          )}
        </div>

        {/* Phone */}
        <div className="col-md-6 mb20">
          <label className="form-label fz14 fw500 mb10">Phone Number</label>
          <input
            type="tel"
            className="form-control"
            placeholder="Enter your phone number"
            {...register("phone")}
            style={{
              padding: "12px 16px",
              borderRadius: 8,
              border: "1px solid #e0e0e0",
              fontSize: 14,
            }}
          />
        </div>

        {/* Subject */}
        <div className="col-12 mb20">
          <label className="form-label fz14 fw500 mb10">Subject *</label>
          <select
            className={`form-select ${errors.subject ? "is-invalid" : ""}`}
            {...register("subject", { required: "Please select a subject" })}
            style={{
              padding: "12px 16px",
              borderRadius: 8,
              border: errors.subject ? "1px solid #dc3545" : "1px solid #e0e0e0",
              fontSize: 14,
            }}
          >
            <option value="">Select a subject</option>
            <option value="general">General Inquiry</option>
            <option value="support">Technical Support</option>
            <option value="sales">Sales & Pricing</option>
            <option value="partnership">Partnership Opportunities</option>
            <option value="feedback">Feedback</option>
            <option value="other">Other</option>
          </select>
          {errors.subject && (
            <div className="invalid-feedback d-block fz12">
              {errors.subject.message}
            </div>
          )}
        </div>

        {/* Message */}
        <div className="col-12 mb25">
          <label className="form-label fz14 fw500 mb10">Message *</label>
          <textarea
            className={`form-control ${errors.message ? "is-invalid" : ""}`}
            rows={5}
            placeholder="How can we help you?"
            {...register("message", {
              required: "Message is required",
              minLength: { value: 10, message: "Message must be at least 10 characters" },
            })}
            style={{
              padding: "12px 16px",
              borderRadius: 8,
              border: errors.message ? "1px solid #dc3545" : "1px solid #e0e0e0",
              fontSize: 14,
              resize: "vertical",
            }}
          />
          {errors.message && (
            <div className="invalid-feedback d-block fz12">
              {errors.message.message}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="col-12">
          {submitSuccess && (
            <div
              className="alert mb20 d-flex align-items-center"
              style={{
                backgroundColor: "#e8f5e9",
                color: "#2e7d32",
                borderRadius: 8,
                padding: "12px 16px",
              }}
            >
              <i className="fas fa-check-circle me-2" />
              Thank you! Your message has been sent successfully. We&apos;ll get back to you soon.
            </div>
          )}

          {submitError && (
            <div
              className="alert mb20 d-flex align-items-center"
              style={{
                backgroundColor: "#ffebee",
                color: "#c62828",
                borderRadius: 8,
                padding: "12px 16px",
              }}
            >
              <i className="fas fa-exclamation-circle me-2" />
              {submitError}
            </div>
          )}

          <button
            type="submit"
            className="ud-btn btn-thm"
            disabled={isSubmitting}
            style={{ padding: "14px 30px" }}
          >
            {isSubmitting ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                />
                Sending...
              </>
            ) : (
              <>
                Send Message
                <i className="fal fa-arrow-right-long ms-2" />
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
