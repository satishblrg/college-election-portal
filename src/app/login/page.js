"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ref, get } from "firebase/database";
import { db } from "@/firebase/config";

export default function LoginPage() {
    const [rollNumber, setRollNumber] = useState("");
const [email, setEmail] = useState("");
const router = useRouter();
  return (
    <div className="min-h-screen bg-black overflow-hidden relative flex items-center justify-center px-4">

      {/* Background Glow */}
      <div className="absolute top-[-200px] left-[-150px] w-[500px] h-[500px] bg-purple-700 opacity-30 blur-[150px] rounded-full"></div>

      <div className="absolute bottom-[-200px] right-[-150px] w-[500px] h-[500px] bg-red-600 opacity-30 blur-[150px] rounded-full"></div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 rounded-3xl overflow-hidden border border-white/10 shadow-2xl backdrop-blur-xl bg-white/5">

        {/* Left Section */}
        <div className="p-12 flex flex-col justify-center text-white relative">

          <div className="mb-8 text-center">

  <div className="bg-white rounded-3xl p-2 w-fit mx-auto shadow-2xl shadow-red-900/30 mb-8">
    <Image
      src="/logo.png"
      alt="College Logo"
      width={250}
      height={110}
      className="mx-auto"
    />
  </div>

            <h1 className="text-5xl font-bold leading-tight">
              College Election Portal
            </h1>

            <p className="text-gray-300 mt-6 text-lg leading-relaxed">
              Secure and transparent digital voting system for student council elections.
            </p>
          </div>

          <div className="space-y-4 text-gray-300">
            <p>✓ One Student • One Vote</p>
            <p>✓ Ranked Preference Voting</p>
            <p>✓ Real-Time Poll Monitoring</p>
            <p>✓ Secure Admin Dashboard</p>
          </div>
        </div>

        {/* Right Section */}
        <div className="bg-black/40 backdrop-blur-xl p-12 flex items-center">

          <div className="w-full">
            <h2 className="text-4xl font-bold text-white text-center mb-3">
              Student Login
            </h2>

            <p className="text-gray-400 text-center mb-10">
              Login using your registered details
            </p>

            <input
              type="text"
              placeholder="Register Number"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              className="w-full p-4 rounded-2xl bg-white/10 border border-white/10 text-white mb-5 outline-none focus:border-red-500"
            />

            <input
              type="email"
              placeholder="College Email ID"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 rounded-2xl bg-white/10 border border-white/10 text-white mb-8 outline-none focus:border-purple-500"
            />

            <button
  onClick={async () => {
    if (!rollNumber) {
      alert("Please enter your Roll Number");
      return;
    }

    if (!email) {
      alert("Please enter your College Email");
      return;
    }

    const allowedDomains = [
      "@iadc.ac.in",
      "@iasms.edu.in",
      "@indianacademy.edu.in"
    ];

    const emailValid = allowedDomains.some(domain =>
      email.endsWith(domain)
    );

    if (!emailValid) {
     router.push("/access-denied");
      return;
    }

    const voterRef = ref(db, "voters/" + rollNumber.trim().toUpperCase());
const voterSnapshot = await get(voterRef);

if (!voterSnapshot.exists()) {
  alert("You are not listed in the official voter database.");
  return;
}

const voterData = voterSnapshot.val();

if (voterData.email && voterData.email.toLowerCase() !== email.toLowerCase()) {
  alert("Register Number and Email ID do not match.");
  return;
}

   localStorage.setItem(
  "studentData",
  JSON.stringify({
    rollNumber: rollNumber,
    email: email,
  })
);

router.push("/vote");
  }}

  className="w-72 block mx-auto rounded-2xl py-3 bg-gradient-to-r from-red-600 to-purple-700 ..."
>
  Continue to Vote
</button>

            <p className="text-center text-xs text-gray-500 mt-8">
              Only verified students from the official voter database can vote.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}