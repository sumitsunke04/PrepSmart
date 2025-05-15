"use client";
import React, { useState, useEffect } from "react";
import Image from 'next/image';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FaChevronLeft, FaChevronRight, FaQuoteLeft, FaQuoteRight, FaStar, FaChevronDown } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const testimonials = [
  {
    quote: "PrepSmart transformed my interview preparation. The AI feedback was spot-on!",
    name: "Rahul S",
    role: "Software Engineer",
    rating: 5
  },
  {
    quote: "The mock interviews helped me build confidence. Highly recommend it!",
    name: "Ananya P",
    role: "Data Scientist",
    rating: 5
  },
  {
    quote: "I loved the coding challenges and instant feedback. A game-changer for job seekers!",
    name: "Vikram K",
    role: "Full Stack Developer",
    rating: 4
  },
  {
    quote: "The facial emotion detection feature gave me unique insights into my performance.",
    name: "Neha M",
    role: "AI Engineer",
    rating: 5
  },
];

const features = [
  {
    title: "AI Mock Interviews",
    description: "Simulate real interviews and receive AI-based feedback.",
    icon: "💬"
  },
  {
    title: "Facial Emotion Analysis",
    description: "Get insights into your confidence level through AI emotion detection.",
    icon: "😊"
  },
  {
    title: "Personalized Reports",
    description: "Track your progress with detailed performance analysis.",
    icon: "📊"
  },
  {
    title: "Industry-Specific Questions",
    description: "Practice with questions tailored to your target job role.",
    icon: "💼"
  },
  {
    title: "Real-Time Feedback",
    description: "Get instant analysis on your responses and body language.",
    icon: "⚡"
  },
  {
    title: "Progress Tracking",
    description: "Monitor your improvement over time with analytics.",
    icon: "📈"
  }
];

const faqs = [
  {
    question: "How does AI-based mock interviews work?",
    answer: "Our advanced AI analyzes your responses in real-time, evaluating content relevance, speech patterns, and confidence levels to provide comprehensive feedback."
  },
  {
    question: "Do I need to install any software?",
    answer: "No installation required! PrepSmart works directly in your web browser with camera access for the full experience."
  },
  {
    question: "What is the best way to improve using PrepSmart?",
    answer: "We recommend practicing 3-4 times weekly, carefully reviewing your feedback reports, and focusing on one improvement area at a time."
  },
  {
    question: "Is my interview data secure?",
    answer: "Absolutely. We use end-to-end encryption and never share your practice sessions or personal data with third parties."
  }
];

const HomePage = () => {
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const prevTestimonial = () => {
    setIsAutoPlaying(false);
    setTestimonialIndex(prev => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const nextTestimonial = () => {
    setIsAutoPlaying(false);
    setTestimonialIndex(prev => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  // Auto-rotate testimonials
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setTestimonialIndex(prev => (prev === testimonials.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  return (
    <div className="bg-gray-950 text-white min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen min-h-[700px] w-full overflow-hidden">
        <Image
          src="/assets/bg-home1.jpg"
          alt="Professional Interview Preparation"
          fill
          quality={100}
          priority
          className="object-cover z-0 brightness-[0.4]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 to-gray-950/40" />
        
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4 text-center gap-2">
          <div className="flex">
            <motion.img
              src="/logo_update.svg"
              alt="PrepSmart Logo"
              className="w-20 h-20 mr-4"
              whileHover={{ rotate: 15 }}
            />
            <motion.h1
              className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-yellow-500"
              whileHover={{ scale: 1.05 }}
            >
              <span>prep</span>
              <span className="text-yellow-500 ml-2">Smart</span>
            </motion.h1>
          </div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-6"
          >
            <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              Master Interviews
            </span> <br />
            With AI-Powered Coaching
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-xl md:text-2xl text-gray-300 max-w-3xl mb-10"
          >
            Get real-time feedback on your answers, body language, and confidence level
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link href="/dashboard">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg rounded-xl transition-all transform hover:scale-105 shadow-lg">
                Get Started Now
              </Button>
            </Link>
            <Link href="/demo">
              <Button variant="outline" className="bg-white/10 border-white text-white px-8 py-6 text-lg rounded-xl hover:text-white hover:bg-gray-800 transition-all transform hover:scale-105">
                See Demo
              </Button>
            </Link>
          </motion.div>
        </div>

        <div className="absolute bottom-10 left-0 right-0 flex justify-center z-10">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <FaChevronDown className="text-white text-2xl" />
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      {/* <section className="py-16 bg-gradient-to-b from-gray-900 to-gray-950">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-blue-400 mb-2">10,000+</div>
            <div className="text-gray-400">Users Trained</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-blue-400 mb-2">92%</div>
            <div className="text-gray-400">Success Rate</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-blue-400 mb-2">50+</div>
            <div className="text-gray-400">Companies Covered</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-blue-400 mb-2">24/7</div>
            <div className="text-gray-400">AI Coach Available</div>
          </div>
        </div>
      </section> */}

      {/* Features Section */}
      <section className="py-20 px-4 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why <span className="text-blue-400">PrepSmart</span>?
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Our platform combines cutting-edge AI with expert interview techniques
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-800 p-8 rounded-xl hover:bg-gray-750 transition-all duration-300 border border-gray-700 hover:border-blue-400/30 group"
              >
                <div className="text-4xl mb-4 group-hover:text-blue-400 transition-all">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-gray-950 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500 rounded-full filter blur-3xl" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500 rounded-full filter blur-3xl" />
        </div>

        <div className="max-w-5xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Trusted by <span className="text-blue-400">Thousands</span>
            </h2>
            <p className="text-xl text-gray-400">
              Don't just take our word for it - hear from our users
            </p>
          </motion.div>

          <div className="relative h-64 md:h-80">
            <AnimatePresence mode="wait">
              <motion.div
                key={testimonialIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="bg-gray-900 p-8 md:p-10 rounded-xl border border-gray-800 absolute inset-0 flex flex-col justify-center"
              >
                <FaQuoteLeft className="text-blue-400 text-2xl mb-4" />
                <blockquote className="text-lg md:text-xl italic mb-6">
                  "{testimonials[testimonialIndex].quote}"
                </blockquote>
                <FaQuoteRight className="text-blue-400 text-2xl ml-auto mt-2" />

                <div className="mt-6">
                  <p className="font-semibold text-lg">{testimonials[testimonialIndex].name}</p>
                  <p className="text-gray-400">{testimonials[testimonialIndex].role}</p>
                  <div className="flex justify-center mt-2">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={i < testimonials[testimonialIndex].rating ? "text-yellow-400" : "text-gray-600"}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <button
              onClick={prevTestimonial}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-gray-800 hover:bg-gray-700 p-3 rounded-full shadow-lg transition-all"
            >
              <FaChevronLeft className="text-white" />
            </button>
            <button
              onClick={nextTestimonial}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-gray-800 hover:bg-gray-700 p-3 rounded-full shadow-lg transition-all"
            >
              <FaChevronRight className="text-white" />
            </button>
          </div>

          <div className="flex justify-center mt-8 gap-2">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setIsAutoPlaying(false);
                  setTestimonialIndex(idx);
                }}
                className={`w-3 h-3 rounded-full ${testimonialIndex === idx ? 'bg-blue-400' : 'bg-gray-600'}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Frequently Asked <span className="text-blue-400">Questions</span>
            </h2>
            <p className="text-xl text-gray-400">
              Everything you need to know about PrepSmart
            </p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-800 rounded-xl overflow-hidden"
              >
                <details className="group">
                  <summary className="list-none p-6 cursor-pointer flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-left">{faq.question}</h3>
                    <div className="text-blue-400 transform group-open:rotate-180 transition-transform">
                      <FaChevronDown />
                    </div>
                  </summary>
                  <div className="px-6 pb-6 pt-2 text-gray-400">
                    {faq.answer}
                  </div>
                </details>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-gray-950 to-blue-950 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500 rounded-full filter blur-3xl" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500 rounded-full filter blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-6"
          >
            Ready to <span className="text-blue-400">Ace</span> Your Next Interview?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-300 mb-8"
          >
            Join thousands of successful candidates who landed their dream jobs with PrepSmart.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <Link href="/dashboard">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg rounded-xl transition-all transform hover:scale-105 shadow-lg">
                Get Started Now
              </Button>
            </Link>
            <Link href="/demo">
              <Button variant="outline" className="bg-white/10 border-white text-white px-8 py-6 text-lg rounded-xl hover:text-white hover:bg-gray-800 transition-all transform hover:scale-105">
                See Demo
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;