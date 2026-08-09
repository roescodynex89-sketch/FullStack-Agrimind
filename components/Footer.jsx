"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaGithub, FaEnvelope, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    platform: [
      { name: "Explore Crops", href: "/crops" },
      { name: "AI Crop Advisor", href: "/" },
      { name: "AI Chat Assistant", href: "/" },
      { name: "Pricing Plan", href: "/" },
    ],
    company: [
      { name: "About Us", href: "/" },
      { name: "Success Stories", href: "/" },
      { name: "Research", href: "/" },
      { name: "Contact", href: "/" },
    ],
    legal: [
      { name: "Privacy Policy", href: "/" },
      { name: "Terms of Service", href: "/" },
      { name: "Cookie Policy", href: "/" },
    ],
  };

  const socialLinks = [
    { icon: <FaFacebookF />, href: "#", color: "hover:bg-blue-600" },
    { icon: <FaTwitter />, href: "#", color: "hover:bg-sky-500" },
    { icon: <FaLinkedinIn />, href: "#", color: "hover:bg-blue-700" },
    { icon: <FaGithub />, href: "#", color: "hover:bg-gray-800" },
  ];

  return (
    <footer className="bg-[#81C784] border-t border-[#E5E7EB] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Upper Section: Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 mb-12">
          
          {/* Column 1: Brand Profile (4 Columns Wide) */}
          <div className="lg:col-span-4 space-y-5">
            <Link href="/" className="text-2xl font-bold text-[#2E7D32] flex items-center gap-2">
              <span>🌿</span> AgriMind AI
            </Link>
            <p className="text-[#4B5563] text-sm leading-relaxed">
            A modern platform designed to enrich and digitize Bangladesh's agricultural sector through the integration of advanced AI technology. It ensures the right decisions at the right time.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className={`w-9 h-9 rounded-xl bg-[#EEF7EE] text-[#2E7D32] hover:text-white flex items-center justify-center text-sm transition-all duration-300 shadow-sm ${social.color}`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Platform Links (2 Columns Wide) */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#1F2937] mb-4">Platform</h3>
            <ul className="space-y-2.5 text-sm">
              {footerLinks.platform.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-[#4B5563] hover:text-[#2E7D32] transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Company Links (2 Columns Wide) */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#1F2937] mb-4">Company</h3>
            <ul className="space-y-2.5 text-sm">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-[#4B5563] hover:text-[#2E7D32] transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Newsletter & Contact (4 Columns Wide) */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#1F2937] mb-4">Stay Updated</h3>
            <p className="text-xs text-[#6B7280]">Subscribe to receive our weekly agricultural advice and updates on new features.</p>
            
            {/* Subscription Form */}
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
              <div className="relative flex-grow">
                <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B7280]" />
                <input
                  type="email"
                  placeholder="Your Email Address"
                  className="w-full pl-10 pr-3 py-3 text-sm bg-[#EEF7EE]/40 border border-[#E5E7EB] rounded-xl focus:outline-none focus:border-[#81C784] text-[#1F2937] placeholder-[#6B7280]"
                  required
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                className="bg-[#2E7D32] hover:bg-[#225e25] text-white px-5 py-3 rounded-xl font-semibold text-sm shadow-md transition-colors"
              >
                Join
              </motion.button>
            </form>

            {/* Quick Contact Info */}
            <div className="pt-2 space-y-2 text-xs text-[#4B5563]">
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-[#81C784]" />
                <span>Dhaka, Bangladesh</span>
              </div>
              <div className="flex items-center gap-2">
                <FaPhoneAlt className="text-[#81C784]" />
                <span>+880 1234-567890</span>
              </div>
            </div>
          </div>

        </div>

        <hr className="border-[#E5E7EB] my-8" />

        {/* Lower Section: Copyright & Legal */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-[#6B7280]">
          <p>© {currentYear} AgriMind AI. All rights reserved.</p>
          <div className="flex items-center gap-6">
            {footerLinks.legal.map((link) => (
              <Link key={link.name} href={link.href} className="hover:text-[#2E7D32] transition-colors">
                {link.name}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}