"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { FiEye, FiEyeOff, FiLock, FiMail, FiUser, FiArrowRight } from "react-icons/fi";
import { authClient } from "@/app/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterInput } from "@/app/lib/validations/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    setLoading(true);
    setAuthError(null);
    try {
      const { error } = await authClient.signUp.email({
        email: data.email,
        password: data.password,
        name: data.name,
      });

      if (error) {
        setAuthError(error.message || "Registration failed.");
        return;
      }

      router.push("/");
      router.refresh();
    } catch (error: any) {
      setAuthError(error?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#81C784]   flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white border border-[#E5E7EB] rounded-2xl shadow-xl p-6 sm:p-8 relative z-10"
      >
        <div className="text-center mb-6">
          <Link
            href="/"
            className="text-2xl font-bold tracking-wider text-[#1F2937] inline-block"
          >
            Agri<span className="text-[#2E7D32]">Mind AI</span>
          </Link>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#1F2937] mt-2">
            Create an Account
          </h2>
        </div>

        {authError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl font-medium">
            {authError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-[#4B5563] mb-1.5 tracking-wide">
              Full Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#6B7280]">
                <FiUser size={18} />
              </span>
              <input
                {...register("name")}
                type="text"
                placeholder="John Doe"
                className="w-full bg-white border border-[#E5E7EB] text-[#1F2937] rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-[#2E7D32] focus:ring-1 focus:ring-[#2E7D32] transition-all placeholder:text-[#6B7280]/50"
              />
            </div>
            {errors.name && (
              <p className="text-xs text-red-500 mt-1 font-medium">
                {errors.name.message as string}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-[#4B5563] mb-1.5 tracking-wide">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#6B7280]">
                <FiMail size={18} />
              </span>
              <input
                {...register("email")}
                type="email"
                placeholder="you@example.com"
                className="w-full bg-white border border-[#E5E7EB] text-[#1F2937] rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-[#2E7D32] focus:ring-1 focus:ring-[#2E7D32] transition-all placeholder:text-[#6B7280]/50"
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-500 mt-1 font-medium">
                {errors.email.message as string}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-[#4B5563] mb-1.5 tracking-wide">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#6B7280]">
                <FiLock size={18} />
              </span>
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full bg-white border border-[#E5E7EB] text-[#1F2937] rounded-xl pl-10 pr-11 py-2.5 text-sm outline-none focus:border-[#2E7D32] focus:ring-1 focus:ring-[#2E7D32] transition-all placeholder:text-[#6B7280]/50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-[#6B7280]"
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-500 mt-1 font-medium">
                {errors.password.message as string}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-[#4B5563] mb-1.5 tracking-wide">
              Confirm Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#6B7280]">
                <FiLock size={18} />
              </span>
              <input
                {...register("confirmPassword")}
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full bg-white border border-[#E5E7EB] text-[#1F2937] rounded-xl pl-10 pr-11 py-2.5 text-sm outline-none focus:border-[#2E7D32] focus:ring-1 focus:ring-[#2E7D32] transition-all placeholder:text-[#6B7280]/50"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-[#6B7280]"
              >
                {showConfirmPassword ? (
                  <FiEyeOff size={18} />
                ) : (
                  <FiEye size={18} />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-red-500 mt-1 font-medium">
                {errors.confirmPassword.message as string}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2E7D32] hover:bg-[#225e25] text-white font-semibold py-2.5 px-4 rounded-xl shadow-md transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
          >
            {loading ? "Creating Account..." : "Sign Up"}
            {!loading && <FiArrowRight />}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#E5E7EB]"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-[#6B7280]">
              Or continue with
            </span>
          </div>
        </div>

        <p className="text-center text-sm text-[#4B5563] mt-6">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-[#2E7D32] font-bold hover:underline"
          >
            Log In
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
