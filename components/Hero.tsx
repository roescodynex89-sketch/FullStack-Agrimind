"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaRobot, FaSeedling, FaChevronRight } from "react-icons/fa";

export default function Hero() {
  return (
    <section
      className="relative overflow-hidden 
      bg-linear-to-br from-[#EEF7EE] to-[#81C784] py-16 md:py-24 lg:py-32"
    >
      {/* BACKGROUND DECORATIONS (Blur Circles) */}
      <div className="absolute top-1/4 left-10 w-72 h-72 bg-[#81C784] opacity-[0.12] rounded-full filter blur-[80px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-[#F9A825] opacity-[0.10] rounded-full filter blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* LEFT SIDE (45%) */}
          <div className="lg:col-span-5 space-y-6 text-center lg:text-left">
            {/* Tagline */}
            <motion.span
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#EEF7EE] text-[#2E7D32] text-sm font-semibold border border-[#81C784]/30"
            >
              <FaSeedling /> Next-Gen Agriculture
            </motion.span>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1F2937] leading-tight"
            >
              Smart Farming <br />
              Starts with <span className="text-[#2E7D32]">AI</span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
              className="text-[#4B5563] text-base sm:text-lg lg:text-xl leading-relaxed max-w-lg mx-auto lg:mx-0"
            >
              Get AI-powered crop guidance, personalized farming
              recommendations, and instant agricultural support—all in one
              place.
            </motion.p>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              {/* Primary CTA */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/"
                  className="flex items-center gap-2 bg-[#2E7D32] text-white font-semibold px-8 py-4 rounded-xl shadow-md hover:bg-[#225e25] transition-colors"
                >
                  <FaRobot className="text-xl" />
                  Try AI Advisor
                </Link>
              </motion.div>

              {/* Secondary CTA */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/crops"
                  className="flex items-center gap-2 bg-white text-[#4B5563] border border-[#E5E7EB] font-semibold px-8 py-4 rounded-xl shadow-sm hover:bg-[#EEF7EE] hover:text-[#2E7D32] transition-colors"
                >
                  Explore Crops
                  <FaChevronRight className="text-xs" />
                </Link>
              </motion.div>
            </motion.div>
          </div>

          {/* RIGHT SIDE (55%) */}
          <div className="lg:col-span-7 flex justify-center lg:justify-end relative">
            <div className="relative w-full max-w-[520px] aspect-square">
              {/* Main Image Container */}
              <motion.div
                initial={{ opacity: 0, x: 80 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full h-full"
              >
                {/* Floating Image */}
                <motion.div
                  animate={{ y: [0, -12, 0] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="w-full h-full relative"
                >
                  <Image
                    src="/agri1.jpg"
                    alt="AgriMind AI Illustration"
                    fill
                    priority
                    className="object-contain drop-shadow-[0_20px_50px_rgba(46,125,50,0.15)]"
                  />
                </motion.div>
              </motion.div>

              {/* FLOATING BADGES */}

              {/* Badge 1: AI Powered (Top-Left) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                className="absolute -top-4 -left-4 md:left-4"
              >
                <motion.div
                  animate={{ y: [0, -6, 0], x: [0, 4, 0] }}
                  transition={{
                    duration: 3.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="bg-white/95 backdrop-blur-sm border border-[#E5E7EB] shadow-lg rounded-2xl p-3.5 flex items-center gap-3"
                >
                  <span className="w-9 h-9 rounded-xl bg-[#EEF7EE] flex items-center justify-center text-[#2E7D32] text-lg">
                    🌿
                  </span>
                  <div>
                    <h4 className="text-xs text-[#6B7280] font-medium">
                      Technology
                    </h4>
                    <p className="text-sm text-[#1F2937] font-bold">
                      AI Powered
                    </p>
                  </div>
                </motion.div>
              </motion.div>

              {/* Badge 2: Smart Farming (Bottom-Right) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
                className="absolute bottom-4 right-0 md:right-4"
              >
                <motion.div
                  animate={{ y: [0, 8, 0], x: [0, -4, 0] }}
                  transition={{
                    duration: 4.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="bg-white/95 backdrop-blur-sm border border-[#E5E7EB] shadow-lg rounded-2xl p-3.5 flex items-center gap-3"
                >
                  <span className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-[#F9A825] text-lg">
                    🌾
                  </span>
                  <div>
                    <h4 className="text-xs text-[#6B7280] font-medium">
                      Approach
                    </h4>
                    <p className="text-sm text-[#1F2937] font-bold">
                      Smart Farming
                    </p>
                  </div>
                </motion.div>
              </motion.div>

              {/* Badge 3: 24/7 Assistant (Mid-Left) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 }}
                className="absolute top-1/2 -left-6 md:-left-10 transform -translate-y-1/2 hidden sm:block"
              >
                <motion.div
                  animate={{ y: [0, -4, 0], x: [0, -6, 0] }}
                  transition={{
                    duration: 3.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="bg-white/95 backdrop-blur-sm border border-[#E5E7EB] shadow-lg rounded-2xl p-3 flex items-center gap-2.5"
                >
                  <span className="w-8 h-8 rounded-lg bg-[#EEF7EE] flex items-center justify-center text-[#81C784] text-base">
                    🤖
                  </span>
                  <p className="text-xs text-[#1F2937] font-bold whitespace-nowrap">
                    24/7 Assistant
                  </p>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}