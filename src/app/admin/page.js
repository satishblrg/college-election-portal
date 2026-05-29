"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ref, get, set } from "firebase/database";
import { db } from "@/firebase/config";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";


export default function AdminPage() {
  const router = useRouter();

  const [votesCast, setVotesCast] = useState(0);
  const [facultyVotesCast, setFacultyVotesCast] = useState(0);
  const [totalVoters, setTotalVoters] = useState(0);
  const [firstPreferenceCounts, setFirstPreferenceCounts] = useState({});
  const [facultyPreferenceCounts, setFacultyPreferenceCounts] = useState({});
  const [electionStatus, setElectionStatus] = useState("not-started");
  const [redistributedResults, setRedistributedResults] = useState({});
  const [redistributionRounds, setRedistributionRounds] = useState({});

  const exportVotesToExcel = async () => {
  const votesRef = ref(db, "votes");
  const snapshot = await get(votesRef);

  if (!snapshot.exists()) {
    alert("No votes found.");
    return;
  }

  const votesData = snapshot.val();

  const excelData = [];

  Object.entries(votesData).forEach(([regNumber, data]) => {
    const student = data.student || {};
    const votes = data.votes || {};

    Object.entries(votes).forEach(([position, rankings]) => {
      Object.entries(rankings).forEach(([rank, candidate]) => {
        excelData.push({
          RegisterNumber: regNumber,
          Name: student.name || "",
          Email: student.email || "",
          Position: position,
          Rank: rank,
          Candidate: candidate,
          VotedAt: data.votedAt || "",
        });
      });
    });
  });

  const worksheet = XLSX.utils.json_to_sheet(excelData);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Votes");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const fileData = new Blob([excelBuffer], {
    type: "application/octet-stream",
  });

  saveAs(fileData, "Election_Votes.xlsx");
};

const positions = [
  {
    title: "President",
    candidates: [
      { name: "Arjun" },
      { name: "Rahul" },
      { name: "Sneha" },
      { name: "David" },
    ],
  },
  {
    title: "Vice President",
    candidates: [
      { name: "Kiran" },
      { name: "Priya" },
      { name: "Ajay" },
    ],
  },
];

const calculateRedistributedResults = (votesData) => {
  const finalResults = {};
  const allRounds = {};

  positions.forEach((position) => {
    const positionVotes = [];

    Object.values(votesData).forEach((voteRecord) => {
      const rankings = voteRecord.votes?.[position.title];

      if (rankings) {
        positionVotes.push(rankings);
      }
    });

    let activeCandidates = position.candidates.map(
      (candidate) => candidate.name
    );

    let winnerFound = false;
    const rounds = [];

    while (!winnerFound && activeCandidates.length > 1) {
      const counts = {};

      activeCandidates.forEach((candidate) => {
        counts[candidate] = 0;
      });

      positionVotes.forEach((ballot) => {
        const sortedPreferences = Object.entries(ballot).sort(
          (a, b) => Number(a[0]) - Number(b[0])
        );

        for (const [, candidateName] of sortedPreferences) {
          if (activeCandidates.includes(candidateName)) {
            counts[candidateName]++;
            break;
          }
        }
      });

      rounds.push({
  round: rounds.length + 1,
  counts: { ...counts },
});

      const totalVotes = Object.values(counts).reduce(
        (sum, count) => sum + count,
        0
      );

      const winnerEntry = Object.entries(counts).find(
        ([, count]) => count > totalVotes / 2
      );

      if (winnerEntry) {
        finalResults[position.title] = {
          winner: winnerEntry[0],
          votes: winnerEntry[1],
        };

        winnerFound = true;
      } else {
        const lowestCandidate = Object.entries(counts).sort(
          (a, b) => a[1] - b[1]
        )[0][0];

        activeCandidates = activeCandidates.filter(
          (candidate) => candidate !== lowestCandidate
        );
      }
    }

    if (!winnerFound && activeCandidates.length === 1) {
      finalResults[position.title] = {
        winner: activeCandidates[0],
        votes: "Final Round",
      };
    }
    allRounds[position.title] = rounds;
  });
  setRedistributionRounds(allRounds);
  return finalResults;
};

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
      const votersRef = ref(db, "voters");
const votersSnapshot = await get(votersRef);

const facultyVotersRef = ref(db, "facultyVoters");
const facultyVotersSnapshot = await get(facultyVotersRef);

const studentVoterCount = votersSnapshot.exists()
  ? Object.keys(votersSnapshot.val()).length
  : 0;

const facultyVoterCount = facultyVotersSnapshot.exists()
  ? Object.keys(facultyVotersSnapshot.val()).length
  : 0;

setTotalVoters(studentVoterCount + facultyVoterCount);

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
const combinedVotesData = {
  ...votesData,
  ...(facultySnapshot.exists() ? facultySnapshot.val() : {}),
};

const redistributed = calculateRedistributedResults(combinedVotesData);
setRedistributedResults(redistributed);

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
    const autoRefresh = setInterval(fetchVotes, 30000);
    return () => clearInterval(autoRefresh);
  }, []);

  const totalVotesCast = votesCast + facultyVotesCast;
const remaining = totalVoters - totalVotesCast;
  const pollingPercentage =
  totalVoters > 0
    ? ((totalVotesCast / totalVoters) * 100).toFixed(1)
    : 0;

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

  const declareResult = async () => {
    await set(ref(db, "settings/electionStatus"), "declared");
    setElectionStatus("declared");
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 md:px-8 xl:px-10 py-8">
      
      {/* TOP CENTER HEADER */}
      <div className="flex flex-col items-center justify-center text-center mb-12">
        <div className="bg-white p-3 rounded-3xl shadow-2xl mb-5">
          <img src="/logo.png" alt="College Logo" className="w-28 md:w-32" />
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-pink-400">
          Admin Dashboard
        </h1>

        <p className="text-gray-400 mt-3 text-lg">
          Election monitoring and result control panel
        </p>

        <div
          className={`mt-6 px-6 py-3 rounded-2xl font-bold text-white ${
            electionStatus === "open"
              ? "bg-green-600"
              : electionStatus === "closed"
              ? "bg-red-700"
              : electionStatus === "declared"
              ? "bg-blue-700"
              : "bg-yellow-600"
          }`}
        >
          {electionStatus === "open"
            ? "Election Open"
            : electionStatus === "closed"
            ? "Election Closed"
            : electionStatus === "declared"
            ? "Result Declared"
            : "Election Not Started"}
        </div>

        {/* BUTTONS BELOW HEADER */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
          <button
            onClick={markNotStarted}
            className="min-w-[160px] h-[55px] bg-yellow-600 rounded-xl font-bold text-white"
          >
            Not Started
          </button>

          <button
            onClick={openElection}
            className="min-w-[160px] h-[55px] bg-green-600 rounded-xl font-bold text-white"
          >
            Open
          </button>

          <button
            onClick={closeElection}
            className="min-w-[160px] h-[55px] bg-red-600 rounded-xl font-bold text-white"
          >
            Close
          </button>

          <button
            onClick={declareResult}
            className="min-w-[160px] h-[55px] bg-blue-600 rounded-xl font-bold text-white"
          >
            Declare Result
          </button>

          <button
  onClick={exportVotesToExcel}
  className="bg-emerald-600 px-8 py-4 rounded-2xl font-bold text-white text-xl"
>
  Export Excel
</button>

          <button
            onClick={() => {
              localStorage.removeItem("adminLoggedIn");
              router.push("/admin-login");
            }}
            className="min-w-[160px] h-[55px] bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl font-bold text-white"
          >
            Logout
          </button>
        </div>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-6">
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
          <h2 className="text-4xl font-bold mt-3">{facultyVotesCast}</h2>
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

      {/* LEADING CANDIDATES */}
      <div className="mt-12">
        <h2 className="text-3xl font-bold text-pink-400 mb-6">
          Leading Candidates
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {Object.entries(firstPreferenceCounts).map(([position, candidates]) => {
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
          })}
        </div>
      </div>

      <div className="mt-16">
  <h2 className="text-3xl font-bold text-yellow-400 mb-6">
    Final Redistributed Winners
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
    {Object.entries(redistributedResults).map(([position, result]) => (
      <div
        key={position}
        className="bg-black border border-yellow-500 rounded-3xl p-8 shadow-[0_0_40px_rgba(255,215,0,0.25)]"
      >
        <p className="text-gray-400">{position}</p>

        <h3 className="text-3xl font-bold mt-3 text-yellow-400">
          {result.winner}
        </h3>

        <p className="text-green-400 mt-2">
          Final Count: {result.votes}
        </p>
      </div>
    ))}
  </div>
</div>

<div className="mt-16">
  <h2 className="text-3xl font-bold text-pink-400 mb-6">
    Redistribution Rounds
  </h2>

  {Object.entries(redistributionRounds).map(([position, rounds]) => (
    <div
      key={position}
      className="mb-10 bg-black border border-pink-500 rounded-3xl p-8"
    >
      <h3 className="text-2xl font-bold text-yellow-400 mb-6">
        {position}
      </h3>

      <div className="space-y-6">
        {rounds.map((roundData) => (
          <div
            key={roundData.round}
            className="bg-white/5 rounded-2xl p-6"
          >
            <h4 className="text-xl font-bold text-pink-300 mb-4">
              Round {roundData.round}
            </h4>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(roundData.counts).map(
                ([candidate, votes]) => (
                  <div
                    key={candidate}
                    className="bg-black rounded-xl p-4 border border-white/10"
                  >
                    <p className="text-gray-400">{candidate}</p>

                    <p className="text-2xl font-bold text-green-400">
                      {votes}
                    </p>
                  </div>
                )
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  ))}
</div>

      {/* LIVE RESULT TABLE */}
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
      </div>
    </div>
  );
}