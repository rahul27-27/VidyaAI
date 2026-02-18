import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header
      data-testid="main-header"
      className="fixed top-0 left-0 right-0 z-50 bg-[#0B0C10]/70 backdrop-blur-xl border-b border-white/5"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-3 group" data-testid="logo-link">
          <div className="w-9 h-9 rounded-lg bg-[#3B82F6] flex items-center justify-center shadow-[0_0_20px_-5px_rgba(59,130,246,0.5)] group-hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.7)] transition-shadow">
            <Compass className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-semibold text-white tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
            VidyaGuide<span className="text-[#3B82F6]">AI</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8" data-testid="desktop-nav">
          <Link
            to="/"
            className={`text-sm transition-colors ${isActive("/") ? "text-white" : "text-[#94A3B8] hover:text-white"}`}
            data-testid="nav-home"
          >
            Home
          </Link>
          <Link
            to="/analyze"
            className={`text-sm transition-colors ${isActive("/analyze") ? "text-white" : "text-[#94A3B8] hover:text-white"}`}
            data-testid="nav-analyze"
          >
            Analyze Resume
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Link to="/analyze">
            <Button
              data-testid="header-cta-button"
              className="bg-[#3B82F6] text-white rounded-full px-6 py-2 text-sm font-semibold hover:opacity-90 transition-opacity shadow-[0_0_20px_-5px_rgba(59,130,246,0.5)]"
            >
              Get Started
            </Button>
          </Link>
        </div>

        <button
          data-testid="mobile-menu-toggle"
          className="md:hidden text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {menuOpen && (
        <div
          data-testid="mobile-menu"
          className="md:hidden bg-[#0B0C10]/95 backdrop-blur-xl border-t border-white/5 px-6 py-4 space-y-3"
        >
          <Link to="/" onClick={() => setMenuOpen(false)} className="block text-sm text-[#94A3B8] hover:text-white py-2">
            Home
          </Link>
          <Link to="/analyze" onClick={() => setMenuOpen(false)} className="block text-sm text-[#94A3B8] hover:text-white py-2">
            Analyze Resume
          </Link>
          <Link to="/analyze" onClick={() => setMenuOpen(false)}>
            <Button className="w-full bg-[#3B82F6] text-white rounded-full text-sm font-semibold mt-2">
              Get Started
            </Button>
          </Link>
        </div>
      )}
    </header>
  );
}
