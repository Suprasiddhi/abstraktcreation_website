"use client";

import React, { useState } from "react";
import PeopleModal, { MemberData } from "./PeopleModal";

interface PeopleFormProps {
  data: {
    team: MemberData[];
    extraCount?: number;
  };
  onChange: (data: any) => void;
  onStartEditing?: () => void;
  disabled?: boolean;
}

export default function PeopleForm({ data, onChange, onStartEditing, disabled = false }: PeopleFormProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const toggleBookmark = (index: number) => {
    if (onStartEditing) onStartEditing();
    const list = [...(data?.team || [])];
    const target = list[index];
    list[index] = { ...target, isBookmarked: !target?.isBookmarked };
    onChange({ ...data, team: list });
  };

  const handleStartEdit = (index: number) => {
    if (onStartEditing) onStartEditing();
    setEditingIndex(index);
  };

  const handleSaveModal = (updatedMember: MemberData) => {
    if (onStartEditing) onStartEditing();
    const list = [...(data?.team || [])];
    if (editingIndex !== null) {
      list[editingIndex] = updatedMember;
    }
    onChange({ ...data, team: list });
    setEditingIndex(null);
  };

  const removeTeamMember = (index: number) => {
    const target = (data?.team || [])[index];
    const memberName = target?.name || "this member";
    if (!window.confirm(`Are you sure you want to delete "${memberName}"?`)) {
      return;
    }
    if (onStartEditing) onStartEditing();
    const list = (data?.team || []).filter((_, i) => i !== index);
    onChange({ ...data, team: list });
  };

  const teamList = data?.team || [];
  const bookmarkedCount = teamList.filter((m) => m.isBookmarked).length;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
        <span className="text-sm font-semibold text-neutral-500 font-mono flex items-center gap-2">
          Roster Team List ({teamList.length})
          {bookmarkedCount > 0 && (
            <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-mono font-bold">
              {bookmarkedCount} Bookmarked
            </span>
          )}
        </span>
      </div>

      <div className="flex flex-col gap-4">
        {teamList.map((member, index) => (
          <div
            key={index}
            className={`border rounded-xl p-5 flex items-center justify-between gap-4 relative group transition-all ${
              member.isBookmarked
                ? "border-amber-300 bg-amber-50/40 shadow-sm"
                : "border-neutral-200/80 bg-neutral-50/50 hover:border-neutral-300"
            }`}
          >
            <div className="flex items-center gap-4 flex-1">
              {member.avatarUrl ? (
                <img
                  src={member.avatarUrl}
                  alt={member.name}
                  className="w-12 h-15 aspect-[4/5] rounded-xl object-cover border border-neutral-200 shrink-0"
                />
              ) : (
                <div className="w-12 h-15 aspect-[4/5] rounded-xl bg-neutral-200/60 border border-neutral-200 flex items-center justify-center text-neutral-400 shrink-0 font-bold font-mono text-sm">
                  {member.name ? member.name.charAt(0).toUpperCase() : "?"}
                </div>
              )}

              <div className="flex flex-col gap-1 min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono font-bold text-brand bg-brand/10 px-2 py-0.5 rounded">
                    Member {String(index + 1).padStart(2, "0")}
                  </span>
                  <h4 className="text-base font-bold text-foreground truncate uppercase">
                    {member.name || "UNTITLED MEMBER"}
                  </h4>
                  {member.isBookmarked && (
                    <span className="text-[10px] font-mono font-bold bg-amber-500 text-white px-2 py-0.5 rounded uppercase flex items-center gap-1">
                      ★ BOOKMARKED
                    </span>
                  )}
                  {member.socials && member.socials.length > 0 ? (
                    member.socials.map((s, sIdx) => (
                      <span key={sIdx} className="text-[10px] font-mono font-bold bg-neutral-200/80 text-neutral-700 px-2 py-0.5 rounded uppercase">
                        {s.platform}
                      </span>
                    ))
                  ) : member.socialUrl ? (
                    <span className="text-[10px] font-mono font-bold bg-neutral-200/80 text-neutral-700 px-2 py-0.5 rounded uppercase">
                      {member.socialPlatform || "social"}
                    </span>
                  ) : null}
                </div>
                <p className="text-xs text-neutral-500 font-medium truncate">
                  {member.role || "No role specified"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* Bookmark Icon Button */}
              <button
                type="button"
                onClick={() => toggleBookmark(index)}
                className={`p-2.5 rounded-lg transition-all cursor-pointer shadow-sm border ${
                  member.isBookmarked
                    ? "bg-amber-500 border-amber-500 text-white hover:bg-amber-600"
                    : "bg-white border-neutral-200 text-neutral-600 hover:border-amber-400 hover:text-amber-500"
                }`}
                title={member.isBookmarked ? "Remove bookmark" : "Bookmark member"}
                aria-label={member.isBookmarked ? "Remove bookmark" : "Bookmark member"}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill={member.isBookmarked ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4"
                >
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                </svg>
              </button>

              {/* Delete Icon Button */}
              <button
                type="button"
                onClick={() => removeTeamMember(index)}
                className="p-2.5 rounded-lg bg-white border border-neutral-200 hover:border-red-500 text-neutral-600 hover:text-red-600 transition-colors cursor-pointer shadow-sm"
                title="Delete member"
                aria-label="Delete member"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4"
                >
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>

              {/* Edit Icon Button */}
              <button
                type="button"
                onClick={() => handleStartEdit(index)}
                className="p-2.5 rounded-lg bg-white border border-neutral-200 hover:border-brand text-neutral-600 hover:text-brand transition-colors cursor-pointer shadow-sm"
                title="Edit member"
                aria-label="Edit member"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4"
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </button>
            </div>
          </div>
        ))}

        {teamList.length === 0 && (
          <p className="text-sm text-neutral-400 font-mono italic text-center py-8">
            No team members found. Click &quot;+ Add people&quot; to add a member.
          </p>
        )}
      </div>

      {/* Modal for editing an existing team member */}
      {editingIndex !== null && (
        <PeopleModal
          member={teamList[editingIndex]}
          onSave={handleSaveModal}
          onClose={() => setEditingIndex(null)}
        />
      )}
    </div>
  );
}
