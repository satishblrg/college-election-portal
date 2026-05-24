"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ref, get, set } from "firebase/database";
import { db } from "@/firebase/config";

export default function AdminPage() {
  const router = useRouter();

  const [votesCast, setVotesCast] = useState(0);
  const [facultyVotesCast, setFacultyVotesCast] = useState(0);
  const [firstPreferenceCounts, setFirstPreferenceCounts] = useState({});
  const [facultyPreferenceCounts, setFacultyPreferenceCounts] = useState({});
 const [electionStatus, setElectionStatus] = useState("not-started");

  useEffect(() => {
    const isAdminLoggedIn = localStorage.getItem("adminLoggedIn");

if (isAdminLoggedIn !== "true") {
  router.push("/admin-login");
  return;
}
    const fetchVotes = async () => {
    const settingsRef = ref(db, "settings/electionStatus");
const settingsSnapshot = await get(settingsRef);

if (settingsSnapshot.exists()) {
  setElectionStatus(settingsSnapshot.val());
}
      const votesRef = ref(db, "votes");
      const snapshot = await get(votesRef);
      const facultyVotesRef = ref(db, "facultyVotes");
const facultySnapshot = await get(facultyVotesRef);

      if (snapshot.exists()) {
  const votesData = snapshot.val();
  setVotesCast(Object.keys(votesData).length);

  const counts = {};

  Object.values(votesData).forEach((voteRecord) => {
    const votePositions = voteRecord.votes;

    Object.entries(votePositions).forEach(([position, rankings]) => {
      const firstPreferenceCandidate = rankings["1"];

      if (!counts[position]) {
        counts[position] = {};
      }

      if (!counts[position][firstPreferenceCandidate]) {
        counts[position][firstPreferenceCandidate] = 0;
      }

      counts[position][firstPreferenceCandidate] += 1;
    });
  });

  setFirstPreferenceCounts(counts);
}
if (facultySnapshot.exists()) {
  const facultyVotesData = facultySnapshot.val();
  setFacultyVotesCast(Object.keys(facultyVotesData).length);

  const facultyCounts = {};

  Object.values(facultyVotesData).forEach((voteRecord) => {
    const votePositions = voteRecord.votes;

    Object.entries(votePositions).forEach(([position, rankings]) => {
      const firstPreferenceCandidate = rankings["1"];

      if (!facultyCounts[position]) {
        facultyCounts[position] = {};
      }

      if (!facultyCounts[position][firstPreferenceCandidate]) {
        facultyCounts[position][firstPreferenceCandidate] = 0;
      }

      facultyCounts[position][firstPreferenceCandidate] += 1;
    });
  });

  setFacultyPreferenceCounts(facultyCounts);
}
    };

    fetchVotes();
  }, []);

  const totalVoters = 1000;
  const remaining = totalVoters - votesCast;
  const pollingPercentage = ((votesCast / totalVoters) * 100).toFixed(1);
  const markNotStarted = async () => {
  await set(ref(db, "settings/electionStatus"), "not-started");
  setElectionStatus("not-started");
};

const openElection = async () => {
  await set(ref(db, "settings/electionStatus"), "open");
  setElectionStatus("open");
};

const closeElection = async () => {
  await set(ref(db, "settings/electionStatus"), "closed");
  setElectionStatus("closed");
};

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <div className="flex items-center justify-between mb-10">
  <div className="flex items-center gap-4">
    <div className="bg-white p-2 rounded-2xl">
      <img src="/logo.png" alt="College Logo" className="w-32" />
    </div>

    <div>
      <h1 className="text-4xl font-bold text-pink-400">
        Admin Dashboard
      </h1>
      <p className="text-gray-400">
        Election monitoring and result control panel
      </p>
    </div>
  </div>

 <div className="flex items-center gap-4">
  <div
  className={`px-5 py-3 rounded-2xl font-bold text-white ${
    electionStatus === "open"
      ? "bg-green-600"
      : electionStatus === "closed"
      ? "bg-red-700"
      : "bg-yellow-600"
  }`}
>
  {electionStatus === "open"
    ? "Election Open"
    : electionStatus === "closed"
    ? "Election Closed"
    : "Election Not Started"}
</div>

  <button
  onClick={markNotStarted}
  className="bg-yellow-600 px-6 py-3 rounded-2xl font-bold text-white"
>
  Not Started
</button>

  <button
    onClick={openElection}
    className="bg-green-600 px-6 py-3 rounded-2xl font-bold text-white"
  >
    Open
  </button>

  <button
    onClick={closeElection}
    className="bg-red-600 px-6 py-3 rounded-2xl font-bold text-white"
  >
    Close
  </button>

  <button
    onClick={() => {
      localStorage.removeItem("adminLoggedIn");
      router.push("/admin-login");
    }}
    className="bg-gradient-to-r from-red-500 to-purple-600 px-6 py-3 rounded-2xl font-bold"
  >
    Logout
  </button>
</div>
</div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-purple-950 border border-purple-700 rounded-3xl p-6">
          <p className="text-gray-400">Total Voters</p>
          <h2 className="text-4xl font-bold mt-3">{totalVoters}</h2>
        </div>

        <div className="bg-purple-950 border border-purple-700 rounded-3xl p-6">
          <p className="text-gray-400">Votes Cast</p>
          <h2 className="text-4xl font-bold mt-3">{votesCast}</h2>
        </div>
        <div className="bg-purple-950 border border-purple-700 rounded-3xl p-6">
         <p className="text-gray-400">Faculty/Staff Votes</p>
         <h2 className="text-4xl font-bold mt-3"> {facultyVotesCast}</h2>
         </div>

        <div className="bg-purple-950 border border-purple-700 rounded-3xl p-6">
          <p className="text-gray-400">Remaining</p>
          <h2 className="text-4xl font-bold mt-3">{remaining}</h2>
        </div>

        <div className="bg-purple-950 border border-purple-700 rounded-3xl p-6">
          <p className="text-gray-400">Polling %</p>
          <h2 className="text-4xl font-bold mt-3">{pollingPercentage}%</h2>
        </div>
      </div>

      <div className="mt-12">
  <h2 className="text-3xl font-bold text-pink-400 mb-6">
    Leading Candidates
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
    {Object.entries(firstPreferenceCounts).map(
      ([position, candidates]) => {
        const sortedCandidates = Object.entries(candidates).sort(
          (a, b) => b[1] - a[1]
        );

        const [leaderName, leaderVotes] = sortedCandidates[0];

        return (
          <div
            key={position}
            className="bg-black border border-purple-700 rounded-3xl p-8"
          >
            <p className="text-gray-400">{position}</p>

            <h3 className="text-3xl font-bold mt-3 text-white">
              {leaderName}
            </h3>

            <p className="text-pink-400 mt-2">
              Leading with {leaderVotes} votes
            </p>
          </div>
        );
      }
    )}
  </div>
</div>
          <div className="mt-16">
  <h2 className="text-3xl font-bold text-pink-400 mb-6">
    Live Result Table
  </h2>

  <div className="overflow-x-auto">
    <table className="w-full border border-purple-700 rounded-3xl overflow-hidden">
      <thead className="bg-purple-900 text-white">
        <tr>
  <th className="p-4 text-left">Position</th>
  <th className="p-4 text-left">Candidate</th>
  <th className="p-4 text-left">Student Votes</th>
  <th className="p-4 text-left">Faculty Votes</th>
  <th className="p-4 text-left">Total Votes</th>
</tr>
      </thead>

      <tbody>
  {Object.entries(firstPreferenceCounts).flatMap(
    ([position, studentCandidates]) =>
      Object.entries(studentCandidates).map(
        ([candidate, studentVotes]) => {
          const facultyVotes =
            facultyPreferenceCounts[position]?.[candidate] || 0;

          const totalVotes = studentVotes + facultyVotes;

          return (
            <tr
              key={`${position}-${candidate}`}
              className="border-t border-purple-800"
            >
              <td className="p-4">{position}</td>

              <td className="p-4">{candidate}</td>

              <td className="p-4">{studentVotes}</td>

              <td className="p-4">{facultyVotes}</td>

              <td className="p-4 font-bold text-pink-400">
                {totalVotes}
              </td>
            </tr>
          );
        }
      )
  )}
</tbody>
    </table>
  </div>
  <div className="mt-16">
  <h2 className="text-3xl font-bold text-pink-400 mb-6">
    Vote Comparison Chart
  </h2>

  <div className="space-y-8">
    {Object.entries(firstPreferenceCounts).map(([position, candidates]) => (
      <div
        key={position}
        className="bg-black border border-purple-700 rounded-3xl p-8"
      >
        <h3 className="text-2xl font-bold text-white mb-6">
          {position}
        </h3>

        <div className="space-y-5">
          {Object.entries(candidates).map(([candidate, studentVotes]) => {
            const facultyVotes =
              facultyPreferenceCounts[position]?.[candidate] || 0;

            const totalVotes = studentVotes + facultyVotes;
            const maxVotes = Math.max(
              ...Object.entries(candidates).map(([name, count]) => {
                const fVotes =
                  facultyPreferenceCounts[position]?.[name] || 0;
                return count + fVotes;
              })
            );

            const percentage =
              maxVotes > 0 ? (totalVotes / maxVotes) * 100 : 0;

            return (
              <div key={candidate}>
                <div className="flex justify-between mb-2">
                  <span className="font-semibold text-white">
                    {candidate}
                  </span>
                  <span className="text-pink-400 font-bold">
                    {totalVotes} votes
                  </span>
                </div>

                <div className="w-full bg-white/10 rounded-full h-5 overflow-hidden">
                  <div
                    className="h-5 bg-gradient-to-r from-red-500 to-purple-600 rounded-full"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    ))}
  </div>
</div>
</div>
        </div>
  );
}