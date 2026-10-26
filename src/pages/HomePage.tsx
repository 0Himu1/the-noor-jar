import { moods } from "../data/moods";
import { MoodCard } from "../components/MoodCard";
import { Analytics } from "@vercel/analytics/react";
import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { JarMark } from '../components/JarMark';

export function HomePage() {
  const root = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const context = gsap.context(() => {
      if (document.hidden || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      gsap.set('.hero-jar .jar-light', { svgOrigin: '100 135' });
      gsap.timeline({ defaults: { ease: 'power3.out' } })
        .fromTo('.hero-copy', { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 })
        .fromTo('.hero-jar', { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55 }, 0.1)
        .fromTo('.hero-jar .jar-light', { scale: 0.82, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5 }, 0.2)
        .fromTo('.mood-section', { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.2);
    }, root);
    return () => context.revert();
  }, []);
  return (
    <main id="main-content" ref={root} className="home-page">
      <section className="home-hero">
        <div className="hero-copy">
        <h1>A little light<br />for how you feel.</h1>
        <p>
          Select your mood to find comfort in Quranic verses and duas
        </p>
        </div>
        <div className="hero-jar"><JarMark large /><span>Take a moment for yourself</span></div>
      </section>
      <section className="mood-section" aria-labelledby="mood-heading">
        <div className="section-heading"><h2 id="mood-heading">How are you feeling?</h2><p>Choose what speaks to you today.</p></div>
        <div className="mood-grid">
          {moods.map((mood) => (
            <MoodCard key={mood.name} mood={mood} />
          ))}
        </div>
      </section>
      <Analytics />
    </main>
  );
}
