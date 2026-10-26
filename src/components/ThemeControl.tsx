import { useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react';
import { Check, ChevronDown, Monitor, Moon, Sun } from 'lucide-react';
import gsap from 'gsap';

type Theme = 'system' | 'light' | 'dark';
const isTheme = (value: unknown): value is Theme => value === 'system' || value === 'light' || value === 'dark';
const choices = [
  { value: 'system' as const, label: 'System', description: 'Follow your device', icon: Monitor },
  { value: 'light' as const, label: 'Light', description: 'A soft, sunlit palette', icon: Sun },
  { value: 'dark' as const, label: 'Dark', description: 'A quieter evening palette', icon: Moon },
];

export function ThemeControl() {
  const [theme, setTheme] = useState<Theme>(() => {
    try { const saved = localStorage.getItem('noor-theme'); return isTheme(saved) ? saved : 'system'; }
    catch { return 'system'; }
  });
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(0);
  const control = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const items = useRef<(HTMLButtonElement | null)[]>([]);
  const transition = useRef<gsap.core.Tween | null>(null);
  const closing = useRef(false);
  const selectedAtOpen = useRef(0);
  const id = useId();

  const dismiss = (restoreFocus = false, immediate = false) => {
    if (closing.current) return;
    closing.current = true;
    transition.current?.kill();
    const finish = () => { setOpen(false); if (restoreFocus) trigger.current?.focus({ preventScroll: true }); };
    if (immediate || !menu.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) finish();
    else transition.current = gsap.to(menu.current, { opacity: 0, y: -4, duration: 0.12, ease: 'power2.out', onComplete: finish });
  };

  useLayoutEffect(() => {
    if (!open) return;
    closing.current = false;
    const index = selectedAtOpen.current;
    setFocused(index);
    items.current[index]?.focus({ preventScroll: true });
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      transition.current = gsap.fromTo(menu.current, { opacity: 0, y: -5, scale: 0.98 }, { opacity: 1, y: 0, scale: 1, duration: 0.18, ease: 'power2.out' });
    }
    return () => { transition.current?.kill(); };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => {
      if (!control.current?.contains(event.target as Node)) {
        transition.current?.kill();
        closing.current = true;
        setOpen(false);
      }
    };
    document.addEventListener('pointerdown', outside);
    return () => document.removeEventListener('pointerdown', outside);
  }, [open]);

  const focusItem = (index: number) => { setFocused(index); items.current[index]?.focus({ preventScroll: true }); };
  const navigateMenu = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') { event.preventDefault(); dismiss(true); return; }
    if (event.key === 'Tab') { dismiss(false, true); return; }
    let next: number | undefined;
    if (event.key === 'ArrowDown') next = (focused + 1) % choices.length;
    if (event.key === 'ArrowUp') next = (focused - 1 + choices.length) % choices.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = choices.length - 1;
    if (event.key.length === 1 && /^[sld]$/i.test(event.key)) next = choices.findIndex(item => item.value.startsWith(event.key.toLowerCase()));
    if (next !== undefined && next >= 0) { event.preventDefault(); focusItem(next); }
  };
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const apply = () => {
      const resolved = theme === 'system' ? (media.matches ? 'dark' : 'light') : theme;
      document.documentElement.dataset.theme = resolved;
      document.documentElement.style.colorScheme = resolved;
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', resolved === 'dark' ? '#111e1a' : '#f5f7f2');
    };
    apply();
    try { localStorage.setItem('noor-theme', theme); } catch { /* Keep the in-memory preference when storage is unavailable. */ }
    media.addEventListener('change', apply);
    return () => media.removeEventListener('change', apply);
  }, [theme]);
  useEffect(() => {
    const sync = (event: StorageEvent) => { if (event.key === 'noor-theme') setTheme(isTheme(event.newValue) ? event.newValue : 'system'); };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);
  const Icon = theme === 'system' ? Monitor : theme === 'dark' ? Moon : Sun;
  const showMenu = () => { selectedAtOpen.current = choices.findIndex(item => item.value === theme); setOpen(true); };
  return <div ref={control} className="theme-control">
    <button ref={trigger} className="theme-trigger" aria-label={`Color theme, ${theme} selected`} aria-haspopup="menu" aria-expanded={open} aria-controls={open ? id : undefined}
      onClick={() => { if (open) dismiss(true); else showMenu(); }}
      onKeyDown={event => { if (event.key === 'ArrowDown' || event.key === 'ArrowUp') { event.preventDefault(); showMenu(); } }}>
      <span className="theme-trigger-icon"><Icon size={15} strokeWidth={1.6} aria-hidden="true" /></span>
      <span>{choices.find(item => item.value === theme)?.label}</span>
      <ChevronDown size={13} className="theme-chevron" aria-hidden="true" />
    </button>
    {open && <div ref={menu} id={id} className="theme-menu" role="menu" aria-labelledby={`${id}-title`} onKeyDown={navigateMenu}>
      <div className="theme-menu-heading" id={`${id}-title`} role="presentation">Appearance<span>Find your light</span></div>
      {choices.map((choice, index) => {
        const OptionIcon = choice.icon;
        return <button key={choice.value} ref={element => { items.current[index] = element; }} role="menuitemradio" aria-checked={theme === choice.value} tabIndex={focused === index ? 0 : -1}
          className="theme-option" onFocus={() => setFocused(index)} onClick={() => { setTheme(choice.value); dismiss(true); }}>
          <span className="theme-option-icon"><OptionIcon size={19} strokeWidth={1.5} aria-hidden="true" /></span>
          <span className="theme-option-copy"><span>{choice.label}</span><small>{choice.description}</small></span>
          {theme === choice.value && <Check size={16} className="theme-option-check" aria-hidden="true" />}
        </button>;
      })}
    </div>}
  </div>;
}
