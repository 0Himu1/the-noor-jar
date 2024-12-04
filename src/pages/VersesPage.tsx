import { useParams, Link } from "react-router-dom";
import { useLiveQuery } from "dexie-react-hooks";
import { useState, useEffect, useRef } from "react";
import { ArrowLeft, RefreshCw, Share2 } from "lucide-react";
import { db } from "../db";
import { VerseCard } from "../components/VerseCard";
import type { Verse } from "../types";
import { moods } from "../data/moods";
import { toPng } from "html-to-image";

export function VersesPage() {
  const { mood } = useParams<{ mood: string }>();
  const [randomVerse, setRandomVerse] = useState<Verse | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const moodColor = moods.find((m) => m.name === mood)?.color || "#FFFFFF";

  const verseCardRef = useRef<HTMLDivElement>(null);

  // Fetch verses for the mood
  const verses = useLiveQuery(
    () =>
      db.verses
        .where("mood")
        .equals(mood || "")
        .toArray(),
    [mood]
  );

  // Function to fetch a new random verse
  const getRandomVerse = () => {
    if (verses?.length) {
      const newVerse = verses[Math.floor(Math.random() * verses.length)];
      setRandomVerse(newVerse);

      // Trigger animation
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 200); // Reset animation state after 200ms
    }
  };

  // Share the verse as an image
  const shareAsImage = async () => {
    if (verseCardRef.current && randomVerse) {
      try {
        // Convert the VerseCard to a PNG image
        const dataUrl = await toPng(verseCardRef.current);
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], "verse.png", { type: "image/png" });

        if (navigator.share) {
          // Use the Web Share API to share the image
          await navigator.share({
            files: [file],
            title: "Quranic Verse",
            text: "Check out this verse!",
          });
        } else {
          alert("Sharing is not supported on this device.");
        }
      } catch (error) {
        console.error("Error sharing the image:", error);
        alert("Failed to share the image.");
      }
    }
  };

  // Set an initial random verse when verses are loaded
  useEffect(() => {
    if (verses?.length && !randomVerse) {
      setRandomVerse(verses[Math.floor(Math.random() * verses.length)]);
    }
  }, [verses, randomVerse]);

  return (
    <div className="max-h-[80vh] bg-gray-50">
      {/* Navigation and Page Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <Link
            to="/"
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Link>
          <h1 className="text-3xl font-bold text-center">{mood}</h1>
        </div>
      </div>

      {/* Verse Card Centered */}
      <div className="flex justify-center items-center min-h-[calc(100vh-15rem)] px-8">
        {randomVerse ? (
          <div ref={verseCardRef}>
            <VerseCard verse={randomVerse} color={moodColor} />
          </div>
        ) : (
          <p className="text-center text-gray-600">
            No verses found for this mood. Add one to get started!
          </p>
        )}
      </div>

      {/* Buttons Below the Card */}
      <div className="flex justify-center gap-4 mt-8">
        <button
          onClick={getRandomVerse}
          className={`p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 ${
            isAnimating ? "animate-spin" : ""
          }`}
          aria-label="Refresh Verse"
        >
          <RefreshCw className="w-6 h-6" />
        </button>
        <button
          onClick={shareAsImage}
          className="p-3 bg-green-500 text-white rounded-full hover:bg-green-600"
          aria-label="Share as Image"
        >
          <Share2 className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
