"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useInventory } from "@/lib/InventoryContext";

export default function LoginPage() {
  const router = useRouter();
  const { login, problems } = useInventory();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const activeProblemsCount = problems.filter((p) => !p.isSolved).length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim().toLowerCase() === "test" && password === "test") {
      setErrorMsg("");
      login();
      router.push("/admin");
    } else {
      setErrorMsg("Forkert brugernavn eller adgangskode. (Brugernavn: test, Adgangskode: test)");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-6 sm:p-12">
      {/* Top Left Navigation */}
      <div className="max-w-7xl mx-auto mb-8">
        <Link
          href="/"
          className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-100 text-xs font-semibold text-slate-700 rounded-lg shadow-sm transition-colors"
        >
          Tilbage til Forsiden
        </Link>
      </div>

      {/* Header Banner */}
      <div className="text-center max-w-xl mx-auto mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2 sm:text-5xl">
          Værkstedets Inventarsystem
        </h1>
        <p className="text-base text-slate-500 font-normal mb-3">
          Log ind for at administrere inventar
        </p>

        {/* Warning Indicator Alert matching screenshot */}
        {activeProblemsCount > 0 && (
          <div className="inline-flex items-center gap-1.5 text-rose-500 text-xs font-semibold">
            <span>⚠️</span>
            <span>{activeProblemsCount} {activeProblemsCount === 1 ? "aktivt problem kræver" : "aktive problemer kræver"} opmærksomhed</span>
          </div>
        )}
      </div>

      {/* Login Card Container matching screenshot */}
      <div className="max-w-md mx-auto bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden">
        {/* Top Accent Line */}
        <div className="h-1.5 w-full bg-blue-600" />

        <div className="p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-1">Log ind</h2>
          <p className="text-xs text-slate-400 mb-6">
            Få adgang til værkstedets inventarsystem
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl font-medium">
                {errorMsg}
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Brugernavn
              </label>
              <input
                type="text"
                placeholder="Indtast dit brugernavn"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-none placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Adgangskode
              </label>
              <input
                type="password"
                placeholder="Indtast din adgangskode"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-none placeholder:text-slate-400"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow transition-colors cursor-pointer"
            >
              Log ind
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
