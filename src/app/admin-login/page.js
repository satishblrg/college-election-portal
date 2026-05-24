"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleAdminLogin = () => {
    if (email !== "satish.1221@indianacademy.edu.in") {
      alert("Access denied. Only authorized admin can login.");
      return;
    }

    localStorage.setItem("adminLoggedIn", "true");
    router.push("/admin");
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-gradient-to-br from-purple-950 to-black border border-pink-500 rounded-3xl p-10 text-center">
        <div className="bg-white p-3 rounded-2xl w-fit mx-auto mb-8">
          <img src="/logo.png" alt="College Logo" className="w-40" />
        </div>

        <h1 className="text-4xl font-bold text-white mb-3">
          Admin Login
        </h1>

        <p className="text-gray-400 mb-8">
          Enter authorized admin email
        </p>

        <input
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-4 rounded-2xl bg-white/10 border border-white/10 text-white mb-6 outline-none focus:border-pink-500"
        />

        <button
          onClick={handleAdminLogin}
          className="w-full bg-gradient-to-r from-red-500 to-purple-600 p-4 rounded-2xl text-white font-bold"
        >
          Login to Dashboard
        </button>
      </div>
    </div>
  );
}