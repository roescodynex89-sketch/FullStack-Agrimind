"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { authClient } from "@/app/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { cropSchema, type CropInput } from "@/app/lib/validations/crop";
import {
  FiPlusCircle,
  FiFileText,
  FiImage,
  FiMapPin,
  FiLayers,
  FiSun,
  FiArrowRight,
  FiLoader,
} from "react-icons/fi";
import { createCrop } from "@/app/actions/crop";

export default function AddCropsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Better Auth Session Hook
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CropInput>({
    resolver: zodResolver(cropSchema),
    defaultValues: {
      difficulty: "Easy",
      season: "Summer",
    },
  });

  const onSubmit = async (data: CropInput) => {
    if (!user) {
      setMessage({
        type: "error",
        text: "You must be logged in to add crops.",
      });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const result = await createCrop(data);

      if (!result.success) {
        throw new Error(result.error);
      }

      setMessage({ type: "success", text: "Crop published successfully!" });
      reset();

      setTimeout(() => {
        router.push("/crops");
      }, 2000);
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.message || "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (isPending) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-[#EEF7EE]/20 flex items-center justify-center">
        <FiLoader className="animate-spin text-[#2E7D32]" size={40} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-[#EEF7EE]/20 flex items-center justify-center p-4">
        <div className="bg-white border border-[#E5E7EB] p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-[#1F2937] mb-2">
            Access Denied
          </h2>
          <p className="text-[#4B5563] mb-6 text-sm">
            Please log in to your account to add new crop intelligence data.
          </p>
          <button
            onClick={() => router.push("/login")}
            className="w-full bg-[#2E7D32] hover:bg-[#225e25] text-white font-semibold py-2.5 px-4 rounded-xl shadow-md transition-all duration-200 flex items-center justify-center gap-2"
          >
            Go to Login <FiArrowRight />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)]  bg-[#81C784]  flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl bg-white border border-[#E5E7EB] rounded-2xl shadow-xl p-6 sm:p-8"
      >
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-[#E5E7EB] pb-5 mb-6">
          <FiPlusCircle className="text-[#2E7D32]" size={28} />
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#1F2937]">
              Add New Crop Data
            </h2>
            <p className="text-sm text-[#4B5563]">
              Fill up the form parameters below to register agriculture updates.
            </p>
          </div>
        </div>

        {/* Status Messages */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-xl border font-medium text-sm transition-all ${
              message.type === "success"
                ? "bg-[#EEF7EE] border-[#81C784]/40 text-[#2E7D32]"
                : "bg-red-50 border-red-200 text-red-600"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* 1. Crop Name */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase text-[#4B5563] mb-1.5 tracking-wide">
                Crop Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#6B7280]">
                  <FiFileText size={18} />
                </span>
                <input
                  {...register("name")}
                  type="text"
                  placeholder="e.g., Potato, Tomato, Winter Rice"
                  className="w-full bg-white border border-[#E5E7EB] text-[#1F2937] rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-[#2E7D32] focus:ring-1 focus:ring-[#2E7D32] transition-all placeholder:text-[#6B7280]/40"
                />
              </div>
              {errors.name && (
                <p className="text-xs text-red-500 mt-1 font-medium">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* 2. Unsplash Image Link */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase text-[#4B5563] mb-1.5 tracking-wide">
                Image Link (Unsplash)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#6B7280]">
                  <FiImage size={18} />
                </span>
                <input
                  {...register("imageUrl")}
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full bg-white border border-[#E5E7EB] text-[#1F2937] rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-[#2E7D32] focus:ring-1 focus:ring-[#2E7D32] transition-all placeholder:text-[#6B7280]/40"
                />
              </div>
              {errors.imageUrl && (
                <p className="text-xs text-red-500 mt-1 font-medium">
                  {errors.imageUrl.message}
                </p>
              )}
            </div>

            {/* 4. Difficulty Level */}
            <div>
              <label className="block text-xs font-bold uppercase text-[#4B5563] mb-1.5 tracking-wide">
                Farming Difficulty
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#6B7280]">
                  <FiLayers size={18} />
                </span>
                <select
                  {...register("difficulty")}
                  className="w-full bg-white border border-[#E5E7EB] text-[#1F2937] rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-[#2E7D32] focus:ring-1 focus:ring-[#2E7D32] transition-all cursor-pointer appearance-none"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
            </div>

            {/* 5. Season */}
            <div>
              <label className="block text-xs font-bold uppercase text-[#4B5563] mb-1.5 tracking-wide">
                Optimal Season
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#6B7280]">
                  <FiSun size={18} />
                </span>
                <select
                  {...register("season")}
                  className="w-full bg-white border border-[#E5E7EB] text-[#1F2937] rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-[#2E7D32] focus:ring-1 focus:ring-[#2E7D32] transition-all cursor-pointer appearance-none"
                >
                  <option value="Summer">Summer</option>
                  <option value="Winter">Winter</option>
                  <option value="Monsoon">Monsoon</option>
                  <option value="All Season">All Season</option>
                </select>
              </div>
            </div>

            {/* 6. Location Field */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase text-[#4B5563] mb-1.5 tracking-wide">
                Cultivation Region / Location
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#6B7280]">
                  <FiMapPin size={18} />
                </span>
                <input
                  {...register("location")}
                  type="text"
                  placeholder="e.g., Rajshahi, Bogura, All over Bangladesh"
                  className="w-full bg-white border border-[#E5E7EB] text-[#1F2937] rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-[#2E7D32] focus:ring-1 focus:ring-[#2E7D32] transition-all placeholder:text-[#6B7280]/40"
                />
              </div>
              {errors.location && (
                <p className="text-xs text-red-500 mt-1 font-medium">
                  {errors.location.message}
                </p>
              )}
            </div>

            {/* 3. Description */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase text-[#4B5563] mb-1.5 tracking-wide">
                Description Overview
              </label>
              <div className="relative">
                <textarea
                  {...register("description")}
                  rows={4}
                  placeholder="Provide growth stages, optimal soil health criteria, or general field instructions..."
                  className="w-full bg-white border border-[#E5E7EB] text-[#1F2937] rounded-xl p-4 text-sm outline-none focus:border-[#2E7D32] focus:ring-1 focus:ring-[#2E7D32] transition-all placeholder:text-[#6B7280]/40 resize-none"
                />
              </div>
              {errors.description && (
                <p className="text-xs text-red-500 mt-1 font-medium">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* 4. Description */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase text-[#4B5563] mb-1.5 tracking-wide">
                AI Farming Tips
              </label>
              <div className="relative">
                <textarea
                  {...register("farmingTips")}
                  rows={4}
                  placeholder="Provide growth stages, optimal soil health criteria, or general field instructions..."
                  className="w-full bg-white border border-[#E5E7EB] text-[#1F2937] rounded-xl p-4 text-sm outline-none focus:border-[#2E7D32] focus:ring-1 focus:ring-[#2E7D32] transition-all placeholder:text-[#6B7280]/40 resize-none"
                />
              </div>
              {errors.farmingTips && (
                <p className="text-xs text-red-500 mt-1 font-medium">
                  {errors.farmingTips.message}
                </p>
              )}
            </div>

            {/* 5. Description */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase text-[#4B5563] mb-1.5 tracking-wide">
                Common Diseases
              </label>
              <div className="relative">
                <textarea
                  {...register("commonDiseases")}
                  rows={4}
                  placeholder="Provide growth stages, optimal soil health criteria, or general field instructions..."
                  className="w-full bg-white border border-[#E5E7EB] text-[#1F2937] rounded-xl p-4 text-sm outline-none focus:border-[#2E7D32] focus:ring-1 focus:ring-[#2E7D32] transition-all placeholder:text-[#6B7280]/40 resize-none"
                />
              </div>
              {errors.commonDiseases && (
                <p className="text-xs text-red-500 mt-1 font-medium">
                  {errors.commonDiseases.message}
                </p>
              )}
            </div>
          </div>

          {/* Action Interface Buttons */}
          <div className="flex items-center justify-end gap-3 mt-4 border-t border-[#E5E7EB] pt-5">
            <button
              type="button"
              onClick={() => router.push("/crops")}
              className="px-5 py-2.5 text-sm font-medium text-[#4B5563] bg-gray-100 hover:bg-gray-200 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#2E7D32] hover:bg-[#225e25] text-white font-semibold py-2.5 px-6 rounded-xl shadow-md transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <FiLoader className="animate-spin" /> Publishing...
                </>
              ) : (
                <>
                  Publish Crop <FiArrowRight />
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
