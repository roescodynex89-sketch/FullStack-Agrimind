"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FiEye,
  FiUser,
  FiLoader,
  FiAlertCircle,
  FiArrowRight,
  FiSun,
  FiMapPin,
} from "react-icons/fi";
import Image from "next/image";
import { getCrops } from "@/app/actions/crop";

interface Crop {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
  difficulty: string;
  season: string;
  location: string;
  user?: { name: string };
}

export default function HomeCrops() {
  const [crops, setCrops] = useState<Crop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHomeCrops = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getCrops();
        const topFour = (Array.isArray(result) ? result : []).slice(0, 4);
        setCrops(topFour);
      } catch (err: any) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchHomeCrops();
  }, []);

  if (loading) {
    return (
      <div className="py-16 flex items-center justify-center bg-[#EEF7EE]/10">
        <FiLoader className="animate-spin text-[#2E7D32]" size={36} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16 flex flex-col items-center justify-center bg-[#EEF7EE]/20 text-center px-4">
        <FiAlertCircle className="text-red-500 mb-2" size={40} />
        <p className="text-gray-700 font-medium">{error}</p>
      </div>
    );
  }

  return (
    <section className="bg-[#81C784] py-16 px-4 sm:px-6 lg:px-8 border-b border-gray-100">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
          <div>
            <span className="text-[#2E7D32] font-bold text-xs uppercase tracking-wider px-3 py-1 bg-[#EEF7EE] rounded-full border border-[#81C784]/30">
              Latest Insights
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] mt-2 tracking-tight">
              Featured Crop Profiles
            </h2>
            <p className="mt-2 text-[#4B5563] text-sm max-w-md">
              Monitor seasonal crop intelligence, regional analytical data, and
              dynamic trends in Bangladesh.
            </p>
          </div>

          <Link
            href="/crops"
            className="group flex items-center gap-1 text-sm font-bold text-[#2E7D32] hover:text-[#225e25] transition-colors bg-white px-4 py-2 rounded-xl border border-[#E5E7EB] shadow-sm"
          >
            Explore Directory
            <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 4 Cards Grid Layout */}
        {crops.length === 0 ? (
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-8 text-center text-gray-500">
            No crop data available at the moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {crops.map((crop, index) => (
              <motion.div
                key={crop.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="bg-white border border-[#E5E7EB] rounded-2xl shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-all duration-300"
              >
                <div>
                  {/* Image Section */}
                  <div className="relative h-44 w-full bg-gray-50 overflow-hidden border-b border-gray-100">
                    <Image
                      src={
                        crop.imageUrl ||
                        "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=600&q=80"
                      }
                      alt={crop.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      className="object-cover hover:scale-103 transition-transform duration-500"
                    />
                    <span className="absolute top-3 right-3 bg-[#2E7D32] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full z-10 uppercase tracking-wide flex items-center gap-1 shadow-sm">
                      <FiSun size={10} /> {crop.season}
                    </span>
                  </div>

                  {/* Content Section */}
                  <div className="p-4">
                    <h3 className="text-base font-bold text-[#1F2937] line-clamp-1 hover:text-[#2E7D32] transition-colors">
                      {crop.name}
                    </h3>
                    <p className="text-[#4B5563] text-xs mt-1.5 line-clamp-2 leading-relaxed">
                      {crop.description}
                    </p>

                    {/* Regional Location Info */}
                    <div className="flex items-center gap-1 mt-3 text-gray-500 text-xs font-medium">
                      <FiMapPin size={13} className="text-[#2E7D32]" />
                      <span className="truncate">
                        {crop.location || "Bangladesh"}
                      </span>
                    </div>

                    {/* Contributor Profile */}
                    <div className="flex items-center gap-1 mt-2 text-gray-400 text-[11px]">
                      <FiUser size={12} />
                      <span>
                        By:{" "}
                        <span className="text-gray-600 font-medium">
                          {crop.user?.name || "Expert Contributor"}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="px-4 pb-4 pt-3 border-t border-gray-50 flex items-center justify-between bg-gray-50/40">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                    Difficulty:{" "}
                    <span className="text-[#2E7D32]">{crop.difficulty}</span>
                  </span>
                  <Link
                    href={`/crops/${crop.id}`}
                    className="bg-[#2E7D32] hover:bg-[#225e25] text-white text-xs font-bold py-2 px-3.5 rounded-xl shadow-sm flex items-center gap-1 transition-all duration-200"
                  >
                    <FiEye size={13} /> View Details
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}