import Image from "next/image";
import Link from "next/link";

import Logo from "@/assets/imgs/logo.png";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[96px_1fr_60px] h-screen">
      <header className="h-[96px] flex justify-between items-center px-6 border-b border-gray-200 w-full ">
        <div className="max-w-7xl mx-auto flex justify-between items-center w-full">
          <div className="flex items-center gap-2">
            <Link href={"/"}>
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
            <Link href="/" className="hover:text-violet-700 transition-colors">
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
        <section id="home" className="max-w-2xl px-6">
          <h2 className="text-4xl font-bold mb-4">
            Welcome to AI Mood Music Recommender
          </h2>
          <p className="text-gray-700 mb-8">
            Find the music that matches your mood and lifts your spirits to make
            every moment better with ease
          </p>
          <a
            href="#get-started"
            className="px-6 py-3 bg-slate-600 text-white rounded-full hover:bg-slate-700 transition-colors"
          >
            Get Started
          </a>
        </section>
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
