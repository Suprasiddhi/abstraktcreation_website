"use client";

import React, { useState, useEffect } from "react";
import Button from "../../components/ui/Button";

export interface CareerRoleData {
  id?: number;
  title: string;
  location: string;
  type: string;
}

interface RoleModalProps {
  role?: CareerRoleData | null;
  onSave: (role: CareerRoleData) => void;
  onClose: () => void;
}

export default function RoleModal({ role, onSave, onClose }: RoleModalProps) {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("Full-time");
  const [error, setError] = useState("");

  useEffect(() => {
    if (role) {
      setTitle(role.title || "");
      setLocation(role.location || "");
      setType(role.type || "Full-time");
    } else {
      setTitle("");
      setLocation("Lalitpur");
      setType("Full-time");
    }
  }, [role]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Job title is required.");
      return;
    }
    if (!location.trim()) {
      setError("Location is required.");
      return;
    }

    onSave({
      ...(role?.id ? { id: role.id } : {}),
      title: title.trim(),
      location: location.trim(),
      type: type.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white border border-neutral-200 rounded-2xl max-w-md w-full p-6 md:p-8 shadow-2xl relative my-8">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-4 mb-6">
          <div>
            <h3 className="text-xl font-black uppercase text-foreground">
              {role ? "Edit Job Position" : "Add Job Position"}
            </h3>
            <p className="text-xs text-neutral-400 font-mono uppercase mt-1">
              {role ? "Modify opening details" : "Add a new open position to Careers"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-100 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200 flex items-center justify-center transition-colors font-bold text-sm cursor-pointer"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-[11px] font-mono font-bold tracking-widest text-neutral-500 uppercase mb-2">
              Job Title *
            </label>
            <input
              type="text"
              placeholder="e.g. Frontend Engineer"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand font-semibold"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono font-bold tracking-widest text-neutral-500 uppercase mb-2">
              Location *
            </label>
            <input
              type="text"
              placeholder="e.g. Lalitpur / Hybrid / Dallas"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono font-bold tracking-widest text-neutral-500 uppercase mb-2">
              Employment Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand bg-white"
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-neutral-500 hover:text-neutral-800 transition-colors uppercase"
            >
              Cancel
            </button>
            <Button variant="primary" type="submit" className="py-2.5 px-6 text-xs font-bold uppercase">
              {role ? "Update Position" : "Add Position"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
