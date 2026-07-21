import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import BrandSystem from "./pages/BrandSystem";
import Cv from "./pages/Cv";
import CoverLetter from "./pages/CoverLetter";
import Essay from "./pages/Essay";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/brand-system" element={<BrandSystem />} />
      <Route path="/cv" element={<Cv />} />
      <Route path="/cover-letter" element={<CoverLetter />} />
      <Route path="/essay" element={<Essay />} />
    </Routes>
  );
}
