import { useNavigate } from 'react-router-dom';
import { 
  Heart,
  Cloud,
  Flame,
  Frown,
  Shield,
  Star,
  Leaf
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
  const navigate = useNavigate();
  const Icon = iconMap[mood.icon as keyof typeof iconMap];

  return (
    <button
      onClick={() => navigate(`/verses/${mood.name}`)}
      className="p-6 rounded-lg shadow-lg transition-transform hover:scale-105"
      style={{ backgroundColor: mood.color }}
    >
      <div className="flex flex-col items-center space-y-2">
        <Icon className="w-8 h-8 text-white" />
        <span className="text-lg font-medium text-white">{mood.name}</span>
      </div>
    </button>
  );
}