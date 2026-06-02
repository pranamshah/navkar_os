"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export default function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", company: "", email: "", phone: "", message: "" });

  const handle = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="contact" className="px-8 lg:px-16 py-32" style={{ background: "#ffffff" }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-20 items-start">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest mb-5" style={{ color: "#D4AF37" }}>
              Get in Touch
            </p>
            <h2
              className="mb-6"
              style={{
                fontFamily: "'EB Garamond', Georgia, serif",
                fontSize: "clamp(32px, 4vw, 48px)",
                fontWeight: 400,
                color: "#1a1c1c",
                letterSpacing: "-0.02em",
                lineHeight: 1.15,
              }}
            >
              Let's Talk
              <br />
              Logistics.
            </h2>
            <p className="mb-12" style={{ fontSize: "16px", color: "#4c4546", lineHeight: 1.7, fontWeight: 300 }}>
              Whether you want a demo, have a question about DocAI, or want to
              discuss a custom enterprise deployment — our team responds within
              4 working hours.
            </p>

            <div className="space-y-6">
              {[
                { label: "Email", value: "hello@navkaros.in", icon: "mail" },
                { label: "Phone", value: "+91 98765 43210", icon: "phone" },
                { label: "Office", value: "BKC, Bandra East, Mumbai — 400051", icon: "location_on" },
                { label: "Support Hours", value: "Mon–Sat, 9am–7pm IST", icon: "schedule" },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <span
                    className="material-symbols-outlined mt-0.5 flex-shrink-0"
                    style={{ fontSize: "18px", color: "#D4AF37", fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24" }}
                  >
                    {item.icon}
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest mb-0.5" style={{ color: "#7e7576" }}>
                      {item.label}
                    </p>
                    <p style={{ fontSize: "15px", color: "#1a1c1c" }}>{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick links */}
            <div className="mt-12 pt-10" style={{ borderTop: "0.5px solid rgba(0,0,0,0.1)" }}>
              <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#7e7576" }}>
                Quick Actions
              </p>
              <div className="flex flex-wrap gap-3">
                {["Book a Demo", "Pricing Questions", "Technical Support", "Partner with Us"].map((action) => (
                  <button
                    key={action}
                    className="px-4 py-2 text-xs font-semibold uppercase tracking-widest border transition-all duration-200 cursor-none"
                    style={{ borderColor: "rgba(0,0,0,0.15)", color: "#1a1c1c", borderWidth: "0.5px" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#1a1c1c";
                      e.currentTarget.style.color = "#fff";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "#1a1c1c";
                    }}
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="p-10 lg:p-12"
            style={{
              background: "#f9f9f9",
              boxShadow: "0 20px 40px rgba(0,0,0,0.04)",
            }}
          >
            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full py-16 text-center gap-4">
                <span
                  className="material-symbols-outlined text-5xl"
                  style={{ color: "#D4AF37", fontVariationSettings: "'FILL' 0, 'wght' 200, 'GRAD' 0, 'opsz' 48" }}
                >
                  check_circle
                </span>
                <h3
                  style={{
                    fontFamily: "'EB Garamond', Georgia, serif",
                    fontSize: "28px",
                    color: "#1a1c1c",
                  }}
                >
                  Message Received.
                </h3>
                <p style={{ fontSize: "15px", color: "#4c4546" }}>
                  We'll get back to you within 4 working hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handle} className="flex flex-col gap-7">
                <h3
                  className="mb-2"
                  style={{
                    fontFamily: "'EB Garamond', Georgia, serif",
                    fontSize: "26px",
                    fontWeight: 400,
                    color: "#1a1c1c",
                  }}
                >
                  Send a Message
                </h3>

                {[
                  { key: "name", label: "Full Name", type: "text", placeholder: "Rajesh Mehta" },
                  { key: "company", label: "Company", type: "text", placeholder: "Mehta Freight Solutions" },
                  { key: "email", label: "Email Address", type: "email", placeholder: "rajesh@mehtafreight.com" },
                  { key: "phone", label: "Phone Number", type: "tel", placeholder: "+91 98765 43210" },
                ].map((field) => (
                  <div key={field.key} className="flex flex-col gap-1.5">
                    <label
                      className="text-xs font-semibold uppercase tracking-widest"
                      style={{ color: "#7e7576" }}
                    >
                      {field.label}
                    </label>
                    <input
                      required
                      type={field.type}
                      placeholder={field.placeholder}
                      value={form[field.key as keyof typeof form]}
                      onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                      className="outline-none bg-transparent pb-2 text-sm transition-colors duration-200"
                      style={{
                        borderBottom: "0.5px solid rgba(0,0,0,0.2)",
                        color: "#1a1c1c",
                        fontSize: "15px",
                      }}
                      onFocus={(e) => (e.currentTarget.style.borderBottomColor = "#D4AF37")}
                      onBlur={(e) => (e.currentTarget.style.borderBottomColor = "rgba(0,0,0,0.2)")}
                    />
                  </div>
                ))}

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#7e7576" }}>
                    Message
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Tell us about your business and what you're looking for..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="outline-none bg-transparent pb-2 text-sm resize-none transition-colors duration-200"
                    style={{
                      borderBottom: "0.5px solid rgba(0,0,0,0.2)",
                      color: "#1a1c1c",
                      fontSize: "15px",
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderBottomColor = "#D4AF37")}
                    onBlur={(e) => (e.currentTarget.style.borderBottomColor = "rgba(0,0,0,0.2)")}
                  />
                </div>

                <button
                  type="submit"
                  className="px-10 py-4 text-xs font-semibold uppercase tracking-widest mt-2 transition-all duration-200 cursor-none"
                  style={{ background: "#1a1c1c", color: "#fff" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#D4AF37";
                    e.currentTarget.style.color = "#1a1c1c";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#1a1c1c";
                    e.currentTarget.style.color = "#fff";
                  }}
                >
                  Send Message
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
