"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const AboutUs = () => {
  const teamMembers = [
    {
      id: 1,
      name: "Niraj Karande",
      role: "Full Stack Developer",
      image: "/assets/niraj_profile.jpg",
      linkedin: "",
      instagram: "https://www.instagram.com/niraj070707/",
      facebook: ""
    },
    {
      id: 2,
      name: "Sarthak Nirgude",
      role: "Full Stack Developer",
      image: "/assets/sarthak_profile.jpg",
      linkedin: "https://www.linkedin.com/in/sarthaknirgude7/",
      instagram: "https://www.instagram.com/_i_am_srn/",
      facebook: ""
    },
    {
      id: 3,
      name: "Sumit Sunke",
      role: "Full Stack Developer",
      image: "/assets/sumit_profile.jpg",
      linkedin: "",
      instagram: "",
      facebook: ""
    },
    {
      id: 4,
      name: "Rushikesh Mane",
      role: "Full Stack Developer",
      image: "/assets/rushikesh_profile.jpg",
      linkedin: "",
      instagram: "",
      facebook: ""
    }
  ];

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="bg-gray-950 text-white font-poppins overflow-hidden">
      {/* Hero Section with Parallax Effect */}
      <section className="relative h-screen min-h-[600px] w-full overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{ backgroundImage: "url('/assets/backiee-286745-landscape.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 to-gray-950/70" />
        
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.8 }}
          className="relative z-10 h-full flex flex-col items-center justify-center px-4"
        >
          <div className="flex items-center mb-8">
            <motion.img 
              src="/logo_update.svg" 
              alt="PrepSmart Logo"
              className="w-20 h-20 mr-4"
              whileHover={{ rotate: 15 }}
            />
            <motion.h1 
              className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-yellow-400"
              whileHover={{ scale: 1.05 }}
            >
              <span>prep</span>
              <span className="text-yellow-400 ml-2">Smart</span>
            </motion.h1>
          </div>
          <motion.p 
            className="text-white text-xl md:text-2xl font-medium text-center max-w-3xl px-4 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Your ultimate AI-powered interview coach, helping you practice smarter, boost confidence, and ace every opportunity with ease!
          </motion.p>
          
          <motion.div
            className="mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <Link href="/dashboard">
              <button className="px-8 py-3 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg shadow-yellow-400/20">
                Start Your Journey
              </button>
            </Link>
            
          </motion.div>
        </motion.div>
      </section>

      {/* Description Section */}
      <section className="px-4 py-20 relative">
        <div className="absolute -top-20 left-0 w-full h-20 bg-gradient-to-b from-transparent to-gray-950 z-0" />
        <motion.div 
          className="max-w-6xl mx-auto bg-gray-900/80 backdrop-blur-sm border border-gray-800 p-8 md:p-12 rounded-2xl relative overflow-hidden"
          initial="hidden"
          whileInView="visible"
          variants={fadeIn}
          viewport={{ once: true }}
        >
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-yellow-400 rounded-full filter blur-3xl opacity-10" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-500 rounded-full filter blur-3xl opacity-10" />
          <p className="text-gray-300 text-lg md:text-xl text-center leading-relaxed relative z-10">
            "PrepSmart is an advanced online platform designed to help job seekers excel in their interview preparation. Our AI-powered features include real-time facial emotion analysis, personalized feedback, and a curated set of mock interview questions tailored to various industries. We provide an intuitive and structured approach to mastering interviews, ensuring that candidates build confidence, improve their responses, and stand out to recruiters. Whether you're a fresher or an experienced professional, PrepSmart is your go-to solution for landing your dream job. Start your journey today and elevate your interview skills with PrepSmart! 🚀"
          </p>
        </motion.div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-gray-900 to-gray-950">
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-center mb-16"
            initial="hidden"
            whileInView="visible"
            variants={fadeIn}
            viewport={{ once: true }}
          >
            Our <span className="text-yellow-400">Core</span> Values
          </motion.h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div 
              className="bg-gray-900 border border-gray-800 p-8 rounded-2xl hover:border-yellow-400 transition-all duration-300 group"
              whileHover={{ y: -10 }}
              initial="hidden"
              whileInView="visible"
              variants={fadeIn}
              viewport={{ once: true }}
            >
              <div className="w-16 h-16 bg-yellow-400/10 border border-yellow-400/30 rounded-xl flex items-center justify-center mb-6 group-hover:bg-yellow-400/20 transition-all">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
              <p className="text-gray-400 leading-relaxed">
                We aim to empower job seekers by providing a seamless interview preparation experience with personalized feedback and real-time AI analysis.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-gray-900 border border-gray-800 p-8 rounded-2xl hover:border-blue-400 transition-all duration-300 group"
              whileHover={{ y: -10 }}
              initial="hidden"
              whileInView="visible"
              variants={fadeIn}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="w-16 h-16 bg-blue-400/10 border border-blue-400/30 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-400/20 transition-all">
                <span className="text-3xl">🚀</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
              <p className="text-gray-400 leading-relaxed">
                To be the leading AI-driven interview preparation platform that helps candidates ace their interviews with confidence.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Our dedicated Team</h2>
          <p className="text-white italic max-w-2xl mx-auto mb-12">
            Meet the PrepSmart Team, the minds behind our smart and effective interview preparation platform!
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <div key={member.id} className="group relative">
                <div className="relative z-10 mx-auto w-48 h-48 rounded-full overflow-hidden border-4 border-gray-700 group-hover:opacity-100 opacity-70 transition-opacity duration-300">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-64 mt-52 p-6 bg-white rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                  <h3 className="text-xl font-semibold text-black">{member.name}</h3>
                  <p className="text-gray-600">{member.role}</p>
                  <div className="flex justify-center space-x-4 mt-4">
                    {member.linkedin && (
                      <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
                        <img src="/assets/linkedin.png" alt="LinkedIn" className="w-6 h-6 hover:translate-y-1 transition-transform" />
                      </a>
                    )}
                    {member.instagram && (
                      <a href={member.instagram} target="_blank" rel="noopener noreferrer">
                        <img src="/assets/instagram.png" alt="Instagram" className="w-6 h-6 hover:translate-y-1 transition-transform" />
                      </a>
                    )}
                    {member.facebook && (
                      <a href={member.facebook} target="_blank" rel="noopener noreferrer">
                        <img src="/assets/facebook.png" alt="Facebook" className="w-6 h-6 hover:translate-y-1 transition-transform" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-gray-900 to-gray-950 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-64 h-64 bg-yellow-400 rounded-full filter blur-3xl" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500 rounded-full filter blur-3xl" />
        </div>
        
        <motion.div 
          className="max-w-4xl mx-auto text-center relative"
          initial="hidden"
          whileInView="visible"
          variants={fadeIn}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to <span className="text-yellow-400">Ace</span> Your Next Interview?
          </h2>
          <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of successful candidates who landed their dream jobs with PrepSmart.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/dashboard">
              <button className="px-8 py-3 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg shadow-yellow-400/20">
                Get Started Now
              </button>
            </Link>
            <button className="px-8 py-3 border border-gray-700 hover:border-yellow-400 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105">
              Learn More
            </button>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default AboutUs;