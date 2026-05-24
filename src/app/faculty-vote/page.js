"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ref, set, get } from "firebase/database";
import { db } from "@/firebase/config";

export default function FacultyVotePage() {
  const [facultyData, setFacultyData] = useState(null);
  const [votes, setVotes] = useState({});
  const router = useRouter();

  useEffect(() => {
  const checkElectionStatus = async () => {
    const data = localStorage.getItem("facultyData");

    if (!data) {
      router.push("/faculty-login");
      return;
    }

    const settingsRef = ref(db, "settings/electionStatus");
    const settingsSnapshot = await get(settingsRef);

    if (settingsSnapshot.exists()) {
      const electionStatus = settingsSnapshot.val();

      if (electionStatus === "not-started") {
        router.push("/not-started");
        return;
      }

      if (electionStatus === "closed") {
        router.push("/election-closed");
        return;
      }
    }

    setFacultyData(JSON.parse(data));
  };

  checkElectionStatus();
}, [router]);

  const positions = [
  {
    title: "President",
    candidates: [
      {
        name: "Arjun",
        department: "BCA Final Year",
        slogan: "Leadership Through Unity",
        image: "/candidates/arjun.jpg",
      },
      {
        name: "Rahul",
        department: "BCA Final Year",
        slogan: "Your Voice, Your Future",
        image: "/candidates/rahul.jpg",
      },
      {
        name: "Sneha",
        department: "B.Com Final Year",
        slogan: "Together We Rise",
        image: "/candidates/sneha.jpg",
      },
      {
        name: "David",
        department: "BBA Final Year",
        slogan: "Progress With Purpose",
        image: "/candidates/david.jpg",
      },
    ],
  },
  {
    title: "Vice President",
    candidates: [
      {
        name: "Kiran",
        department: "BBA Final Year",
        slogan: "Service Before Self",
        image: "/candidates/kiran.jpg",
      },
      {
        name: "Priya",
        department: "B.Com Final Year",
        slogan: "Lead With Integrity",
        image: "/candidates/priya.jpg",
      },
      {
        name: "Ajay",
        department: "BCA Final Year",
        slogan: "Students First Always",
        image: "/candidates/ajay.jpg",
      },
    ],
  },
];

  const handleSubmitVote = async () => {
    if (!facultyData) {
      router.push("/faculty-login");
      return;
    }

    const totalRequiredSelections = positions.reduce(
      (total, position) => total + position.candidates.length,
      0
    );

    const totalSelected = Object.keys(votes).length;

    if (totalSelected !== totalRequiredSelections) {
      router.push("/incomplete-vote");
      return;
    }

    const voteRef = ref(db, "facultyVotes/" + facultyData.employeeId);
    const snapshot = await get(voteRef);

    if (snapshot.exists()) {
      router.push("/already-voted");
      return;
    }

    const structuredVotes = {};

    Object.entries(votes).forEach(([key, rank]) => {
      const [position, candidateName] = key.split("-");

      if (!structuredVotes[position]) {
        structuredVotes[position] = {};
      }

      structuredVotes[position][rank] = candidateName;
    });

    const voteData = {
      faculty: facultyData,
      votes: structuredVotes,
      votedAt: new Date().toISOString(),
    };

    await set(voteRef, voteData);

    router.push("/thank-you");
  };

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <div className="flex items-center gap-4 mb-10">
        <div className="bg-white p-2 rounded-2xl">
          <img src="/logo.png" alt="College Logo" className="w-32" />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-pink-400">
            IAGI Faculty Voting Portal
          </h2>
          <p className="text-gray-400">
            Student Council Election - Faculty/Staff Voting
          </p>
        </div>
      </div>

      <h1 className="text-5xl font-bold text-center mb-12">
        Vote for Student Candidates
      </h1>

      <div className="space-y-10">
        {positions.map((position, index) => (
          <div
            key={index}
            className="bg-gradient-to-br from-purple-950 to-black border border-purple-800 rounded-3xl p-8 shadow-2xl"
          >
            <h2 className="text-3xl font-bold mb-8 text-pink-400">
              {position.title}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {position.candidates.map((candidate, i) => {
                const voteKey = `${position.title}-${candidate.name}`;

                return (
                  <div
                    key={i}
                    className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-pink-500 hover:scale-105 transition duration-300"
                  >
                    <div className="flex items-center justify-between gap-6">
                      <div className="flex items-center gap-5">
                        <img
                          src={candidate.image}
                          alt={candidate.name}
                          className="w-24 h-24 rounded-2xl object-cover border-2 border-pink-500"
                        />

                        <div>
                          <h3 className="text-2xl font-semibold">
                            {candidate.name}
                          </h3>

                          <p className="text-gray-400 mt-1">
                            {candidate.department}
                          </p>

                          <p className="text-pink-300 text-sm mt-1 italic">
                            "{candidate.slogan}"
                          </p>
                        </div>
                      </div>

                      <select
                        value={votes[voteKey] || ""}
                        onChange={(e) => {
                          const selectedRank = e.target.value;

                          const existing = Object.entries(votes).find(
                            ([key, value]) =>
                              key.startsWith(position.title) &&
                              value === selectedRank &&
                              key !== voteKey
                          );

                          if (existing) {
                            return;
                          }

                          setVotes({
                            ...votes,
                            [voteKey]: selectedRank,
                          });
                        }}
                        className="bg-black border border-pink-500 rounded-xl px-4 py-2 text-white"
                      >
                        <option value="">Select Rank</option>

                        {position.candidates.map((_, index) => {
                          const rank = String(index + 1);

                          const alreadyUsed = Object.entries(votes).find(
                            ([key, value]) =>
                              key.startsWith(position.title) &&
                              value === rank &&
                              key !== voteKey
                          );

                          return (
                            <option key={rank} value={rank} disabled={alreadyUsed}>
                              {rank === "1"
                                ? "1st Preference"
                                : rank === "2"
                                ? "2nd Preference"
                                : rank === "3"
                                ? "3rd Preference"
                                : `${rank}th Preference`}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-14">
        <button
          onClick={handleSubmitVote}
          className="bg-gradient-to-r from-red-500 to-purple-600 px-10 py-4 rounded-2xl text-2xl font-bold hover:scale-105 transition"
        >
          Submit Faculty Vote
        </button>
      </div>
    </div>
  );
}