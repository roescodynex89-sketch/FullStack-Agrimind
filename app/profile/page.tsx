"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { authClient } from "@/app/lib/auth-client";
import { FiUser, FiMail, FiEdit2, FiCheck, FiLoader, FiAlertCircle, FiArrowLeft } from "react-icons/fi";

export default function MyProfilePage() {
  const router = useRouter();
  
  // Better Auth Session Hook
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  // States
  const [name, setName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Sync user name state when session loads
  useEffect(() => {
    if (user?.name) {
      setName(user.name);
    }
  }, [user]);

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || name === user?.name) {
      setIsEditing(false);
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      // Direct update using better-auth client library
      const { error } = await authClient.updateUser({
        name: name.trim(),
      });

      if (error) throw new Error(error.message || "Failed to update profile name.");

      setMessage({ type: "success", text: "Profile name updated successfully!" });
      setIsEditing(false);
      
      // Force Next.js router refresh to display updated session state
      router.refresh();
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Something went wrong." });
      setName(user?.name || ""); 
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
          <FiAlertCircle className="text-red-500 mx-auto mb-4" size={48} />
          <h2 className="text-2xl font-bold text-[#1F2937] mb-2">Access Denied</h2>
          <p className="text-[#4B5563] mb-6 shadow-sm">Please log in to manage your profile settings.</p>
          <button
            onClick={() => router.push("/login")}
            className="w-full bg-[#2E7D32] hover:bg-[#225e25] text-white font-semibold py-2.5 px-4 rounded-xl shadow-md transition-all"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#81C784] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md">
        {/* Back to Dashboard Link */}
        <button 
          onClick={() => router.push("/dashboard")} 
          className="flex items-center gap-1.5 text-gray-500 font-bold mb-4 hover:text-[#1F2937] transition-colors text-sm"
        >
          <FiArrowLeft /> Back to Dashboard
        </button>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-[#E5E7EB] rounded-3xl shadow-xl p-6 sm:p-8 relative overflow-hidden"
        >
          {/* Avatar Header Decor */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 bg-[#2E7D32] border border-[#81C784]/30 rounded-full flex items-center justify-center text-white text-3xl font-extrabold mb-3 shadow-md">
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <h2 className="text-2xl font-extrabold text-[#1F2937]">Profile Settings</h2>
            <p className="text-[#4B5563] text-xs mt-0.5">Manage your AgriMind account identity</p>
          </div>

          {/* Status Feedback */}
          {message && (
            <div
              className={`mb-6 p-4 rounded-xl border text-sm font-medium ${
                message.type === "success"
                  ? "bg-[#EEF7EE] border-[#81C784]/30 text-[#2E7D32]"
                  : "bg-red-50 border-red-200 text-red-600"
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Info & Form Fields */}
          <div className="space-y-5">
            {/* Email Field (Read Only) */}
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5 tracking-wide">Email Address</label>
              <div className="relative bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 flex items-center gap-3 text-gray-600 cursor-not-allowed">
                <FiMail className="text-gray-400" size={18} />
                <span className="text-sm">{user.email}</span>
                <span className="ml-auto text-[10px] font-bold uppercase bg-gray-200 text-gray-500 px-1.5 py-0.5 rounded">Locked</span>
              </div>
            </div>

            {/* Name Field (Editable In-line Container) */}
            <div>
              <label className="block text-xs font-bold uppercase text-gray-600 mb-1.5 tracking-wide">Full Name</label>
              {isEditing ? (
                <form onSubmit={handleUpdateName} className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                      <FiUser size={18} />
                    </span>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={user.name || ""}
                      className="w-full bg-white border border-[#E5E7EB] text-[#1F2937] rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-[#2E7D32] focus:ring-1 focus:ring-[#2E7D32] transition-all"
                      autoFocus
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-[#2E7D32] hover:bg-[#225e25] text-white p-3 rounded-xl shadow-md transition-all flex items-center justify-center aspect-square disabled:opacity-50"
                  >
                    {loading ? <FiLoader className="animate-spin" /> : <FiCheck size={18} />}
                  </button>
                </form>
              ) : (
                <div className="relative border border-[#E5E7EB] rounded-xl px-4 py-3 flex items-center justify-between gap-3 text-[#1F2937] bg-white group shadow-sm">
                  <div className="flex items-center gap-3">
                    <FiUser className="text-gray-400" size={18} />
                    <span className="text-sm font-semibold">{user.name}</span>
                  </div>
                  <button
                    onClick={() => {
                      setName(user.name || "");
                      setIsEditing(true);
                    }}
                    className="text-[#2E7D32] hover:text-[#225e25] text-xs font-bold flex items-center gap-1 transition-colors border border-[#2E7D32]/20 px-2.5 py-1 rounded-lg hover:bg-[#EEF7EE]/50"
                  >
                    <FiEdit2 size={12} /> Change
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}