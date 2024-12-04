import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { VersesPage } from "./pages/VersesPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/verses/:mood" element={<VersesPage />} />
      </Routes>
    </Router>
  );
}

export default App;
