import { BrowserRouter, Routes, Route } from "react-router-dom";
import "@/App.css";
import LandingPage from "@/pages/LandingPage";
import ResumeInputPage from "@/pages/ResumeInputPage";
import AnalysisResultsPage from "@/pages/AnalysisResultsPage";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <div className="min-h-screen bg-[#0B0C10] noise-bg">
      <BrowserRouter>
        <Header />
        <main className="relative z-10">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/analyze" element={<ResumeInputPage />} />
            <Route path="/results/:id" element={<AnalysisResultsPage />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
      <Toaster position="top-right" theme="dark" />
    </div>
  );
}

export default App;
