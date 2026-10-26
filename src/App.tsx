import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { lazy, Suspense } from 'react';
import { ThemeControl } from './components/ThemeControl';
import { JarMark } from './components/JarMark';

const VersesPage = lazy(() => import('./pages/VersesPage').then(module => ({ default: module.VersesPage })));

function App() {
  return (
    <Router>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <div className="app-shell">
      <header className="site-header">
        <Link to="/" className="wordmark" aria-label="The Noor Jar home"><JarMark /><span>The Noor Jar</span></Link>
        <ThemeControl />
      </header>
      <Suspense fallback={<main id="main-content" className="reading-empty" role="status">Opening your verse…</main>}><Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/verses/:mood" element={<VersesPage />} />
      </Routes></Suspense>
      <footer className="site-footer"><span>A quiet moment. A little light.</span><span>The Noor Jar</span></footer>
      </div>
    </Router>
  );
}

export default App;
