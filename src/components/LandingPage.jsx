import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, Users, BookOpen, ShieldCheck, Star, DollarSign } from "lucide-react";
import { motion } from "framer-motion";
import dashImage from "../assets/images/dash.png";

function LandingPage() {
  const navigate = useNavigate();
  const [showContactForm, setShowContactForm] = useState(false);
  const [showSupportForm, setShowSupportForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    school: "",
    plan: "",
    message: "",
  });
  const [supportForm, setSupportForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [supportSubmitted, setSupportSubmitted] = useState(false);

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSupportFormChange = (e) => {
    setSupportForm({ ...supportForm, [e.target.name]: e.target.value });
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setShowContactForm(false);
      setSubmitted(false);
      setForm({ name: "", email: "", school: "", plan: "", message: "" });
    }, 2000);
  };

  const handleSupportSubmit = (e) => {
    e.preventDefault();
    setSupportSubmitted(true);
    setTimeout(() => {
      setShowSupportForm(false);
      setSupportSubmitted(false);
      setSupportForm({ name: "", email: "", message: "" });
    }, 2000);
  };

  // Animation variants
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: "easeOut" } },
  };

  const fadeLeft = {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0, transition: { duration: 1, ease: "easeOut" } },
  };

  const fadeRight = {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0, transition: { duration: 1, ease: "easeOut" } },
  };

  return (
    <div className="min-h-screen font-quicksand bg-gray-50">
      {/* Navbar */}
      <nav className="bg-system-theme px-4 md:px-6 py-4 fixed w-full z-50 bg-opacity-95 backdrop-blur-sm shadow">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <GraduationCap className="text-white" size={28} />
            <span className="text-xl md:text-2xl font-bold text-white tracking-tight">Schol Portal</span>
          </div>
          <div className="hidden md:flex items-center gap-6 md:gap-8 text-white">
            <a href="#" className="hover:text-system-theme/80 transition-colors">Home</a>
            <a href="#features" className="hover:text-system-theme/80 transition-colors">Features</a>
            <a href="#solutions" className="hover:text-system-theme/80 transition-colors">Solutions</a>
            <a href="#contact" className="hover:text-system-theme/80 transition-colors">Contact</a>
          </div>
          <button
            onClick={() => navigate("/AuthPage")}
            className="px-4 md:px-6 py-2 bg-white text-system-theme rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow text-sm md:text-base"
          >
            Login / Register
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.section
        className="bg-system-theme px-4 md:px-6 pt-28 md:pt-32 pb-20 md:pb-32 relative overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.7 }}
        variants={fadeUp}
      >
        <div className="absolute top-16 md:top-24 right-4 md:right-24 opacity-30 pointer-events-none">
          <Star className="text-white" size={40} />
        </div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            className="inline-block px-3 md:px-4 py-1 bg-white/10 rounded-full text-white text-xs md:text-sm mb-4 md:mb-6 tracking-wide"
            variants={fadeLeft}
          >
            Empowering Modern Education
          </motion.div>
          <motion.h1
            className="text-2xl md:text-6xl font-bold text-white mb-4 md:mb-6"
            variants={fadeUp}
          >
            The All-in-One <span className="text-yellow-300">School Portal</span>
          </motion.h1>
          <motion.p
            className="text-base md:text-xl text-blue-100 mb-6 md:mb-8 max-w-xl md:max-w-2xl mx-auto"
            variants={fadeRight}
          >
            Streamline administration, connect your community, and unlock student potential with our next-generation school management platform.
          </motion.p>
          <motion.button
            onClick={() => navigate("/AuthPage")}
            className="px-6 md:px-8 py-2 md:py-3 bg-white text-system-theme rounded-lg text-base md:text-lg font-semibold hover:bg-gray-100 transition-all hover:scale-105 shadow"
            variants={fadeUp}
          >
            Get Started Free
          </motion.button>
          <motion.div className="mt-10 md:mt-16 flex flex-col items-center" variants={fadeUp}>
            <img
              src={dashImage}
              alt="Dashboard Preview"
              className="rounded-xl shadow-2xl border-4 border-system-theme/20 w-full max-w-xs md:max-w-3xl transition-all duration-700 animate-fade-in-up"
              style={{ background: "white" }}
            />
            <span className="mt-2 text-white/70 text-xs md:text-sm italic">Actual dashboard view</span>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        id="features"
        className="py-12 md:py-20 bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.7 }}
        variants={fadeUp}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <motion.h2
            className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12 text-system-theme"
            variants={fadeUp}
          >
            Why Choose Schol Portal?
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
            <motion.div className="bg-gray-50 rounded-xl p-6 md:p-8 shadow hover:shadow-lg transition" variants={fadeLeft}>
              <Users className="text-system-theme mb-4" size={32} />
              <h3 className="font-semibold text-base md:text-lg mb-2">Unified Community</h3>
              <p className="text-gray-600 text-sm md:text-base">Connect students, teachers, and parents in one secure, collaborative environment.</p>
            </motion.div>
            <motion.div className="bg-gray-50 rounded-xl p-6 md:p-8 shadow hover:shadow-lg transition" variants={fadeUp}>
              <BookOpen className="text-system-theme mb-4" size={32} />
              <h3 className="font-semibold text-base md:text-lg mb-2">Smart Academics</h3>
              <p className="text-gray-600 text-sm md:text-base">Automate attendance, grading, and scheduling for a seamless academic experience.</p>
            </motion.div>
            <motion.div className="bg-gray-50 rounded-xl p-6 md:p-8 shadow hover:shadow-lg transition" variants={fadeRight}>
              <ShieldCheck className="text-system-theme mb-4" size={32} />
              <h3 className="font-semibold text-base md:text-lg mb-2">Data Security</h3>
              <p className="text-gray-600 text-sm md:text-base">Your data is protected with enterprise-grade security and privacy controls.</p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Solutions Section */}
      <motion.section
        id="solutions"
        className="py-12 md:py-20 bg-gray-50"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.7 }}
        variants={fadeUp}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <motion.h2
            className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12 text-system-theme"
            variants={fadeUp}
          >
            Solutions for Every School
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
            <motion.div className="bg-white rounded-xl p-6 md:p-8 shadow hover:shadow-lg transition" variants={fadeLeft}>
              <h3 className="font-semibold text-base md:text-lg mb-2 text-system-theme">For Administrators</h3>
              <p className="text-gray-600 text-sm md:text-base">Manage admissions, staff, and finances with powerful dashboards and reports.</p>
            </motion.div>
            <motion.div className="bg-white rounded-xl p-6 md:p-8 shadow hover:shadow-lg transition" variants={fadeUp}>
              <h3 className="font-semibold text-base md:text-lg mb-2 text-system-theme">For Teachers</h3>
              <p className="text-gray-600 text-sm md:text-base">Plan lessons, track progress, and communicate with parents—all in one place.</p>
            </motion.div>
            <motion.div className="bg-white rounded-xl p-6 md:p-8 shadow hover:shadow-lg transition" variants={fadeRight}>
              <h3 className="font-semibold text-base md:text-lg mb-2 text-system-theme">For Students & Parents</h3>
              <p className="text-gray-600 text-sm md:text-base">Access grades, assignments, and school news anytime, anywhere.</p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Subscription Plans Section */}
      <motion.section
        id="pricing"
        className="py-12 md:py-20 bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.7 }}
        variants={fadeUp}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <motion.h2
            className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12 text-system-theme"
            variants={fadeUp}
          >
            Subscription Plans
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
            {/* Free Plan */}
            <motion.div className="bg-gray-50 rounded-xl p-6 md:p-8 shadow hover:shadow-lg transition flex flex-col items-center" variants={fadeLeft}>
              <DollarSign className="text-system-theme mb-4" size={32} />
              <h3 className="font-semibold text-base md:text-xl mb-2">Free</h3>
              <p className="text-2xl md:text-3xl font-bold mb-2 text-system-theme">$0</p>
              <ul className="text-gray-600 mb-6 space-y-2 text-center text-sm md:text-base">
                <li>Basic school management</li>
                <li>Unlimited students</li>
                <li>Email support</li>
              </ul>
              <button
                onClick={() => navigate("/AuthPage")}
                className="px-4 md:px-6 py-2 bg-system-theme text-white rounded-lg font-semibold hover:bg-system-theme/90 transition-colors shadow text-sm md:text-base"
              >
                Get Started
              </button>
            </motion.div>
            {/* Standard Plan */}
            <motion.div className="bg-yellow-100 border-2 border-yellow-300 rounded-xl p-6 md:p-8 shadow-lg scale-105 flex flex-col items-center" variants={fadeUp}>
              <DollarSign className="text-yellow-600 mb-4" size={32} />
              <h3 className="font-semibold text-base md:text-xl mb-2">Standard</h3>
              <p className="text-2xl md:text-3xl font-bold mb-2 text-yellow-700">$4,999<span className="text-base font-normal text-gray-600">/mo</span></p>
              <ul className="text-gray-700 mb-6 space-y-2 text-center text-sm md:text-base">
                <li>All Free features</li>
                <li>Advanced analytics</li>
                <li>Priority support</li>
                <li>Custom branding</li>
              </ul>
              <button
                onClick={() => {
                  setShowContactForm(true);
                  setForm({ ...form, plan: "Standard" });
                }}
                className="px-4 md:px-6 py-2 bg-yellow-500 text-white rounded-lg font-semibold hover:bg-yellow-600 transition-colors shadow text-sm md:text-base"
              >
                Contact Admin to Subscribe
              </button>
            </motion.div>
            {/* Enterprise Plan */}
            <motion.div className="bg-gray-50 rounded-xl p-6 md:p-8 shadow hover:shadow-lg transition flex flex-col items-center" variants={fadeRight}>
              <DollarSign className="text-system-theme mb-4" size={32} />
              <h3 className="font-semibold text-base md:text-xl mb-2">Enterprise</h3>
              <p className="text-2xl md:text-3xl font-bold mb-2 text-system-theme">Contact Us</p>
              <ul className="text-gray-600 mb-6 space-y-2 text-center text-sm md:text-base">
                <li>All Standard features</li>
                <li>Dedicated account manager</li>
                <li>Custom integrations</li>
                <li>Onboarding & training</li>
              </ul>
              <button
                onClick={() => {
                  setShowContactForm(true);
                  setForm({ ...form, plan: "Enterprise" });
                }}
                className="px-4 md:px-6 py-2 bg-system-theme text-white rounded-lg font-semibold hover:bg-system-theme/90 transition-colors shadow text-sm md:text-base"
              >
                Contact Admin to Subscribe
              </button>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Contact Form Modal for Subscription */}
      {showContactForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-2">
          <div className="bg-white rounded-xl shadow-xl p-4 md:p-8 w-full max-w-lg relative">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl"
              onClick={() => setShowContactForm(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <h3 className="text-2xl font-bold mb-4 text-system-theme">Contact Admin to Subscribe</h3>
            {submitted ? (
              <div className="text-center py-8">
                <p className="text-lg text-system-theme font-semibold mb-2">Thank you!</p>
                <p className="text-gray-600">Your request has been received. The admin will contact you soon with payment instructions.</p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleFormChange}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-system-theme focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleFormChange}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-system-theme focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">School Name</label>
                  <input
                    type="text"
                    name="school"
                    value={form.school}
                    onChange={handleFormChange}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-system-theme focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Plan</label>
                  <select
                    name="plan"
                    value={form.plan}
                    onChange={handleFormChange}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-700 focus:ring-2 focus:ring-system-theme focus:outline-none"
                  >
                    <option value="">Select a plan</option>
                    <option value="Standard">Standard</option>
                    <option value="Enterprise">Enterprise</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleFormChange}
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-system-theme focus:outline-none"
                    placeholder="Any additional info (optional)"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-system-theme text-white rounded-lg font-semibold hover:bg-system-theme/90 transition-colors shadow"
                >
                  Send Request
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Support Form Modal */}
      {showSupportForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-2">
          <div className="bg-white rounded-xl shadow-xl p-4 md:p-8 w-full max-w-lg relative">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl"
              onClick={() => setShowSupportForm(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <h3 className="text-2xl font-bold mb-4 text-system-theme">Contact Support</h3>
            {supportSubmitted ? (
              <div className="text-center py-8">
                <p className="text-lg text-system-theme font-semibold mb-2">Thank you!</p>
                <p className="text-gray-600">Your message has been received. Our support team will get back to you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSupportSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={supportForm.name}
                    onChange={handleSupportFormChange}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-system-theme focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={supportForm.email}
                    onChange={handleSupportFormChange}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-system-theme focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    name="message"
                    value={supportForm.message}
                    onChange={handleSupportFormChange}
                    rows={4}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-system-theme focus:outline-none"
                    placeholder="How can we help you?"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-system-theme text-white rounded-lg font-semibold hover:bg-system-theme/90 transition-colors shadow"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Call to Action */}
      <section id="contact" className="py-12 md:py-20 bg-system-theme text-white">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center flex flex-col md:flex-row gap-6 md:gap-4 justify-center items-center">
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Transform Your School?</h2>
            <p className="mb-6 md:mb-8 text-base md:text-lg">Contact us for a personalized demo or sign up to get started instantly.</p>
            <button
              onClick={() => setShowContactForm(true)}
              className="px-6 md:px-8 py-2 md:py-3 bg-white text-system-theme rounded-lg text-base md:text-lg font-semibold hover:bg-gray-100 transition-all hover:scale-105 shadow mb-4 md:mb-0 md:mr-4 w-full md:w-auto"
            >
              Contact Admin
            </button>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Need Support?</h2>
            <p className="mb-6 md:mb-8 text-base md:text-lg">Have questions or need help? Reach out to our support team.</p>
            <button
              onClick={() => setShowSupportForm(true)}
              className="px-6 md:px-8 py-2 md:py-3 bg-yellow-300 text-system-theme rounded-lg text-base md:text-lg font-semibold hover:bg-yellow-400 transition-all hover:scale-105 shadow w-full md:w-auto"
            >
              Contact Support
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-system-theme text-white py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8 mb-8">
            <div>
              <h3 className="font-bold mb-4">Schol Portal</h3>
              <p className="text-sm mb-4">
                The modern platform for smarter, simpler school management.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-yellow-300 transition-colors">Home</a>
                </li>
                <li>
                  <a href="#features" className="hover:text-yellow-300 transition-colors">Features</a>
                </li>
                <li>
                  <a href="#solutions" className="hover:text-yellow-300 transition-colors">Solutions</a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Contact</h3>
              <ul className="space-y-2">
                <li>
                  <a href="mailto:info@scholportal.com" className="hover:text-yellow-300 transition-colors">
                    info@scholportal.com
                  </a>
                </li>
                <li>
                  <span>+1 234 567 890</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Newsletter</h3>
              <p className="text-sm mb-4">
                Subscribe for updates and exclusive offers.
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 rounded-lg bg-white/10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition-all"
                />
                <button className="px-4 py-2 bg-yellow-300 text-system-theme rounded-lg hover:bg-yellow-400 transition-all hover:scale-105">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-sm">
            <p>©2024 Schol Portal. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
