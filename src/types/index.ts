export interface Verse {
  id?: string;
  mood: string;
  arabic: string;
  translation: string;
}

export interface Mood {
  name: string;
  color: string;
  icon: string;
}