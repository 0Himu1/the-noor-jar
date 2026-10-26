import { Link } from 'react-router-dom';
import type { CSSProperties } from 'react';
import { 
  Heart,
  Cloud,
  Flame,
  Frown,
  Shield,
  Star,
  Leaf,
  ArrowUpRight
} from 'lucide-react';
import type { Mood } from '../types';

const iconMap = {
  Heart,
  Cloud,
  Flame,
  Frown,
  Shield,
  Star,
  Leaf
};

interface MoodCardProps {
  mood: Mood;
}

export function MoodCard({ mood }: MoodCardProps) {
  const Icon = iconMap[mood.icon as keyof typeof iconMap];
  const descriptions: Record<string, string> = {
    Happy: 'Carry the joy with you', Sad: 'A little comfort for your heart', Angry: 'Make room for stillness',
    Depressed: 'Find a moment of hope', 'Seeking Protection': 'Turn toward reassurance', Thankful: 'Pause in gratitude',
    'Seeking Barkat': 'Welcome blessings into your day', 'Seeking Health': 'A moment for healing and dua',
  };

  return (
    <Link
      to={`/verses/${encodeURIComponent(mood.name)}`}
      className="mood-card"
      aria-label={mood.name}
      style={{ '--mood': mood.color } as CSSProperties}
    >
      <div className="mood-card-top"><span className="mood-icon"><Icon size={23} strokeWidth={1.5} aria-hidden="true" /></span><ArrowUpRight className="mood-arrow" size={18} aria-hidden="true" /></div>
      <h3>{mood.name}</h3><p>{descriptions[mood.name]}</p>
    </Link>
  );
}
