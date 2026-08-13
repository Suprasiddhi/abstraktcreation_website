"use client";

import React, { useState, useEffect } from "react";
import Button from "../../components/ui/Button";

// Import modular forms
import HeroForm from "./HeroForm";
import PositionForm from "./PositionForm";
import CapabilitiesForm from "./CapabilitiesForm";
import WorkForm from "./WorkForm";
import FaqForm from "./FaqForm";
import ProcessForm from "./ProcessForm";
import PeopleForm from "./PeopleForm";
import LogosForm from "./LogosForm";

type Tab = "hero" | "logos" | "position" | "capabilities" | "work" | "process" | "people" | "faq";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("hero");
  
  // Site data state
  const [content, setContent] = useState<any>(null);
  const [backupContent, setBackupContent] = useState<any>(null); // For resetting on cancel
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<{ message: string; type: "success" | "error" | "" }>({
    message: "",
    type: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  // Authentication check
  useEffect(() => {
    const savedPassword = localStorage.getItem("admin_password");
    if (savedPassword) {
      verifyPassword(savedPassword);
    } else {
      setLoading(false);
    }
  }, []);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    verifyPassword(password);
  };

  const verifyPassword = async (pass: string) => {
    setAuthError("");
    setLoading(true);
    try {
      // 1. Verify password with backend
      const authRes = await fetch("http://localhost:3001/api/auth/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: pass }),
      });

      if (!authRes.ok) {
        const errorData = await authRes.json();
        setAuthError(errorData.error || "Invalid password.");
        localStorage.removeItem("admin_password");
        return;
      }

      // 2. Fetch content once authorized
      const res = await fetch("http://localhost:3001/api/content");
      if (res.ok) {
        const data = await res.json();
        setContent(data);
        setBackupContent(JSON.parse(JSON.stringify(data)));
        setIsAuthenticated(true);
        localStorage.setItem("admin_password", pass);
      } else {
        setAuthError("Failed to fetch initial server configurations.");
      }
    } catch (err) {
      setAuthError("Could not connect to backend server. Make sure it is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_password");
    setIsAuthenticated(false);
    setPassword("");
    setContent(null);
    setBackupContent(null);
    setIsEditing(false);
  };

  // Generic content state modifier for child forms
  const updateSectionData = (sectionId: Tab, newData: any) => {
    setContent((prev: any) => ({
      ...prev,
      [sectionId]: newData,
    }));
  };

  // API save trigger
  const saveSectionContent = async (sectionId: Tab) => {
    setIsSaving(true);
    setSaveStatus({ message: "", type: "" });
    const savedPassword = localStorage.getItem("admin_password") || password;

    try {
      const sectionData = content[sectionId];
      const res = await fetch(`http://localhost:3001/api/content/${sectionId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": savedPassword,
        },
        body: JSON.stringify(sectionData),
      });

      const responseData = await res.json();
      if (res.ok) {
        setSaveStatus({
          message: `Saved changes to '${sectionId.toUpperCase()}' successfully.`,
          type: "success",
        });
        // Update backup and turn off editing
        setBackupContent(JSON.parse(JSON.stringify(content)));
        setIsEditing(false);
      } else {
        setSaveStatus({
          message: responseData.error || "Failed to save section changes.",
          type: "error",
        });
      }
    } catch (err) {
      setSaveStatus({
        message: "Network error: Failed to contact database backend.",
        type: "error",
      });
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveStatus({ message: "", type: "" }), 3500);
    }
  };

  const [isClearing, setIsClearing] = useState(false);

  const handleClearAllData = async () => {
    if (!window.confirm("ARE YOU SURE YOU WANT TO CLEAR ALL CONTENT FROM THE DATABASE?\n\nThis will reset all text fields to empty and completely delete all projects, FAQs, process steps, and team members. This action is permanent!")) {
      return;
    }

    setIsClearing(true);
    setSaveStatus({ message: "", type: "" });
    const savedPassword = localStorage.getItem("admin_password") || password;

    try {
      const res = await fetch("http://localhost:3001/api/content/clear", {
        method: "POST",
        headers: {
          "x-admin-password": savedPassword,
        },
      });

      const responseData = await res.json();
      if (res.ok) {
        setSaveStatus({
          message: "All database content successfully cleared. Ready for your manual input!",
          type: "success",
        });
        
        // Fetch new empty content from server to update workspace state
        const fetchRes = await fetch("http://localhost:3001/api/content");
        if (fetchRes.ok) {
          const newData = await fetchRes.json();
          setContent(newData);
          setBackupContent(JSON.parse(JSON.stringify(newData)));
        }
        setIsEditing(false);
      } else {
        setSaveStatus({
          message: responseData.error || "Failed to clear database content.",
          type: "error",
        });
      }
    } catch (err) {
      setSaveStatus({
        message: "Network error: Failed to contact database backend.",
        type: "error",
      });
    } finally {
      setIsClearing(false);
      setTimeout(() => setSaveStatus({ message: "", type: "" }), 5000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-sm font-semibold tracking-wider text-neutral-400 font-mono">LOADING PANEL...</p>
      </div>
    );
  }

  // LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 selection:bg-brand/20 selection:text-brand">
        <div className="w-full max-w-md bg-white border border-neutral-200 shadow-xl rounded-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-black tracking-tight text-neutral-900 uppercase">
              ABSTRAKT CONTROL
            </h1>
            <p className="text-xs text-neutral-400 font-mono tracking-widest uppercase mt-2">
              ADMINISTRATIVE CONTROL PANEL
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block text-[11px] font-mono font-bold tracking-widest text-neutral-500 uppercase mb-2">
                ADMIN ACCESS PASSWORD
              </label>
              <input
                type="password"
                placeholder="Enter password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-neutral-300 bg-neutral-50 text-[15px] focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand transition-all font-semibold"
                required
              />
            </div>

            {authError && (
              <span className="text-xs text-red-500 font-semibold bg-red-50 border border-red-200/50 p-2.5 rounded-lg text-center">
                {authError}
              </span>
            )}

            <Button type="submit" variant="primary" className="w-full py-[12px] text-center font-bold">
              Sign In
            </Button>
          </form>
        </div>
      </div>
    );
  }

  // DASHBOARD MAIN VIEW
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-brand/20 selection:text-brand pb-20">
      {/* Admin Navbar */}
      <header className="w-full border-b border-neutral-200/50 py-5 px-6 md:px-12 bg-white sticky top-0 z-40 shadow-sm">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="text-lg font-black tracking-tight text-foreground">
              ABSTRAKT
            </a>
            <span className="text-[10px] font-mono bg-neutral-100 text-neutral-500 font-bold px-2 py-0.5 rounded uppercase">
              CONTROL PANEL
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="text-[13px] font-semibold text-neutral-450 hover:text-red-500 transition-colors uppercase"
          >
            Logout &rarr;
          </button>
        </div>
      </header>

      {/* Main Body Grid */}
      <main className="max-w-[1400px] w-full mx-auto px-6 md:px-12 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Tab Selection Sidebar */}
        <aside className="lg:col-span-3 bg-white border border-neutral-200 rounded-2xl p-4 flex flex-col gap-1.5 shadow-sm">
          <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-neutral-400 uppercase p-2 block border-b border-neutral-100 mb-2">
            SECTIONS LIST
          </span>
          {(["hero", "logos", "position", "capabilities", "work", "faq", "process", "people"] as Tab[]).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setSaveStatus({ message: "", type: "" });
                  setIsEditing(false); // Discard editing status
                  setContent(JSON.parse(JSON.stringify(backupContent))); // Restore original content
                }}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-semibold transition-all uppercase ${
                  isActive
                    ? "bg-brand text-white shadow-md shadow-brand/20 scale-[1.01]"
                    : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-850"
                }`}
              >
                {tab === "position" ? "Statement" : tab === "work" ? "Selected Work" : tab === "logos" ? "Logos" : tab}
              </button>
            );
          })}

          <div className="border-t border-neutral-100 mt-4 pt-4">
            <button
              onClick={handleClearAllData}
              disabled={isClearing}
              className="w-full text-left px-4 py-3 rounded-lg text-sm font-bold text-red-500 hover:bg-red-50 hover:text-red-600 transition-all uppercase cursor-pointer disabled:opacity-50"
            >
              {isClearing ? "Clearing Data..." : "Clear All Data"}
            </button>
          </div>
        </aside>

        {/* Tab Workspace Form Area */}
        <section className="lg:col-span-9 bg-white border border-neutral-200 rounded-2xl p-8 shadow-sm relative">
          
          {/* Header row of tab details */}
          <div className="flex items-center justify-between border-b border-neutral-100 pb-5 mb-8">
            <div>
              <h2 className="text-xl font-black uppercase text-foreground leading-none">
                EDIT {activeTab === "position" ? "Brand Statement" : activeTab === "work" ? "Selected Work" : activeTab}
              </h2>
              <p className="text-xs text-neutral-400 mt-1 font-mono uppercase tracking-wider">
                {isEditing ? "Editing Mode — changes are unsaved" : "View Mode — content is locked"}
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-3">
              {!isEditing && (
                <Button
                  variant="secondary"
                  onClick={() => setIsEditing(true)}
                  className="py-[9px] px-6 font-bold text-[13px]"
                >
                  Edit Section
                </Button>
              )}
            </div>
          </div>

          {/* Toast/Notification Banner */}
          {saveStatus.message && (
            <div
              className={`mb-6 p-4 rounded-xl border font-semibold text-sm flex items-center gap-2.5 transition-all ${
                saveStatus.type === "success"
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-red-50 text-red-700 border-red-200"
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${saveStatus.type === "success" ? "bg-green-500" : "bg-red-500"}`} />
              {saveStatus.message}
            </div>
          )}

          {/* TAB CONTENTS */}
          {activeTab === "hero" && content?.hero && (
            <HeroForm data={content.hero} onChange={(newData) => updateSectionData("hero", newData)} disabled={!isEditing} />
          )}

          {activeTab === "position" && content?.position && (
            <PositionForm data={content.position} onChange={(newData) => updateSectionData("position", newData)} disabled={!isEditing} />
          )}

          {activeTab === "capabilities" && content?.capabilities && (
            <CapabilitiesForm data={content.capabilities} onChange={(newData) => updateSectionData("capabilities", newData)} disabled={!isEditing} />
          )}

          {activeTab === "work" && content?.work && (
            <WorkForm data={content.work} onChange={(newData) => updateSectionData("work", newData)} disabled={!isEditing} />
          )}

          {activeTab === "faq" && content?.faq && (
            <FaqForm data={content.faq} onChange={(newData) => updateSectionData("faq", newData)} disabled={!isEditing} />
          )}

          {activeTab === "process" && content?.process && (
            <ProcessForm data={content.process} onChange={(newData) => updateSectionData("process", newData)} disabled={!isEditing} />
          )}

          {activeTab === "people" && content?.people && (
            <PeopleForm data={content.people} onChange={(newData) => updateSectionData("people", newData)} disabled={!isEditing} />
          )}

          {activeTab === "logos" && content?.logos && (
            <LogosForm data={content.logos} onChange={(newData) => updateSectionData("logos", newData)} disabled={!isEditing} />
          )}

          {/* Footer Save Row */}
          {isEditing && (
            <div className="flex items-center justify-end border-t border-neutral-100 pt-6 mt-10 gap-3 animate-fade-in">
              <button
                onClick={() => {
                  setContent(JSON.parse(JSON.stringify(backupContent)));
                  setIsEditing(false);
                  setSaveStatus({ message: "", type: "" });
                }}
                className="text-[13px] font-semibold text-neutral-400 hover:text-neutral-750 transition-colors uppercase py-2 px-4 cursor-pointer"
              >
                Cancel
              </button>
              <Button
                variant="primary"
                disabled={isSaving}
                onClick={() => saveSectionContent(activeTab)}
                className="py-[10px] px-8 font-bold text-[14px]"
              >
                {isSaving ? "Saving changes..." : "Save Changes"}
              </Button>
            </div>
          )}

        </section>
      </main>
    </div>
  );
}
