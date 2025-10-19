// import Image from "next/image";
// import Link from "next/link";

// import Logo from "@/assets/imgs/logo.png";

// export default function Home() {
//   return (
//     <div className="font-sans grid grid-rows-[96px_1fr_60px] h-screen">
//       <header className="h-[96px] flex justify-between items-center px-6 border-b border-gray-200 w-full ">
//         <div className="max-w-7xl mx-auto flex justify-between items-center w-full">
//           <div className="flex items-center gap-2">
//             <Link href={"/"}>
//               <Image
//                 src={Logo}
//                 alt="Logo"
//                 width={64}
//                 height={64}
//                 priority
//                 className="cursor-pointer"
//               />
//             </Link>
//           </div>

//           <nav className="flex gap-6">
//             <Link href="/" className="hover:text-violet-700 transition-colors">
//               Home
//             </Link>
//             <a
//               href="https://github.com/TingChiehLin/ai-mood-music-recommender"
//               target="_blank"
//               rel="noopener noreferrer"
//               className="hover:text-violet-700 transition-colors"
//             >
//               Project Link
//             </a>
//           </nav>
//         </div>
//       </header>

//       <main className="flex flex-col items-center justify-center w-full text-center p-8 bg-slate-100">
//         <section id="home" className="max-w-2xl px-6">
//           <h2 className="text-4xl font-bold mb-4">
//             Welcome to AI Mood Music Recommender
//           </h2>
//           <p className="text-gray-700 mb-8">
//             Find the music that matches your mood and lifts your spirits to make
//             every moment better with ease
//           </p>
//           <a
//             href="#get-started"
//             className="px-6 py-3 bg-slate-600 text-white rounded-full hover:bg-slate-700 transition-colors"
//           >
//             Get Started
//           </a>
//         </section>
//       </main>

//       <footer className="h-[60px] w-full flex items-center justify-center border-t border-gray-200 text-sm">
//         <p className="text-gray-600">
//           © {new Date().getFullYear()}{" "}
//           <span className="font-bold">Ting Chieh Lin</span>. All rights
//           reserved.
//         </p>
//       </footer>
//     </div>
//   );
// }

"use client";
import React, { useCallback } from "react";
import MoodForm from "@/components/MoodForm";
import VideosGrid from "@/components/VideosGrid";
import { useRecommend } from "@/hooks/useRecommend";

export default function Home() {
  const { loading, error, ai, videos, recommend, clear } = useRecommend();

  const handleSubmit = useCallback(
    async (mood: string) => {
      await recommend(mood);
    },
    [recommend]
  );

  return (
    <main className="max-w-4xl mx-auto p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">AI Mood Recommendation Music</h1>
        <p className="text-sm text-slate-500 mt-1">
          Tell me how you are feeling and it will create a mood playlist for
          you.
        </p>
      </header>

      <section className="mb-6">
        <MoodForm onSubmit={handleSubmit} isLoading={loading} />
      </section>

      {error && (
        <div className="mb-4 p-3 rounded-md bg-red-50 text-red-700 border border-red-100">
          {error}
        </div>
      )}

      {ai && (
        <section className="mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold">{ai.playlist_title}</h2>
              <p className="text-sm text-slate-600 mt-1">{ai.description}</p>
            </div>

            <div className="text-right text-xs text-slate-500">
              <div>{ai.tone}</div>
              <div className="mt-1">{ai.genres.join(", ")}</div>
            </div>
          </div>

          <div className="mt-4">
            <VideosGrid videos={videos} />
          </div>

          <div className="mt-4 flex gap-2">
            <button
              onClick={() => {
                clear();
              }}
              className="px-3 py-1 rounded border text-sm"
            >
              Clear
            </button>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="text-sm text-slate-600 ml-auto"
            >
              Back to top
            </a>
          </div>
        </section>
      )}

      {!ai && !loading && (
        <p className="text-sm text-slate-500">
          Enter a mood to get recommendations.
        </p>
      )}
    </main>
  );
}
