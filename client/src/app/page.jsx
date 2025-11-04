"use client";
import Link from "next/link";
import LandingNavbar from "./components/ui/LandingNavbar";

export default function HomePage() {
  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden bg-white text-center px-6">
      {/* Navbar */}
      <LandingNavbar />

      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-100 via-white to-white -z-10" />

      {/* Decorative blur shapes */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-blue-200 rounded-full blur-3xl opacity-40 -translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-300 rounded-full blur-3xl opacity-30 translate-x-1/3 translate-y-1/3" />

      {/* Main Content */}
      <div className="max-w-2xl mx-auto mt-24 text-gray-800 fade-in">
        <h1 className="text-5xl sm:text-6xl font-extrabold mb-6 text-blue-700 leading-tight">
          Welcome to <span className="text-blue-500">MedTracker</span>
        </h1>

        <p className="text-gray-600 mb-10 text-lg sm:text-xl leading-relaxed">
          Your smart health companion — manage medical reports, prescriptions, and appointments effortlessly in one place.
        </p>

        <Link
          href="/dashboard"
          className="inline-block px-8 py-3 text-lg font-semibold text-white bg-blue-600 rounded-full shadow-lg hover:bg-blue-700 transition-transform transform hover:-translate-y-1 hover:shadow-2xl duration-300"
        >
          Go to Dashboard →
        </Link>
      </div>
    </main>
  );
}
