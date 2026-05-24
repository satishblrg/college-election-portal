"use client";

import { useEffect, useState } from "react";
import { ref, get } from "firebase/database";
import { db } from "@/firebase/config";

export default function LiveDisplayPage() {
  const [currentTime, setCurrentTime] = useState("");
  const [votesCast, setVotesCast] = useState(0);
  const [facultyVotesCast, setFacultyVotesCast] = useState(0);
  const [electionStatus, setElectionStatus] = useState("not-started");
  const [activeCandidateIndex, setActiveCandidateIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);


  const totalVoters = 1000;

  const candidates = [
    {
      name: "Arjun",
      position: "President",
      department: "BCA Final Year",
      slogan: "Leadership Through Unity",
      image: "/candidates/arjun.jpg",
    },
    {
      name: "Rahul",
      position: "President",
      department: "BCA Final Year",
      slogan: "Your Voice, Your Future",
      image: "/candidates/rahul.jpg",
    },
    {
      name: "Sneha",
      position: "President",
      department: "B.Com Final Year",
      slogan: "Together We Rise",
      image: "/candidates/sneha.jpg",
    },
    {
      name: "David",
      position: "President",
      department: "BBA Final Year",
      slogan: "Progress With Purpose",
      image: "/candidates/david.jpg",
    },
    {
      name: "Kiran",
      position: "Vice President",
      department: "BBA Final Year",
      slogan: "Service Before Self",
      image: "/candidates/kiran.jpg",
    },
    {
      name: "Priya",
      position: "Vice President",
      department: "B.Com Final Year",
      slogan: "Lead With Integrity",
      image: "/candidates/priya.jpg",
    },
    {
      name: "Ajay",
      position: "Vice President",
      department: "BCA Final Year",
      slogan: "Students First Always",
      image: "/candidates/ajay.jpg",
    },
  ];

  const totalVotesCast = votesCast + facultyVotesCast;

  const pollingPercentage =
    totalVoters > 0
      ? ((totalVotesCast / totalVoters) * 100).toFixed(1)
      : 0;

  const activeCandidate = candidates[activeCandidateIndex];

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();

      const time = now.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      setCurrentTime(time);
    };

    updateClock();

    const timer = setInterval(updateClock, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchLiveData = async () => {
      const votesRef = ref(db, "votes");
      const facultyVotesRef = ref(db, "facultyVotes");
      const statusRef = ref(db, "settings/electionStatus");

      const votesSnapshot = await get(votesRef);
      const facultySnapshot = await get(facultyVotesRef);
      const statusSnapshot = await get(statusRef);

      if (votesSnapshot.exists()) {
        setVotesCast(Object.keys(votesSnapshot.val()).length);
      }

      if (facultySnapshot.exists()) {
        setFacultyVotesCast(Object.keys(facultySnapshot.val()).length);
      }

      if (statusSnapshot.exists()) {
        setElectionStatus(statusSnapshot.val());
      }
    };

    fetchLiveData();

    const liveTimer = setInterval(fetchLiveData, 5000);

    return () => clearInterval(liveTimer);
  }, []);

  useEffect(() => {
  const candidateTimer = setInterval(() => {
    setIsFading(true);

    setTimeout(() => {
      setActiveCandidateIndex((previousIndex) =>
        previousIndex === candidates.length - 1 ? 0 : previousIndex + 1
      );

      setIsFading(false);
    }, 600);
  }, 12000);

  return () => clearInterval(candidateTimer);
}, [candidates.length]);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      <div className="absolute top-[-250px] left-[-250px] w-[700px] h-[700px] bg-purple-700 opacity-30 blur-[180px] rounded-full"></div>
      <div className="absolute bottom-[-250px] right-[-250px] w-[700px] h-[700px] bg-red-700 opacity-30 blur-[180px] rounded-full"></div>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_60%)]"></div>

      <div className="relative z-10 min-h-screen grid grid-cols-1 lg:grid-cols-2 gap-10 p-12 pb-36">
        <div className="flex flex-col justify-center">
          <div className="mb-8 w-fit">
            <div className="bg-white rounded-3xl px-6 py-4 shadow-[0_0_80px_rgba(255,255,255,0.35)]">
              <img
                src="/iagi-logo.gif"
                alt="IAGI Logo"
                className="w-56"
              />
            </div>
          </div>

          <div className="text-3xl font-bold text-cyan-400 mb-5">
            {currentTime}
          </div>

          <h1 className="text-6xl font-extrabold bg-gradient-to-r from-red-500 via-white to-purple-500 text-transparent bg-clip-text mb-6">
            IAGI ELECTION 2026
          </h1>

          <div className="inline-flex items-center gap-3 bg-red-600/20 border border-red-500 rounded-full px-6 py-3 w-fit mb-10">
            <span className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></span>
            <span className="text-red-300 text-xl font-bold tracking-widest">
              LIVE POLLING STATUS
            </span>
          </div>

          <div className="bg-white/10 border border-white/10 rounded-[2rem] p-10 shadow-2xl backdrop-blur-xl">
            <div className="mb-10">
              <p className="text-gray-400 text-3xl mb-4">
                Polling Completed
              </p>

              <h2 className="text-8xl font-extrabold text-white">
                {pollingPercentage}%
              </h2>

              <div className="w-full bg-white/10 rounded-full h-6 mt-8 overflow-hidden">
                <div
                  className="h-6 bg-gradient-to-r from-red-500 to-purple-600 rounded-full transition-all duration-700"
                  style={{ width: `${pollingPercentage}%` }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 text-center">
              <div className="bg-black/40 rounded-3xl p-6 border border-white/10">
                <p className="text-gray-400 text-xl">Votes Cast</p>
                <h3 className="text-5xl font-bold text-green-400 mt-3">
                  {totalVotesCast}
                </h3>
              </div>

              <div className="bg-black/40 rounded-3xl p-6 border border-white/10">
                <p className="text-gray-400 text-xl">Voting Status</p>
                <h3
                  className={`text-4xl font-bold mt-3 ${
                    electionStatus === "open"
                      ? "text-green-400"
                      : electionStatus === "closed"
                      ? "text-red-400"
                      : "text-yellow-400"
                  }`}
                >
                  {electionStatus === "open"
                    ? "OPEN"
                    : electionStatus === "closed"
                    ? "CLOSED"
                    : "NOT STARTED"}
                </h3>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div className="w-full max-w-xl bg-white/10 border border-white/10 rounded-[2.5rem] p-10 shadow-2xl backdrop-blur-xl text-center">
            <p className="text-pink-400 text-xl tracking-[0.3em] uppercase mb-6">
              Candidate Spotlight
            </p>

            <div
  className={`bg-black/40 rounded-[2rem] p-8 border border-purple-700 transition-all duration-700 ${
    isFading
      ? "opacity-0 translate-x-10 scale-95"
      : "opacity-100 translate-x-0 scale-100"
  }`}
>
              <img
                src={activeCandidate.image}
                alt={activeCandidate.name}
                className="w-72 h-72 mx-auto rounded-[2rem] object-cover border-4 border-pink-500 shadow-[0_0_60px_rgba(236,72,153,0.45)]"
              />

              <h2 className="text-5xl font-extrabold mt-8 text-white">
                {activeCandidate.name}
              </h2>

              <p className="text-3xl text-pink-400 font-bold mt-4">
                {activeCandidate.position}
              </p>

              <p className="text-2xl text-gray-300 mt-4">
                {activeCandidate.department}
              </p>

              <p className="text-2xl text-cyan-300 italic mt-6">
                "{activeCandidate.slogan}"
              </p>
            </div>

            <p className="text-gray-500 mt-8 text-lg">
              Profiles of Candidate 
            </p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-red-700 via-purple-800 to-red-700 py-4 overflow-hidden">
  <div className="ticker-scroll whitespace-nowrap text-2xl font-bold tracking-wider">
    Indian Academy Group of Institutions • Digital Election Portal • Voting progress is displayed live • Candidate results are confidential until official declaration • Indian Academy Group of Institutions • Digital Election Portal • Voting progress is displayed live •
  </div>
</div>

      <style jsx global>{`
  .ticker-scroll {
    display: inline-block;
    padding-left: 100%;
    animation: tickerMove 25s linear infinite;
  }

  @keyframes tickerMove {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-100%);
    }
  }
`}</style>
    </div>
  );
}