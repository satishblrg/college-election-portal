"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function HomePage() {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState("");
  useEffect(() => {
  const electionStartTime = new Date();
  electionStartTime.setMinutes(electionStartTime.getMinutes() + 10);

  const timer = setInterval(() => {
    const now = new Date();
    const difference = electionStartTime - now;

    if (difference <= 0) {
      setTimeLeft("Election can start now");
      clearInterval(timer);
      return;
    }

    const minutes = Math.floor((difference / 1000 / 60) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    setTimeLeft(
      `${String(minutes).padStart(2, "0")} : ${String(seconds).padStart(2, "0")}`
    );
  }, 1000);

  return () => clearInterval(timer);
}, []);

  return (
    <div className="min-h-screen bg-black relative overflow-hidden text-white">
      <div className="absolute top-[-150px] left-[-150px] w-[500px] h-[500px] bg-purple-700 opacity-30 blur-[150px] rounded-full"></div>

      <div className="absolute bottom-[-150px] right-[-150px] w-[500px] h-[500px] bg-red-600 opacity-30 blur-[150px] rounded-full"></div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
        <div className="bg-white rounded-3xl p-4 mb-10 shadow-2xl">
          <img src="/logo.png" alt="College Logo" className="w-64" />
        </div>

        <p className="text-pink-400 tracking-[0.4em] uppercase text-sm mb-4">
          Indian Academy Group of Institutions
        </p>

        <h1 className="text-6xl font-bold text-center leading-tight">
          Digital Election Portal
        </h1>

        <p className="text-gray-300 text-xl text-center max-w-3xl mt-8 leading-relaxed">
          Secure ranked-choice election system for students, faculty,
          and administrative election management.
        </p>

        <div className="mt-10 bg-white/10 border border-pink-500 rounded-3xl px-10 py-6 text-center">
  <p className="text-pink-400 text-sm tracking-[0.3em] uppercase mb-3">
    Election Starts In
  </p>

  <h2 className="text-5xl font-bold text-white">
    {timeLeft}
  </h2>
</div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 w-full max-w-6xl">
          <div
            onClick={() => router.push("/login")}
            className="cursor-pointer bg-white/5 border border-white/10 rounded-3xl p-10 hover:border-pink-500 hover:scale-105 transition duration-300 backdrop-blur-xl"
          >
            <div className="text-6xl mb-6">🎓</div>

            <h2 className="text-3xl font-bold mb-4">
              Student Voting
            </h2>

            <p className="text-gray-400 leading-relaxed">
              Access the student election voting portal using your
              college credentials.
            </p>
          </div>

          <div
            onClick={() => router.push("/faculty-login")}
            className="cursor-pointer bg-white/5 border border-white/10 rounded-3xl p-10 hover:border-purple-500 hover:scale-105 transition duration-300 backdrop-blur-xl"
          >
            <div className="text-6xl mb-6">👨‍🏫</div>

            <h2 className="text-3xl font-bold mb-4">
              Faculty & Staff Voting
            </h2>

            <p className="text-gray-400 leading-relaxed">
              Voting access for teaching staff, non-teaching staff,
              and support staff members.
            </p>
          </div>

          <div
            onClick={() => router.push("/admin-login")}
            className="cursor-pointer bg-white/5 border border-white/10 rounded-3xl p-10 hover:border-red-500 hover:scale-105 transition duration-300 backdrop-blur-xl"
          >
            <div className="text-6xl mb-6">🛡️</div>

            <h2 className="text-3xl font-bold mb-4">
              Admin Dashboard
            </h2>

            <p className="text-gray-400 leading-relaxed">
              Election monitoring, analytics, voting control,
              and result management portal.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}