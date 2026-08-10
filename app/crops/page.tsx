"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FiSearch,
  FiFilter,
  FiLoader,
  FiArrowRight,
  FiSun,
} from "react-icons/fi";
import Image from "next/image";
import { getCrops } from "@/app/actions/crop";

export default function CropsExplorePage() {
  const [crops, setCrops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedSeason, setSelectedSeason] = useState("All");

  useEffect(() => {
    const fetchCrops = async () => {
      setLoading(true);
      try {
        const data = await getCrops(search || undefined);
        setCrops(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching crops:", err);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchCrops();
    }, 400); // Debounce search to save calls

    return () => clearTimeout(delayDebounce);
  }, [search]);

  // Client-side season filtering based on database value
  const filteredCrops = crops.filter((crop) => {
    if (selectedSeason === "All") return true;
    return crop.season?.toLowerCase() === selectedSeason.toLowerCase();
  });

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#81C784] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header section */}
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-3xl font-extrabold text-[#1F2937] tracking-tight">
            Agricultural Crop Database
          </h1>
          <p className="text-sm text-[#4B5563] mt-1">
            Explore upcoming crops, seasons, and dynamic price estimations.
          </p>
        </div>

        {/* Filters Controller */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 shadow-sm mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
          {/* Name Input Search */}
          <div className="relative w-full sm:max-w-md">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#6B7280]">
              <FiSearch size={18} />
            </span>
            <input
              type="text"
              placeholder="Search crops by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-[#E5E7EB] text-[#1F2937] rounded-xl pl-10 pr-4 py-2 text-sm outline-none focus:border-[#2E7D32] focus:ring-1 focus:ring-[#2E7D32] transition-all"
            />
          </div>

          {/* Season Filter Dropdown */}
          <div className="relative w-full sm:w-48 flex items-center gap-2">
            <FiFilter className="text-[#6B7280] hidden sm:block" size={16} />
            <select
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(e.target.value)}
              className="w-full bg-white border border-[#E5E7EB] text-[#1F2937] rounded-xl px-3 py-2 text-sm outline-none focus:border-[#2E7D32] cursor-pointer"
            >
              <option value="All">All Seasons</option>
              <option value="Summer">Summer</option>
              <option value="Winter">Winter</option>
              <option value="Monsoon">Monsoon</option>
            </select>
          </div>
        </div>

        {/* Crops Container Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <FiLoader className="animate-spin text-[#2E7D32]" size={40} />
          </div>
        ) : filteredCrops.length === 0 ? (
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-12 text-center text-[#6B7280]">
            No matching agricultural data profiles found.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCrops.map((crop, index) => (
              <motion.div
                key={crop.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-[#81C784]/40 border-b border-[#E5E7EB] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <Image
                    src={
                      crop.imageUrl ||
                      "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=600&q=80"
                    }
                    alt={crop.name}
                    width={80}
                    height={80}
                    className="w-full h-48 object-cover bg-gray-50 border-b border-gray-100"
                  />
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-xl font-bold text-[#1F2937] truncate">
                        {crop.name}
                      </h2>
                      <span className="text-xs bg-[#EEF7EE] text-[#2E7D32] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                        <FiSun size={12} /> {crop.season}
                      </span>
                    </div>
                    <p className="text-sm text-[#4B5563] line-clamp-3 leading-relaxed">
                      {crop.description}
                    </p>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-2">
                  <Link
                    href={`/crops/${crop.id}`}
                    className="w-full bg-[#2E7D32] hover:bg-[#225e25] text-white text-sm font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm"
                  >
                    View Details <FiArrowRight />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}