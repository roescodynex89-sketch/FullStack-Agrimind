"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { authClient } from "@/app/lib/auth-client";
import {
  FiLoader,
  FiArrowLeft,
  FiSend,
  FiMapPin,
  FiLayers,
  FiSun,
  FiActivity,
  FiMessageSquare,
} from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";
import { getCropById } from "@/app/actions/crop";
import { getComments, createComment } from "@/app/actions/comment";

export default function CropDetailsPage() {
  const { id } = useParams();
  const [crop, setCrop] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Comment Submission States
  const [commentText, setCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  // Better Auth Hooks
  const { data: session } = authClient.useSession();
  const user = session?.user;

  useEffect(() => {
    if (id) {
      fetchCropDetails();
      fetchComments();
    }
  }, [id]);

  const fetchCropDetails = async () => {
    try {
      const data = await getCropById(id as string);
      if (!data) throw new Error("Crop not found");
      setCrop(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const data = await getComments(id as string);
      setComments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error loading updates:", err);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !user) return;

    setSubmittingComment(true);
    try {
      const result = await createComment({
        cropId: id as string,
        text: commentText,
      });

      if (result.success) {
        setCommentText("");
        fetchComments(); // Reload updates section dynamically
      } else {
        console.error(result.error);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-[#EEF7EE]/20 flex items-center justify-center">
        <FiLoader className="animate-spin text-[#2E7D32]" size={40} />
      </div>
    );
  }

  if (!crop) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-white flex flex-col items-center justify-center p-4">
        <p className="text-[#6B7280] mb-4">
          Specified crop tracking entry could not be located.
        </p>
        <Link
          href="/crops"
          className="text-[#2E7D32] font-semibold flex items-center gap-1 hover:underline"
        >
          <FiArrowLeft /> Back to directory
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#81C784] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/crops"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2E7D32] hover:underline mb-6"
        >
          <FiArrowLeft /> Back to Explore Directory
        </Link>

        {/* Master Details Panel */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-xl mb-8">
          <Image
            src={crop.imageUrl}
            alt={crop.name}
            width={100}
            height={100}
            className="w-full h-72 sm:h-96 object-cover bg-gray-50"
          />

          <div className="p-6 sm:p-8">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#1F2937] mb-4">
              {crop.name}
            </h1>

            {/* Parameter Badge Blocks */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 text-center">
                <FiSun className="mx-auto text-[#2E7D32] mb-1" size={18} />
                <span className="block text-[10px] font-bold text-gray-400 uppercase">
                  Season
                </span>
                <span className="text-sm font-semibold text-gray-700">
                  {crop.season || "N/A"}
                </span>
              </div>
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 text-center">
                <FiLayers className="mx-auto text-[#2E7D32] mb-1" size={18} />
                <span className="block text-[10px] font-bold text-gray-400 uppercase">
                  Difficulty
                </span>
                <span className="text-sm font-semibold text-gray-700">
                  {crop.difficulty || "Easy"}
                </span>
              </div>
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 text-center">
                <FiMapPin className="mx-auto text-[#2E7D32] mb-1" size={18} />
                <span className="block text-[10px] font-bold text-gray-400 uppercase">
                  Region
                </span>
                <span className="text-sm font-semibold text-gray-700 truncate block">
                  {crop.location || "Bangladesh"}
                </span>
              </div>
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 text-center">
                <FiActivity className="mx-auto text-[#2E7D32] mb-1" size={18} />
                <span className="block text-[10px] font-bold text-gray-400 uppercase">
                  Uploaded By
                </span>
                <span className="text-sm font-semibold text-gray-700 truncate block">
                  {crop.user?.name || "Expert"}
                </span>
              </div>
            </div>

            {/* Description Sections */}
            <div className="space-y-6 text-[#4B5563] text-sm leading-relaxed">
              <div>
                <h3 className="text-lg font-bold text-[#1F2937] mb-2">
                  Crop Profile Overview
                </h3>
                <p>{crop.description}</p>
              </div>
              {crop.farmingTips && (
                <div>
                  <h3 className="text-lg font-bold text-[#1F2937] mb-2">
                    Advanced Farming Guidance
                  </h3>
                  <p className="bg-green-50/50 border border-[#81C784]/20 p-4 rounded-xl text-gray-700 italic">
                    {crop.farmingTips}
                  </p>
                </div>
              )}
              {crop.commonDiseases && (
                <div>
                  <h3 className="text-lg font-bold text-[#1F2937] mb-2">
                    Risk Mitigations & Vulnerabilities
                  </h3>
                  <p className="bg-red-50/40 border border-red-100 p-4 rounded-xl text-gray-700">
                    {crop.commonDiseases}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ----------------- Comments System Interface ----------------- */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-[#1F2937] mb-6 flex items-center gap-2">
            <FiMessageSquare className="text-[#2E7D32]" /> Discussion Forum (
            {comments.length})
          </h2>

          {/* Conditional Input submission interface based on authentication context */}
          {user ? (
            <form onSubmit={handleCommentSubmit} className="mb-6">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                Write a comment or query
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Ask a question about this cultivation cycle..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="flex-1 bg-white border border-[#E5E7EB] text-[#1F2937] text-sm rounded-xl px-4 py-2.5 outline-none focus:border-[#2E7D32] focus:ring-1 focus:ring-[#2E7D32] transition-all"
                />
                <button
                  type="submit"
                  disabled={submittingComment || !commentText.trim()}
                  className="bg-[#2E7D32] hover:bg-[#225e25] text-white px-4 rounded-xl flex items-center justify-center transition-all disabled:opacity-40"
                >
                  {submittingComment ? (
                    <FiLoader className="animate-spin" />
                  ) : (
                    <FiSend />
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-center text-sm text-[#6B7280] mb-6">
              Please{" "}
              <Link
                href="/login"
                className="text-[#2E7D32] font-bold hover:underline"
              >
                log in
              </Link>{" "}
              to drop analytical notes or field answers here.
            </div>
          )}

          {/* Comments Feed Render */}
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {comments.length === 0 ? (
              <p className="text-xs text-gray-400 italic text-center py-4">
                No tracking inputs yet. Be the first to initiate conversation.
              </p>
            ) : (
              comments.map((cmt) => (
                <div
                  key={cmt.id}
                  className="bg-gray-50/60 border border-gray-100 p-4 rounded-xl"
                >
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-sm font-bold text-[#1F2937]">
                      {cmt.user?.name || "Anonymous"}
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium">
                      {new Date(cmt.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-[#4B5563] leading-relaxed">
                    {cmt.text}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}