"use client";

import { useRouter } from "next/navigation";

export default function InvalidLoginPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-8">
      <div className="bg-white/10 border border-red-500 rounded-3xl p-12 max-w-xl text-center shadow-[0_0_60px_rgba(239,68,68,0.35)]">
      <div className="bg-white rounded-2xl p-3 w-fit mx-auto mb-8">
      <img src="/logo.png" alt="College Logo" className="w-40" />
      </div>
        <h1 className="text-5xl font-bold text-red-500 mb-6">
          Invalid Login Credentials
        </h1>

        <p className="text-gray-300 text-lg mb-8">
          The Employee ID and Email ID do not match our official records.
        </p>

        <button
          onClick={() => router.push("/faculty-login")}
          className="bg-red-600 px-8 py-4 rounded-2xl font-bold"
        >
          Go Back to Faculty Login
        </button>
      </div>
    </div>
  );
}