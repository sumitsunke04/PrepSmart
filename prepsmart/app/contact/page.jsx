"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { FaPaperPlane, FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaChevronDown } from 'react-icons/fa';

const page = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="bg-gray-950 text-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-b from-blue-900/30 to-gray-950">
        <div className="absolute inset-0 bg-[url('/assets/contact-bg.jpg')] bg-cover bg-center opacity-20" />
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
              Contact Us
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              We'd love to hear from you! Reach out for support, partnerships, or just to say hello.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form + Info Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={fadeIn}
            viewport={{ once: true }}
            className="bg-gray-900 p-8 rounded-xl border border-gray-800 shadow-xl"
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <FaPaperPlane className="text-blue-400" />
              Send us a message
            </h2>
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-300">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-300">
                  Your Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="name@company.com"
                  required
                />
              </div>
              <div>
                <label htmlFor="subject" className="block mb-2 text-sm font-medium text-gray-300">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="How can we help?"
                  required
                />
              </div>
              <div>
                <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-300">
                  Your Message
                </label>
                <textarea
                  id="message"
                  rows="5"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="Your message here..."
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all transform hover:scale-105 flex items-center gap-2"
              >
                <FaPaperPlane />
                Send Message
              </button>
            </form>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={fadeIn}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="bg-gray-900 p-8 rounded-xl border border-gray-800 shadow-xl">
              <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
              
              <div className="space-y-6">
                {/* <div className="flex items-start gap-4"> */}
                  {/* <div className="p-3 bg-blue-900/20 rounded-lg text-blue-400">
                    <FaMapMarkerAlt size={20} />
                  </div> */}
                  {/* <div>
                    <h3 className="font-semibold text-lg">Our Office</h3>
                    <p className="text-gray-400">123 Tech Park, Innovation Road, San Francisco, CA 94107</p>
                  </div> */}
                {/* </div> */}

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-900/20 rounded-lg text-blue-400">
                    <FaPhone size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Phone</h3>
                    <p className="text-gray-400">+1 (555) 123-4567</p>
                    <p className="text-gray-400">+1 (555) 987-6543 (Support)</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-900/20 rounded-lg text-blue-400">
                    <FaEnvelope size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Email</h3>
                    <p className="text-gray-400">info@prepsmart.com</p>
                    <p className="text-gray-400">support@prepsmart.com</p>
                  </div>
                </div>

                {/* <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-900/20 rounded-lg text-blue-400">
                    <FaClock size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Working Hours</h3>
                    <p className="text-gray-400">Monday - Friday: 9:00 AM - 6:00 PM</p>
                    <p className="text-gray-400">Saturday: 10:00 AM - 4:00 PM</p>
                  </div>
                </div> */}
              </div>
            </div>

            <div className="bg-gray-900 p-8 rounded-xl border border-gray-800 shadow-xl">
              <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
              <div className="space-y-4">
                <details className="group border-b border-gray-800 pb-4">
                  <summary className="flex justify-between items-center cursor-pointer">
                    <span className="font-medium text-gray-300 group-hover:text-blue-400 transition-colors">
                      How long does it take to get a response?
                    </span>
                    <span className="text-blue-400 group-open:rotate-180 transition-transform">
                      <FaChevronDown />
                    </span>
                  </summary>
                  <p className="mt-2 text-gray-400">
                    We typically respond within 24 hours on business days. For urgent matters, please call our support line.
                  </p>
                </details>
                <details className="group border-b border-gray-800 pb-4">
                  <summary className="flex justify-between items-center cursor-pointer">
                    <span className="font-medium text-gray-300 group-hover:text-blue-400 transition-colors">
                      Do you offer enterprise solutions?
                    </span>
                    <span className="text-blue-400 group-open:rotate-180 transition-transform">
                      <FaChevronDown />
                    </span>
                  </summary>
                  <p className="mt-2 text-gray-400">
                    Yes! We provide custom enterprise packages for organizations. Contact our sales team for more information.
                  </p>
                </details>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Map Section */}
      {/* <section className="py-16 px-4 bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={fadeIn}
            viewport={{ once: true }}
            className="rounded-xl overflow-hidden border border-gray-800 shadow-xl"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.325538011664!2d-122.4194156846823!3d37.77492997975938!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80859a6d00690021%3A0x4a501367f076adff!2sSan%20Francisco%2C%20CA!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              className="filter grayscale(50%) contrast(110%)"
            ></iframe>
          </motion.div>
        </div>
      </section> */}
    </div>
  );
};

export default page;