"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ref, get } from "firebase/database";
import { db } from "@/firebase/config";

export default function FacultyLoginPage() {
  const [staffType, setStaffType] = useState("teaching");
  const [employeeId, setEmployeeId] = useState("");
  const [email, setEmail] = useState("");

  const router = useRouter();

 const handleFacultyLogin = async () => {
    if (!employeeId) {
  router.push("/invalid-login");
  return;
}

    if (staffType === "teaching") {
     if (!email) {
  router.push("/invalid-login");
  return;
}

      const allowedDomains = [
  "@iadc.ac.in",
  "@iasms.edu.in",
  "@indianacademy.edu.in"
];

const emailValid = allowedDomains.some((domain) =>
  email.toLowerCase().endsWith(domain)
);

if (!emailValid) {
  router.push("/invalid-login");
  return;
}
    }

    const facultyRef = ref(db, "facultyVoters/" + employeeId.trim());
const facultySnapshot = await get(facultyRef);

if (!facultySnapshot.exists()) {
  router.push("/invalid-login");
  return;
}

const facultyRecord = facultySnapshot.val();
if (facultyRecord.staffType && facultyRecord.staffType !== staffType) {
  router.push("/invalid-login");
  return;
}

if (
  staffType === "teaching" &&
  facultyRecord.email &&
  facultyRecord.email.toLowerCase() !== email.toLowerCase()
) {
  router.push("/invalid-login");
  return;
}

    localStorage.setItem(
      "facultyData",
      JSON.stringify({
        employeeId: employeeId,
        email: staffType === "teaching" ? email : "",
        staffType: staffType,
      })
    );

    router.push("/faculty-vote");
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center px-6">
      <div className="absolute top-[-150px] left-[-150px] w-[500px] h-[500px] bg-purple-700 opacity-30 blur-[150px] rounded-full"></div>
      <div className="absolute bottom-[-150px] right-[-150px] w-[500px] h-[500px] bg-red-600 opacity-30 blur-[150px] rounded-full"></div>

      <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl">
        <div className="p-12 text-white flex flex-col justify-center">
          <div className="bg-white rounded-3xl p-3 w-fit mb-8">
            <img src="/logo.png" alt="College Logo" className="w-56" />
          </div>

          <p className="text-pink-400 tracking-[0.3em] text-sm uppercase mb-4">
            Faculty & Staff Election Access
          </p>

          <h1 className="text-5xl font-bold leading-tight">
            Faculty Voting Portal
          </h1>

          <p className="text-gray-300 mt-6 text-lg leading-relaxed">
            A secure digital voting interface for teaching, non-teaching,
            and support staff members.
          </p>

          <div className="mt-8 space-y-4 text-gray-300">
            <p>✓ Teaching and non-teaching staff access</p>
            <p>✓ Other staff access using Employee ID</p>
            <p>✓ Confidential ranked voting system</p>
            <p>✓ Admin-only result visibility</p>
          </div>
        </div>

        <div className="bg-black/50 p-12 flex items-center">
          <div className="w-full">
            <h2 className="text-4xl font-bold text-white text-center mb-3">
              Staff Login
            </h2>

            <p className="text-gray-400 text-center mb-8">
              Select your staff category to continue
            </p>

            <div className="grid grid-cols-2 gap-3 mb-8">
              <button
                onClick={() => setStaffType("teaching")}
                className={`p-4 rounded-2xl font-bold transition ${
                  staffType === "teaching"
                    ? "bg-gradient-to-r from-red-600 to-purple-700 text-white"
                    : "bg-white/10 text-gray-300"
                }`}
              >
                Teaching / Non-Teaching Staff
              </button>

              <button
                onClick={() => setStaffType("other")}
                className={`p-4 rounded-2xl font-bold transition ${
                  staffType === "other"
                    ? "bg-gradient-to-r from-red-600 to-purple-700 text-white"
                    : "bg-white/10 text-gray-300"
                }`}
              >
                Other Staffs
              </button>
            </div>

            <input
              type="text"
              placeholder="Employee ID"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              className="w-full p-4 rounded-2xl bg-white/10 border border-white/10 text-white mb-5 outline-none focus:border-pink-500"
            />

            {staffType === "teaching" && (
              <input
                type="email"
                placeholder="Official Email ID"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 rounded-2xl bg-white/10 border border-white/10 text-white mb-8 outline-none focus:border-purple-500"
              />
            )}

            <button
              onClick={handleFacultyLogin}
              className="w-72 block mx-auto rounded-2xl py-4 bg-gradient-to-r from-red-600 to-purple-700 text-white font-bold hover:scale-105 transition"
            >
              Continue to Faculty Vote
            </button>

            <p className="text-center text-xs text-gray-500 mt-8">
              Access restricted to authorized faculty and staff members only.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}