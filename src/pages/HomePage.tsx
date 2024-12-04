import { moods } from "../data/moods";
import { MoodCard } from "../components/MoodCard";
import { Analytics } from "@vercel/analytics/react";

export function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">The Noor Jar</h1>
        <p className="text-center text-gray-600 mb-12">
          Select your mood to find comfort in Quranic verses and duas
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {moods.map((mood) => (
            <MoodCard key={mood.name} mood={mood} />
          ))}
        </div>
      </div>
      <Analytics />
    </div>
  );
}
