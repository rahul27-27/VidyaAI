import { Compass } from "lucide-react";

export default function Footer() {
  return (
    <footer data-testid="main-footer" className="relative z-10 border-t border-white/5 bg-[#0B0C10]">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#3B82F6] flex items-center justify-center">
                <Compass className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-semibold text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
                VidyaGuide<span className="text-[#3B82F6]">AI</span>
              </span>
            </div>
            <p className="text-sm text-[#94A3B8] leading-relaxed max-w-sm">
              Your AI-powered career planning companion. Get personalized guidance, resume improvements, and skill development roadmaps.
            </p>
          </div>

          <div>
            <h4 className="text-sm uppercase tracking-widest text-[#94A3B8]/60 mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>Platform</h4>
            <ul className="space-y-2">
              <li><a href="/analyze" className="text-sm text-[#94A3B8] hover:text-white transition-colors">Resume Analysis</a></li>
              <li><a href="/analyze" className="text-sm text-[#94A3B8] hover:text-white transition-colors">Career Paths</a></li>
              <li><a href="/analyze" className="text-sm text-[#94A3B8] hover:text-white transition-colors">Skill Gap Analysis</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm uppercase tracking-widest text-[#94A3B8]/60 mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>Resources</h4>
            <ul className="space-y-2">
              <li><span className="text-sm text-[#94A3B8]">Career Guides</span></li>
              <li><span className="text-sm text-[#94A3B8]">Resume Templates</span></li>
              <li><span className="text-sm text-[#94A3B8]">Interview Prep</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#94A3B8]/50">
            &copy; {new Date().getFullYear()} VidyaGuide AI. Powered by Generative AI.
          </p>
          <p className="text-xs text-[#94A3B8]/50">
            Empowering career decisions with intelligent guidance.
          </p>
        </div>
      </div>
    </footer>
  );
}
