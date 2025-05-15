"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import { FiMenu, FiX } from "react-icons/fi";
import { motion } from "framer-motion";

const Header = () => {
  const path = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Questions", path: "/dashboard/questions" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navigate = (path) => {
    router.replace(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-gray-900/95 backdrop-blur-sm py-2 shadow-lg" : "bg-gray-900 py-4"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <motion.a
          href="/"
          className="flex items-center space-x-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Image src="/logo_update.svg" alt="logo" width={32} height={32} />
          <div>
            <span className="text-2xl font-bold bg-gradient-to-r from-white to-yellow-500 bg-clip-text text-transparent">
              prep
            </span>
            <span className="text-yellow-500 font-bold text-2xl">
              Smart
            </span>
          </div>
          
        </motion.a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <motion.div
              key={item.path}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <button
                onClick={() => navigate(item.path)}
                className={`text-lg font-medium transition-colors ${
                  path === item.path
                    ? "text-blue-400"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                {item.name}
                {path === item.path && (
                  <motion.div
                    layoutId="navUnderline"
                    className="h-0.5 bg-blue-400 mt-1"
                  />
                )}
              </button>
            </motion.div>
          ))}
        </nav>

        {/* User Button */}
        <div className="hidden md:block">
          <UserButton afterSignOutUrl="/" />
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-300 focus:outline-none"
          onClick={toggleMobileMenu}
        >
          {isMobileMenuOpen ? (
            <FiX size={24} />
          ) : (
            <FiMenu size={24} />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="md:hidden bg-gray-800 shadow-lg"
        >
          <div className="container mx-auto px-4 py-4">
            {navItems.map((item) => (
              <motion.div
                key={item.path}
                whileTap={{ scale: 0.98 }}
                className="py-3 border-b border-gray-700 last:border-b-0"
              >
                <button
                  onClick={() => navigate(item.path)}
                  className={`w-full text-left text-lg font-medium ${
                    path === item.path
                      ? "text-blue-400"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  {item.name}
                </button>
              </motion.div>
            ))}
            <div className="pt-4 flex justify-center">
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Header;