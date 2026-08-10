"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { HiMenu, HiX } from "react-icons/hi";
import {
  FaUserCircle,
  FaChevronDown,
  FaPlusCircle,
  FaThLarge,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";
import { authClient } from "@/app/lib/auth-client";

// import { useQueryClient } from "@tanstack/react-query"; // error fix

export default function Navbar() {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const queryClient=useQueryClient(); // error fix
  // Hooking up real Better Auth session states
  const { data: session, isPending } = authClient.useSession();
  const isLoggedIn = !!session;
  const userName = session?.user?.name || "User";

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Explore Crops", href: "/crops" },
    
  ];

  const dropdownItems = [
    { name: "My Profile", href: "/profile", icon: <FaUser /> },
    { name: "My Dashboard", href: "/dashboard", icon: <FaThLarge /> },
    { name: "Add Crops", href: "/add-crops", icon: <FaPlusCircle /> },
  ];

  const handleLogout = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            // queryClient.clear();// error fix
            setIsDropdownOpen(false);
            setIsMobileMenuOpen(false);
            router.push("/");
            router.refresh();
          },
        },
      });
    } catch (error) {
      console.error("Sign out transaction exception:", error);
    }
  };

  return (
    <nav className="bg-[#EEF7EE] border-b border-[#E5E7EB] sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* LEFT: Logo */}
          <div className="shrink-0">
            <Link
              href="/"
              className="text-2xl font-bold text-[#2E7D32] flex items-center gap-2"
            >
              <span>🌿</span> AgriMind AI
            </Link>
          </div>

          {/* MIDDLE: Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-[#4B5563] hover:text-[#2E7D32] font-medium transition-colors duration-200"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* RIGHT: User Profile / Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isPending ? (
              // Loading Skeleton State for smooth visual balance during session resolution
              <div className="w-24 h-9 bg-slate-200/60 animate-pulse rounded-full" />
            ) : isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 bg-[#EEF7EE] text-[#2E7D32] px-4 py-2 rounded-full font-medium hover:bg-[#81C784] hover:text-white transition-all duration-200"
                >
                  <FaUserCircle className="text-xl" />
                  <span className="max-w-25 truncate">{userName}</span>
                  <FaChevronDown
                    className={`text-sm transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-[#E5E7EB] py-2 overflow-hidden"
                    >
                      {dropdownItems.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#4B5563] hover:bg-[#EEF7EE] hover:text-[#2E7D32] transition-colors"
                        >
                          <span className="text-[#81C784]">{item.icon}</span>
                          {item.name}
                        </Link>
                      ))}
                      <hr className="border-[#E5E7EB] my-1" />
                      <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
                      >
                        <FaSignOutAlt className="text-red-400" />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="text-[#4B5563] hover:text-[#2E7D32] font-medium px-4 py-2 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-[#F9A825] hover:bg-amber-600 text-white font-medium px-5 py-2 rounded-lg transition-colors shadow-sm"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-[#1F2937] hover:text-[#2E7D32] text-2xl focus:outline-none"
            >
              {isMobileMenuOpen ? <HiX /> : <HiMenu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Navigation Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-[#E5E7EB] overflow-hidden"
          >
            <div className="px-4 pt-2 pb-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-[#4B5563] hover:bg-[#EEF7EE] hover:text-[#2E7D32]"
                >
                  {link.name}
                </Link>
              ))}

              <hr className="border-[#E5E7EB] my-2" />

              {!isPending && isLoggedIn ? (
                <div className="space-y-1">
                  <div className="px-3 py-2 text-xs font-bold text-[#2E7D32] bg-[#EEF7EE] rounded-lg mb-2 truncate">
                    Logged in as: {userName}
                  </div>
                  {dropdownItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium text-[#4B5563] hover:bg-[#EEF7EE] hover:text-[#2E7D32]"
                    >
                      <span className="text-[#81C784]">{item.icon}</span>
                      {item.name}
                    </Link>
                  ))}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-md text-base font-semibold text-red-600 hover:bg-red-50 mt-2 font-semibold"
                  >
                    <FaSignOutAlt className="text-red-400" />
                    Logout
                  </button>
                </div>
              ) : !isPending ? (
                <div className="pt-2 space-y-2 px-3">
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-center w-full border border-[#2E7D32] text-[#2E7D32] font-medium py-2 rounded-lg hover:bg-[#EEF7EE]"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-center w-full bg-[#F9A825] hover:bg-amber-600 text-white font-medium py-2 rounded-lg"
                  >
                    Register
                  </Link>
                </div>
              ) : null}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}