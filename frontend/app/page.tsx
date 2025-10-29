"use client";
import * as React from "react";
import Image from "next/image";
import Link from "next/link";

import Logo from "@/assets/imgs/logo.png";
import Music from "@/assets/imgs/music.svg";

import SearchPage from "./pages/SearchPage";

export default function Home() {
  const [isStarted, setIsStarted] = React.useState(false);
  return (
    <div className="font-sans grid grid-rows-[96px_1fr_60px] h-screen">
      <header className="h-[96px] flex justify-between items-center px-6 border-b border-gray-200 w-full ">
        <div className="max-w-7xl mx-auto flex justify-between items-center w-full">
          <div className="flex items-center gap-2">
            <Link href={"/"} onClick={() => setIsStarted(false)}>
              <Image
                src={Logo}
                alt="Logo"
                width={64}
                height={64}
                priority
                className="cursor-pointer"
              />
            </Link>
          </div>

          <nav className="flex gap-6">
            <Link
              onClick={() => setIsStarted(false)}
              href="/"
              className="hover:text-violet-700 transition-colors"
            >
              Home
            </Link>
            <a
              href="https://github.com/TingChiehLin/ai-mood-music-recommender"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-violet-700 transition-colors"
            >
              Project Link
            </a>
          </nav>
        </div>
      </header>

      <main className="flex flex-col items-center justify-center w-full text-center p-8 bg-slate-100">
        {isStarted ? (
          <SearchPage />
        ) : (
          <section id="home" className="max-w-4xl px-6">
            <Image
              src={Music}
              alt="Music"
              width={512}
              height={512}
              priority
              className="mx-auto"
            />
            <h2 className="text-5xl font-bold mb-4">
              Welcome to Mood Music Recommender
            </h2>
            <p className="text-gray-700 mb-8 text-lg">
              Find the music that matches your mood and lifts your spirits to
              make every moment better with ease
            </p>
            <button
              className="cursor-pointer px-6 py-3 bg-slate-600 text-white rounded-full hover:bg-slate-700 transition-colors"
              onClick={() => setIsStarted(true)}
            >
              Get Started
            </button>
          </section>
        )}
      </main>

      <footer className="h-[60px] w-full flex items-center justify-center border-t border-gray-200 text-sm">
        <p className="text-gray-600">
          © {new Date().getFullYear()}{" "}
          <span className="font-bold">Ting Chieh Lin</span>. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
}
