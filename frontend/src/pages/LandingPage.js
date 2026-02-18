import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, Target, TrendingUp, Route, Sparkles, BarChart3, ArrowRight, Upload, PenLine } from "lucide-react";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
  }),
};

const features = [
  {
    icon: FileText,
    title: "Resume Analysis",
    description: "Upload your resume and get an instant AI-powered analysis with actionable improvement suggestions.",
    color: "#3B82F6",
    span: "md:col-span-2",
  },
  {
    icon: Target,
    title: "Career Paths",
    description: "Discover career paths perfectly matched to your skills, education, and interests.",
    color: "#14B8A6",
    span: "md:col-span-1",
  },
  {
    icon: TrendingUp,
    title: "Skill Gap Analysis",
    description: "Identify missing skills that employers are looking for and how to acquire them.",
    color: "#8B5CF6",
    span: "md:col-span-1",
  },
  {
    icon: Route,
    title: "Learning Roadmap",
    description: "Get a step-by-step plan to build skills and reach your career goals phase by phase.",
    color: "#F59E0B",
    span: "md:col-span-2",
  },
];

const steps = [
  { icon: Upload, title: "Upload or Enter", desc: "Upload your PDF resume or fill in your details manually" },
  { icon: Sparkles, title: "AI Analyzes", desc: "Our AI deeply analyzes your profile against industry standards" },
  { icon: BarChart3, title: "Get Insights", desc: "Receive career paths, skill gaps, and a personalized roadmap" },
];

export default function LandingPage() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section data-testid="hero-section" className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
        <div className="hero-glow absolute inset-0" />
        <div className="hero-glow-secondary absolute inset-0" />

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
            <motion.div
              className="md:col-span-7"
              initial="hidden"
              animate="visible"
              variants={fadeUp}
            >
              <p className="text-sm uppercase tracking-widest text-[#3B82F6] mb-4 font-medium">
                AI-Powered Career Mentor
              </p>
              <h1
                data-testid="hero-title"
                className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-none text-[#F8FAFC] mb-6"
                style={{ fontFamily: 'Outfit, sans-serif' }}
              >
                Navigate Your
                <br />
                <span className="text-[#3B82F6]">Career Path</span> with
                <br />
                AI Precision
              </h1>
              <p className="text-lg md:text-xl leading-relaxed text-[#94A3B8] mb-8 max-w-xl">
                VidyaGuide AI analyzes your resume, identifies skill gaps, and creates a personalized career roadmap powered by Generative AI.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/analyze">
                  <Button
                    data-testid="hero-get-started-btn"
                    className="bg-[#3B82F6] text-white rounded-full px-8 py-3 text-base font-semibold hover:opacity-90 transition-all shadow-[0_0_20px_-5px_rgba(59,130,246,0.5)] hover:-translate-y-0.5"
                  >
                    Analyze My Resume
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/analyze">
                  <Button
                    data-testid="hero-manual-entry-btn"
                    variant="outline"
                    className="border-white/20 text-white rounded-full px-8 py-3 text-base hover:bg-white/5 transition-colors"
                  >
                    <PenLine className="mr-2 w-4 h-4" />
                    Enter Manually
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              className="md:col-span-5 hidden md:block"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-[#3B82F6]/10 rounded-3xl blur-3xl animate-pulse-glow" />
                <img
                  src="https://images.unsplash.com/photo-1710743688495-9a87a64c37b0?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzNDR8MHwxfHNlYXJjaHwyfHxzdHVkZW50JTIwc3R1ZHlpbmclMjBsYXB0b3AlMjBkYXJrJTIwbW9vZHxlbnwwfHx8fDE3NzE0MjY4MDN8MA&ixlib=rb-4.1.0&q=85"
                  alt="Student focused on career planning"
                  className="relative rounded-2xl border border-white/10 shadow-2xl w-full object-cover aspect-[4/3]"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section data-testid="how-it-works-section" className="py-20 md:py-32 relative">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mb-16"
          >
            <p className="text-sm uppercase tracking-widest text-[#14B8A6] mb-3">Simple Process</p>
            <h2
              className="text-3xl md:text-5xl font-semibold tracking-tight text-[#F8FAFC]"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              Three Steps to Career Clarity
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                data-testid={`step-card-${i}`}
                className="relative group"
              >
                <div className="bg-[#1A1D25] border border-white/5 rounded-2xl p-8 hover:border-[#3B82F6]/30 transition-all duration-300 hover:shadow-[0_0_30px_-10px_rgba(59,130,246,0.3)] h-full">
                  <div className="text-5xl font-bold text-white/5 absolute top-4 right-6" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    0{i + 1}
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-[#3B82F6]/10 flex items-center justify-center mb-6">
                    <step.icon className="w-6 h-6 text-[#3B82F6]" />
                  </div>
                  <h3 className="text-xl font-medium text-[#F8FAFC] mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    {step.title}
                  </h3>
                  <p className="text-[#94A3B8] leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section data-testid="features-section" className="py-20 md:py-32 relative">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mb-16"
          >
            <p className="text-sm uppercase tracking-widest text-[#8B5CF6] mb-3">Features</p>
            <h2
              className="text-3xl md:text-5xl font-semibold tracking-tight text-[#F8FAFC]"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              Everything You Need for
              <br />
              Career Success
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                data-testid={`feature-card-${i}`}
                className={`${f.span} bg-[#1A1D25] border border-white/5 rounded-2xl p-8 group hover:border-white/10 transition-all duration-300 relative overflow-hidden`}
              >
                <div
                  className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity"
                  style={{ background: f.color }}
                />
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                  style={{ background: `${f.color}15` }}
                >
                  <f.icon className="w-6 h-6" style={{ color: f.color }} />
                </div>
                <h3 className="text-xl font-medium text-[#F8FAFC] mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  {f.title}
                </h3>
                <p className="text-[#94A3B8] leading-relaxed">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section data-testid="cta-section" className="py-20 md:py-32 relative">
        <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[500px] h-[500px] bg-[#3B82F6]/10 rounded-full blur-3xl" />
            </div>
            <h2
              className="text-3xl md:text-5xl font-semibold tracking-tight text-[#F8FAFC] mb-6 relative z-10"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              Ready to Shape Your Future?
            </h2>
            <p className="text-lg text-[#94A3B8] mb-10 max-w-2xl mx-auto relative z-10">
              Upload your resume or enter your details and let our AI guide you toward the perfect career path.
            </p>
            <Link to="/analyze" className="relative z-10">
              <Button
                data-testid="cta-get-started-btn"
                className="bg-[#3B82F6] text-white rounded-full px-10 py-4 text-lg font-semibold hover:opacity-90 transition-all shadow-[0_0_30px_-5px_rgba(59,130,246,0.5)] hover:-translate-y-0.5"
              >
                Start Your Career Analysis
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
