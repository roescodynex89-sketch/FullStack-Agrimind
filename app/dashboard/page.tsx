"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { authClient } from "@/app/lib/auth-client";
import Image from "next/image";
import {
  FiLoader,
  FiEdit3,
  FiTrash2,
  FiLayers,
  FiMapPin,
  FiMessageSquare,
  FiTrendingUp,
  FiAlertCircle,
  FiPlus,
  FiGrid,
  FiX,
} from "react-icons/fi";
import Link from "next/link";
import {
  getUserCrops,
  updateCrop,
  deleteCrop,
} from "@/app/actions/crop";
import {
  getUserComments,
  updateComment,
  deleteComment,
} from "@/app/actions/comment";

interface Crop {
  id: string;
  name: string;
  imageUrl?: string;
  description?: string;
  difficulty?: string;
  season?: string;
  location?: string;
  userId?: string;
}

interface Comment {
  id: string;
  text: string;
  createdAt: string;
  crop?: { name: string };
}

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"crops" | "comments">("crops");
  const [crops, setCrops] = useState<Crop[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [commentEditText, setCommentEditText] = useState("");

  // Crop edit modal state
  const [editingCrop, setEditingCrop] = useState<Crop | null>(null);

  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const user = session?.user;

  const fetchDashboardData = useCallback(async () => {
    setLoadingData(true);
    setFetchError(null);
    try {
      const [userCrops, userComments] = await Promise.all([
        getUserCrops(),
        getUserComments(),
      ]);
      setCrops(userCrops);
      setComments(userComments);
    } catch (error: any) {
      console.error("Dashboard synchronization error:", error);
      setFetchError(
        error.message || "Something went wrong while loading your dashboard.",
      );
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => {
    if (!sessionLoading && !user) {
      router.push("/login");
      return;
    }
    if (user) {
      fetchDashboardData();
    }
  }, [user?.id, sessionLoading, fetchDashboardData]);

  // Crop update via modal
  const handleUpdateCrop = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCrop) return;
    if (!editingCrop.name.trim()) return alert("Crop name is required");

    setActionLoading(editingCrop.id);
    try {
      const result = await updateCrop(editingCrop.id, editingCrop);

      if (result.success) {
        setCrops((prev) =>
          prev.map((crop) =>
            crop.id === editingCrop.id ? { ...crop, ...editingCrop } : crop,
          ),
        );
        setEditingCrop(null);
      } else {
        alert(result.error || "Failed to update crop data.");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong while updating.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteCrop = async (id: string) => {
    if (
      !confirm("Are you sure you want to delete this crop intelligence data?")
    )
      return;
    setActionLoading(id);
    try {
      const result = await deleteCrop(id);
      if (result.success) {
        setCrops((prev) => prev.filter((crop) => crop.id !== id));
      } else {
        alert(result.error || "Failed to delete crop profile.");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong while deleting.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteComment = async (id: string) => {
    if (!confirm("Delete this comment permanently?")) return;
    setActionLoading(id);
    try {
      const result = await deleteComment(id);
      if (result.success) {
        setComments((prev) => prev.filter((cmt) => cmt.id !== id));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleUpdateComment = async (id: string) => {
    if (!commentEditText.trim()) return;
    setActionLoading(id);
    try {
      const result = await updateComment(id, commentEditText);
      if (result.success) {
        setComments((prev) =>
          prev.map((cmt) =>
            cmt.id === id ? { ...cmt, text: commentEditText } : cmt,
          ),
        );
        setEditingCommentId(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  if (sessionLoading || loadingData) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-[#EEF7EE]/20 flex items-center justify-center">
        <FiLoader className="animate-spin text-[#2E7D32]" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#81C784] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#1F2937]">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-sm text-[#4B5563] mt-0.5">
              Manage your agricultural tracking logs and activities.
            </p>
          </div>
          <Link
            href="/add-crops"
            className="bg-[#2E7D32] hover:bg-[#225e25] text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-md transition-all"
          >
            <FiPlus /> Add New Crop
          </Link>
        </div>

        {fetchError && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-4 mb-6 flex items-center gap-2">
            <FiAlertCircle /> {fetchError}
          </div>
        )}

        <div className="flex border-b border-[#E5E7EB] mb-6 gap-6">
          <button
            onClick={() => setActiveTab("crops")}
            className={`pb-3 text-sm font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 ${activeTab === "crops" ? "border-[#2E7D32] text-[#2E7D32]" : "border-transparent text-[#6B7280]"}`}
          >
            <FiGrid size={16} /> My Crops ({crops.length})
          </button>
          <button
            onClick={() => setActiveTab("comments")}
            className={`pb-3 text-sm font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 ${activeTab === "comments" ? "border-[#2E7D32] text-[#2E7D32]" : "border-transparent text-[#6B7280]"}`}
          >
            <FiMessageSquare size={16} /> My Comments ({comments.length})
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "crops" ? (
            <motion.div
              key="crops"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {crops.length === 0 ? (
                <div className="bg-white border border-[#E5E7EB] p-8 text-center rounded-2xl col-span-2 text-[#6B7280]">
                  <FiAlertCircle
                    className="mx-auto mb-2 text-gray-400"
                    size={28}
                  />
                  No crops registered under your profile yet.
                </div>
              ) : (
                crops.map((crop) => (
                  <div
                    key={crop.id}
                    className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm flex gap-4 items-start hover:shadow-md transition-all"
                  >
                    <Image
                      src={
                        crop.imageUrl ||
                        "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=200&q=80"
                      }
                      alt={crop.name}
                      width={80}
                      height={80}
                      className="w-20 h-20 rounded-xl object-cover bg-gray-100 border border-gray-100 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-[#1F2937] text-lg truncate">
                        {crop.name}
                      </h3>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#6B7280] mt-1">
                        <span className="flex items-center gap-1">
                          <FiLayers /> {crop.difficulty}
                        </span>
                        <span className="flex items-center gap-1">
                          <FiTrendingUp /> {crop.season}
                        </span>
                        <span className="flex items-center gap-1">
                          <FiMapPin /> {crop.location}
                        </span>
                      </div>
                      <p className="text-xs text-[#4B5563] line-clamp-2 mt-2 leading-relaxed">
                        {crop.description}
                      </p>

                      <div className="flex justify-end gap-2 mt-4 border-t border-gray-50 pt-3">
                        <button
                          onClick={() => setEditingCrop(crop)}
                          className="p-2 text-gray-600 hover:text-[#2E7D32] hover:bg-[#EEF7EE] rounded-lg text-xs font-semibold flex items-center gap-1"
                        >
                          <FiEdit3 size={15} /> Edit
                        </button>
                        <button
                          disabled={actionLoading === crop.id}
                          onClick={() => handleDeleteCrop(crop.id)}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all text-xs font-semibold flex items-center gap-1 disabled:opacity-40"
                        >
                          <FiTrash2 size={15} />{" "}
                          {actionLoading === crop.id ? "..." : "Delete"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          ) : (
            <motion.div
              key="comments"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="space-y-4"
            >
              {comments.length === 0 ? (
                <div className="bg-white border border-[#E5E7EB] p-8 text-center rounded-2xl text-[#6B7280]">
                  <FiAlertCircle
                    className="mx-auto mb-2 text-gray-400"
                    size={28}
                  />
                  You haven't posted any commentary updates yet.
                </div>
              ) : (
                comments.map((cmt) => (
                  <div
                    key={cmt.id}
                    className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm flex flex-col justify-between gap-3"
                  >
                    <div>
                      <span className="text-xs font-bold text-[#2E7D32] bg-[#EEF7EE] px-2 py-0.5 rounded-md">
                        On {cmt.crop?.name || "a crop"}
                      </span>

                      {editingCommentId === cmt.id ? (
                        <div className="mt-3 space-y-2">
                          <input
                            type="text"
                            value={commentEditText}
                            onChange={(e) => setCommentEditText(e.target.value)}
                            className="w-full bg-white border border-[#E5E7EB] text-[#1F2937] text-sm rounded-xl px-3 py-2 outline-none focus:border-[#2E7D32]"
                          />
                          <div className="flex gap-2 justify-end text-xs">
                            <button
                              onClick={() => setEditingCommentId(null)}
                              className="px-3 py-1 bg-gray-100 rounded-lg"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleUpdateComment(cmt.id)}
                              className="px-3 py-1 bg-[#2E7D32] text-white rounded-lg"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-[#4B5563] mt-2 italic">
                          "{cmt.text}"
                        </p>
                      )}
                    </div>

                    {editingCommentId !== cmt.id && (
                      <div className="flex justify-end gap-3 text-xs border-t border-gray-50 pt-2">
                        <button
                          onClick={() => {
                            setEditingCommentId(cmt.id);
                            setCommentEditText(cmt.text);
                          }}
                          className="text-[#6B7280] hover:text-[#2E7D32] font-semibold flex items-center gap-1"
                        >
                          <FiEdit3 size={13} /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteComment(cmt.id)}
                          className="text-[#6B7280] hover:text-red-600 font-semibold flex items-center gap-1"
                        >
                          <FiTrash2 size={13} /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- CROP EDIT MODAL --- */}
        {editingCrop && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setEditingCrop(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
              >
                <FiX size={20} />
              </button>
              <h3 className="text-lg font-bold text-[#1F2937] mb-4">
                Edit Crop
              </h3>
              <form onSubmit={handleUpdateCrop} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#4B5563] uppercase mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={editingCrop.name}
                    onChange={(e) =>
                      setEditingCrop({ ...editingCrop, name: e.target.value })
                    }
                    className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-2 text-sm text-[#1F2937] outline-none focus:border-[#2E7D32]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#4B5563] uppercase mb-1">
                    Difficulty
                  </label>
                  <input
                    type="text"
                    value={editingCrop.difficulty || ""}
                    onChange={(e) =>
                      setEditingCrop({
                        ...editingCrop,
                        difficulty: e.target.value,
                      })
                    }
                    className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-2 text-sm text-[#1F2937] outline-none focus:border-[#2E7D32]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#4B5563] uppercase mb-1">
                    Season
                  </label>
                  <input
                    type="text"
                    value={editingCrop.season || ""}
                    onChange={(e) =>
                      setEditingCrop({
                        ...editingCrop,
                        season: e.target.value,
                      })
                    }
                    className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-2 text-sm text-[#1F2937] outline-none focus:border-[#2E7D32]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#4B5563] uppercase mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={editingCrop.location || ""}
                    onChange={(e) =>
                      setEditingCrop({
                        ...editingCrop,
                        location: e.target.value,
                      })
                    }
                    className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-2 text-sm text-[#1F2937] outline-none focus:border-[#2E7D32]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#4B5563] uppercase mb-1">
                    Description
                  </label>
                  <textarea
                    value={editingCrop.description || ""}
                    onChange={(e) =>
                      setEditingCrop({
                        ...editingCrop,
                        description: e.target.value,
                      })
                    }
                    rows={3}
                    className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-2 text-sm text-[#1F2937] outline-none focus:border-[#2E7D32] resize-none"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingCrop(null)}
                    className="px-4 py-2 text-sm font-medium bg-gray-100 rounded-xl text-[#4B5563]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading === editingCrop.id}
                    className="px-4 py-2 text-sm font-bold bg-[#2E7D32] hover:bg-[#225e25] text-white rounded-xl shadow disabled:opacity-40"
                  >
                    {actionLoading === editingCrop.id
                      ? "Saving..."
                      : "Save Changes"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}