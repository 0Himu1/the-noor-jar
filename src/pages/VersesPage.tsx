import { useParams, Link } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { useState, useEffect, useLayoutEffect, useRef, type CSSProperties } from 'react';
import { ArrowLeft, RefreshCw, Share2 } from 'lucide-react';
import gsap from 'gsap';
import { db } from '../db';
import { VerseCard } from '../components/VerseCard';
import type { Verse } from '../types';
import { moods } from '../data/moods';

export function VersesPage() {
  const { mood } = useParams<{ mood: string }>();
  const [randomVerse, setRandomVerse] = useState<Verse | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [status, setStatus] = useState('');
  const selectedMood = moods.find(item => item.name === mood);
  const moodColor = selectedMood?.color || '#A3B88B';
  const root = useRef<HTMLElement>(null);
  const verseCardRef = useRef<HTMLDivElement>(null);
  const exchange = useRef<gsap.core.Timeline | null>(null);
  useLayoutEffect(() => {
    if (!randomVerse) return;
    exchange.current?.kill();
    if (document.hidden || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(verseCardRef.current, { clearProps: 'opacity,transform' });
      setIsAnimating(false);
      return;
    }
    setIsAnimating(true);
    const context = gsap.context(() => {
      exchange.current = gsap.timeline({ onComplete: () => setIsAnimating(false) })
        .fromTo(verseCardRef.current, { opacity: 0, y: 10, scale: 0.985 }, { opacity: 1, y: 0, scale: 1, duration: 0.38, ease: 'power3.out' })
        .fromTo('.verse-ornament > span', { scaleX: 0 }, { scaleX: 1, duration: 0.3, ease: 'power2.out' }, 0.08)
        .fromTo('.verse-ornament > svg', { scale: 0.85, opacity: 0, transformOrigin: '50% 50%' }, { scale: 1, opacity: 1, duration: 0.28, ease: 'power2.out' }, 0.08)
        .fromTo('.verse-arabic, .verse-translation', { opacity: 0 }, { opacity: 1, duration: 0.28, ease: 'power2.out' }, 0.15)
        .fromTo('.verse-paper-footer', { opacity: 0 }, { opacity: 1, duration: 0.18, ease: 'power2.out' }, 0.25);
    }, root);
    return () => context.revert();
  }, [randomVerse]);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const settle = () => { if (media.matches || document.hidden) exchange.current?.progress(1); };
    media.addEventListener('change', settle);
    document.addEventListener('visibilitychange', settle);
    return () => { media.removeEventListener('change', settle); document.removeEventListener('visibilitychange', settle); };
  }, []);

  // Fetch verses for the mood
  const verses = useLiveQuery(() => db.verses.where('mood').equals(mood || '').toArray(), [mood]);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      if (document.hidden || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      gsap.fromTo('.reading-heading', { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power3.out' });
    }, root);
    return () => { exchange.current?.kill(); context.revert(); };
  }, []);

  // Set an initial random verse when verses are loaded
  useEffect(() => {
    setRandomVerse(verses?.length ? verses[Math.floor(Math.random() * verses.length)] : null);
    setStatus('');
  }, [verses, mood]);

  // Function to fetch a new random verse
  const getRandomVerse = () => {
    if (!verses?.length || isAnimating) return;
    const alternatives = verses.filter(verse => verse.id !== randomVerse?.id);
    if (!alternatives.length) { setStatus('This is the verse available for this mood.'); return; }
    const next = alternatives[Math.floor(Math.random() * alternatives.length)];
    setStatus('');
    if (document.hidden || window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setRandomVerse(next); return; }
    // Trigger animation
    setIsAnimating(true);
    exchange.current?.kill();
    exchange.current = gsap.timeline({ onComplete: () => setRandomVerse(next) })
      .to(verseCardRef.current, { opacity: 0, y: -6, scale: 0.995, duration: 0.14, ease: 'power2.out' });
  };

  // Share the verse as an image
  const shareAsImage = async () => {
    if (!verseCardRef.current || !randomVerse || sharing) return;
    setSharing(true);
    setStatus('');
    try {
      await document.fonts.ready;
      const { toPng } = await import('html-to-image');
      // Convert the VerseCard to a PNG image
      const dataUrl = await toPng(verseCardRef.current, { pixelRatio: 2, filter: node => !(node instanceof HTMLElement && node.dataset.export === 'exclude') });
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], 'noor-jar-verse.png', { type: 'image/png' });
      // Use the Web Share API to share the image
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: 'The Noor Jar', text: 'A verse to reflect on.' });
        setStatus('Share options opened.');
      } else {
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'noor-jar-verse.png';
        link.click();
        setStatus('Verse image downloaded.');
      }
    } catch (error) {
      if (!(error instanceof DOMException && error.name === 'AbortError')) setStatus('Could not create the image. Please try again.');
    } finally { setSharing(false); }
  };

  return <main id="main-content" ref={root} className="reading-page" style={{ '--mood': moodColor } as CSSProperties}>
    {/* Navigation and Page Header */}
    <div className="reading-toolbar"><Link to="/" className="back-link" aria-label="All moods"><ArrowLeft size={17} aria-hidden="true" /><span>All moods</span></Link>
    <div className="reading-heading"><h1>{selectedMood ? mood : 'Mood not found'}</h1><p>A moment to pause, read, and reflect.</p></div>
    </div>
    {/* Verse Card Centered */}
    <div className="reading-content" aria-live="polite" aria-busy={verses === undefined}>
      {randomVerse ? <div ref={verseCardRef}><VerseCard key={randomVerse.id} verse={randomVerse} color={moodColor} /></div>
        : <div className="reading-empty"><p>{verses === undefined ? 'Finding a verse…' : 'No verses are available for this mood.'}</p>{verses !== undefined && <Link to="/">Choose another mood</Link>}</div>}
    </div>
    {/* Buttons Below the Card */}
    <div className="verse-actions">
      <button className="action-button" onClick={getRandomVerse} disabled={!randomVerse || isAnimating || sharing}><RefreshCw size={17} aria-hidden="true" />Another verse</button>
      <button className="action-button action-primary" onClick={shareAsImage} disabled={!randomVerse || sharing || isAnimating}><Share2 size={17} aria-hidden="true" />{sharing ? 'Preparing image…' : 'Share verse'}</button>
    </div>
    <p className="action-status" role="status">{status}</p>
  </main>;
}
