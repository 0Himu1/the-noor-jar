import { Copy, Check } from 'lucide-react';
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import type { Verse } from '../types';

interface VerseCardProps { verse: Verse; color: string; }

export function VerseCard({ verse, color }: VerseCardProps) {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout>>();
  const body = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const element = body.current;
    if (!element) return;
    let cancelled = false;
    const fit = () => {
      if (cancelled || element.clientHeight === 0) return;
      // Find the largest type size that shows both complete paragraphs in this viewport.
      const base = Math.min(40, Math.max(26, element.clientWidth * 0.047));
      let low = 0.08;
      let high = 1;
      for (let pass = 0; pass < 13; pass++) {
        const scale = (low + high) / 2;
        element.style.setProperty('--arabic-size', `${base * scale}px`);
        element.style.setProperty('--translation-size', `${base * scale * 0.58}px`);
        if (element.scrollHeight <= element.clientHeight && element.scrollWidth <= element.clientWidth) low = scale;
        else high = scale;
      }
      element.style.setProperty('--arabic-size', `${base * low}px`);
      element.style.setProperty('--translation-size', `${base * low * 0.58}px`);
    };
    const observer = new ResizeObserver(fit);
    observer.observe(element);
    fit();
    void document.fonts.ready.then(fit);
    const viewport = window.visualViewport;
    viewport?.addEventListener('resize', fit);
    window.addEventListener('resize', fit);
    document.fonts.addEventListener('loadingdone', fit);
    return () => { cancelled = true; observer.disconnect(); viewport?.removeEventListener('resize', fit); window.removeEventListener('resize', fit); document.fonts.removeEventListener('loadingdone', fit); };
  }, [verse.arabic, verse.translation]);
  useEffect(() => () => clearTimeout(timeout.current), []);
  const handleCopy = async () => {
    const textToCopy = [verse.arabic, verse.translation].join('\n\n');
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setCopyError(false);
      clearTimeout(timeout.current);
      timeout.current = setTimeout(() => setCopied(false), 1800); // Reset after feedback has been visible.
    } catch { setCopyError(true); }
  };
  return <article className="verse-paper" style={{ '--mood': color } as CSSProperties}>
    <div className="verse-ornament" aria-hidden="true"><span /><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2L18 10L10 18L2 10Z" stroke="currentColor" /><circle cx="10" cy="10" r="2" fill="currentColor" /></svg><span /></div>
    <div ref={body} className="verse-body"><p className="verse-arabic" lang="ar" dir="rtl">{verse.arabic}</p>
    <div className="verse-divider" />
    <p className="verse-translation">{verse.translation}</p>
    </div>
    <div className="verse-paper-footer"><span>The Noor Jar</span><button className="copy-button" data-export="exclude" onClick={handleCopy} aria-label={copied ? 'Verse copied' : 'Copy verse'}>{copied ? <Check size={17} aria-hidden="true" /> : <Copy size={17} aria-hidden="true" />}<span>{copied ? 'Copied' : 'Copy'}</span></button></div>
    <span data-export="exclude" className={copyError ? 'copy-error' : 'sr-only'} role="status">{copyError ? 'Could not copy. Select the verse text and copy it manually.' : copied ? 'Verse copied to clipboard.' : ''}</span>
  </article>;
}
