"use client";

import { useRouter } from "next/navigation";

export default function AlreadyVotedPage() {
  const router = useRouter();

  const exitPortal = () => {
    localStorage.removeItem("studentData");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="max-w-2xl w-full bg-gradient-to-br from-red-950 to-black border border-red-500 rounded-3xl p-12 text-center shadow-2xl">
        <div className="bg-white p-3 rounded-2xl w-fit mx-auto mb-8">
          <img src="/logo.png" alt="College Logo" className="w-40" />
        </div>

        <div className="text-7xl mb-6">⚠️</div>

        <h1 className="text-5xl font-bold text-white mb-6">
          Vote Already Recorded
        </h1>

        <p className="text-gray-300 text-xl leading-relaxed">
          Our system shows that your vote has already been submitted successfully.
        </p>

        <p className="text-red-400 mt-4 text-lg">
          Multiple voting attempts are not allowed.
        </p>

        <div className="mt-10">
          <button
            onClick={exitPortal}
            className="bg-gradient-to-r from-red-500 to-pink-600 px-10 py-4 rounded-2xl text-xl font-bold text-white hover:scale-105 transition"
          >
            Exit Portal
          </button>
        </div>
      </div>
    </div>
  );
}