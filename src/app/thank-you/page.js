"use client";

import { useRouter } from "next/navigation";

export default function ThankYouPage() {
    const router = useRouter();
    const exitPortal = () => {
  localStorage.removeItem("studentData");
  localStorage.removeItem("facultyData");
  const facultyData = localStorage.getItem("facultyData");

if (facultyData) {
  router.push("/faculty-login");
} else {
  router.push("/login");
}
};

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="max-w-2xl w-full bg-gradient-to-br from-purple-950 to-black border border-pink-500 rounded-3xl p-12 text-center shadow-2xl">
        <div className="bg-white p-3 rounded-2xl w-fit mx-auto mb-8">
          <img src="/logo.png" alt="College Logo" className="w-40" />
        </div>

        <div className="text-7xl mb-6">✅</div>

        <h1 className="text-5xl font-bold text-white mb-6">
          Vote Submitted Successfully
        </h1>

        <p className="text-gray-300 text-xl leading-relaxed">
          Thank you for participating in the student council election.
        </p>

        <p className="text-pink-400 mt-4 text-lg">
          Your vote has been securely recorded.
        </p>

        <div className="mt-10">
          <button
            onClick={exitPortal}
            className="bg-gradient-to-r from-red-500 to-purple-600 px-10 py-4 rounded-2xl text-xl font-bold text-white hover:scale-105 transition"
          >
            Exit Portal
          </button>
        </div>
      </div>
    </div>
  );
}