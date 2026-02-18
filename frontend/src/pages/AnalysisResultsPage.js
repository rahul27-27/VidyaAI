import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft, Loader2, FileText, Target, TrendingUp, Route,
  CheckCircle, AlertCircle, Star, BookOpen, ChevronRight, Sparkles
} from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: "easeOut" },
  }),
};

function ScoreRing({ score }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 75 ? "#10B981" : score >= 50 ? "#F59E0B" : "#EF4444";

  return (
    <div className="relative w-36 h-36" data-testid="score-ring">
      <svg className="w-full h-full score-ring" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
        <circle
          cx="60" cy="60" r={radius} fill="none"
          stroke={color} strokeWidth="8" strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1.5s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-[#F8FAFC]" style={{ fontFamily: 'Outfit, sans-serif' }}>{score}</span>
        <span className="text-xs text-[#94A3B8] uppercase tracking-wide">Score</span>
      </div>
    </div>
  );
}

function ImportanceTag({ level }) {
  const styles = {
    High: "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20",
    Medium: "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20",
    Low: "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20",
  };
  return (
    <Badge variant="outline" className={`text-xs px-2 py-0.5 ${styles[level] || styles.Medium}`}>
      {level}
    </Badge>
  );
}

export default function AnalysisResultsPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const res = await axios.get(`${API}/analysis/${id}`);
        setData(res.data);
      } catch (err) {
        setError(err.response?.data?.detail || "Failed to load analysis");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalysis();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center" data-testid="results-loading">
        <Loader2 className="w-8 h-8 animate-spin text-[#3B82F6]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center gap-4" data-testid="results-error">
        <AlertCircle className="w-12 h-12 text-[#EF4444]" />
        <p className="text-[#94A3B8]">{error}</p>
        <Link to="/analyze">
          <Button className="bg-[#3B82F6] text-white rounded-full px-6">Try Again</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Back + Header */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp}>
          <Link to="/analyze" className="inline-flex items-center text-sm text-[#94A3B8] hover:text-white mb-6 transition-colors" data-testid="back-to-analyze">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Analysis
          </Link>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-10">
            <ScoreRing score={data.resume_score} />
            <div className="flex-1">
              <p className="text-sm uppercase tracking-widest text-[#3B82F6] mb-2">Career Analysis</p>
              <h1
                data-testid="results-title"
                className="text-3xl md:text-4xl font-bold text-[#F8FAFC] mb-3"
                style={{ fontFamily: 'Outfit, sans-serif' }}
              >
                {data.full_name}'s Profile
              </h1>
              <p className="text-base text-[#94A3B8] leading-relaxed max-w-2xl">{data.summary}</p>
              <div className="flex gap-2 mt-3">
                <Badge variant="outline" className="border-white/10 text-[#94A3B8] text-xs">
                  {data.input_type === "pdf" ? "PDF Upload" : "Manual Entry"}
                </Badge>
                <Badge variant="outline" className="border-white/10 text-[#94A3B8] text-xs">
                  {new Date(data.created_at).toLocaleDateString()}
                </Badge>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="improvements" className="w-full">
          <TabsList
            data-testid="results-tabs"
            className="bg-[#1A1D25] border border-white/5 rounded-xl p-1 mb-8 flex flex-wrap"
          >
            <TabsTrigger value="improvements" data-testid="tab-improvements" className="rounded-lg data-[state=active]:bg-[#3B82F6] data-[state=active]:text-white text-[#94A3B8] px-4 py-2 text-sm">
              <FileText className="w-4 h-4 mr-2" /> Resume
            </TabsTrigger>
            <TabsTrigger value="careers" data-testid="tab-careers" className="rounded-lg data-[state=active]:bg-[#3B82F6] data-[state=active]:text-white text-[#94A3B8] px-4 py-2 text-sm">
              <Target className="w-4 h-4 mr-2" /> Careers
            </TabsTrigger>
            <TabsTrigger value="skills" data-testid="tab-skills" className="rounded-lg data-[state=active]:bg-[#3B82F6] data-[state=active]:text-white text-[#94A3B8] px-4 py-2 text-sm">
              <TrendingUp className="w-4 h-4 mr-2" /> Skills
            </TabsTrigger>
            <TabsTrigger value="roadmap" data-testid="tab-roadmap" className="rounded-lg data-[state=active]:bg-[#3B82F6] data-[state=active]:text-white text-[#94A3B8] px-4 py-2 text-sm">
              <Route className="w-4 h-4 mr-2" /> Roadmap
            </TabsTrigger>
          </TabsList>

          {/* Resume Improvements */}
          <TabsContent value="improvements" data-testid="tab-content-improvements">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Strengths */}
              <div className="md:col-span-5">
                <div className="bg-[#1A1D25] border border-white/5 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-[#10B981]/10 flex items-center justify-center">
                      <Star className="w-5 h-5 text-[#10B981]" />
                    </div>
                    <h3 className="text-lg font-medium text-[#F8FAFC]" style={{ fontFamily: 'Outfit, sans-serif' }}>Strengths</h3>
                  </div>
                  <ul className="space-y-3">
                    {data.strengths?.map((s, i) => (
                      <motion.li key={i} custom={i} initial="hidden" animate="visible" variants={fadeUp}
                        className="flex items-start gap-3"
                      >
                        <CheckCircle className="w-4 h-4 text-[#10B981] mt-1 shrink-0" />
                        <span className="text-sm text-[#94A3B8] leading-relaxed">{s}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Improvements */}
              <div className="md:col-span-7">
                <div className="bg-[#1A1D25] border border-white/5 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/10 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-[#F59E0B]" />
                    </div>
                    <h3 className="text-lg font-medium text-[#F8FAFC]" style={{ fontFamily: 'Outfit, sans-serif' }}>
                      Improvement Suggestions
                    </h3>
                  </div>
                  <ul className="space-y-4">
                    {data.resume_improvements?.map((imp, i) => (
                      <motion.li key={i} custom={i} initial="hidden" animate="visible" variants={fadeUp}
                        className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.03]"
                      >
                        <div className="w-6 h-6 rounded-full bg-[#F59E0B]/10 flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-[#F59E0B]">{i + 1}</span>
                        </div>
                        <span className="text-sm text-[#94A3B8] leading-relaxed">{imp}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Career Paths */}
          <TabsContent value="careers" data-testid="tab-content-careers">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.career_paths?.map((cp, i) => (
                <motion.div key={i} custom={i} initial="hidden" animate="visible" variants={fadeUp}
                  data-testid={`career-card-${i}`}
                  className="bg-[#1A1D25] border border-white/5 rounded-2xl p-6 hover:border-[#3B82F6]/30 transition-all duration-300 group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-[#F8FAFC]" style={{ fontFamily: 'Outfit, sans-serif' }}>
                      {cp.title}
                    </h3>
                    <div className="flex items-center gap-1">
                      <span className="text-2xl font-bold text-[#3B82F6]" style={{ fontFamily: 'Outfit, sans-serif' }}>
                        {cp.match_percentage}%
                      </span>
                    </div>
                  </div>
                  <Progress value={cp.match_percentage} className="h-1.5 mb-4 bg-white/5 [&>div]:bg-[#3B82F6]" />
                  <p className="text-sm text-[#94A3B8] leading-relaxed mb-4">{cp.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {cp.key_skills?.map((skill, j) => (
                      <Badge key={j} variant="outline" className="border-white/10 text-[#94A3B8] text-xs bg-white/[0.02]">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Skill Gaps */}
          <TabsContent value="skills" data-testid="tab-content-skills">
            <div className="space-y-4">
              {data.skill_gaps?.map((sg, i) => (
                <motion.div key={i} custom={i} initial="hidden" animate="visible" variants={fadeUp}
                  data-testid={`skill-gap-${i}`}
                  className="bg-[#1A1D25] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-base font-medium text-[#F8FAFC]" style={{ fontFamily: 'Outfit, sans-serif' }}>
                          {sg.skill}
                        </h3>
                        <ImportanceTag level={sg.importance} />
                      </div>
                      <p className="text-sm text-[#94A3B8] leading-relaxed">{sg.description}</p>
                    </div>
                    {sg.resources?.length > 0 && (
                      <div className="md:min-w-[240px] bg-white/[0.02] rounded-xl p-4 border border-white/[0.03]">
                        <p className="text-xs uppercase tracking-widest text-[#94A3B8]/60 mb-2">Resources</p>
                        <ul className="space-y-1.5">
                          {sg.resources.map((r, j) => (
                            <li key={j} className="flex items-center gap-2 text-sm text-[#3B82F6]">
                              <BookOpen className="w-3 h-3 shrink-0" />
                              <span className="truncate">{r}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Learning Roadmap */}
          <TabsContent value="roadmap" data-testid="tab-content-roadmap">
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-6 md:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-[#3B82F6] via-[#8B5CF6] to-[#14B8A6]" />

              <div className="space-y-8">
                {data.learning_roadmap?.map((phase, i) => (
                  <motion.div key={i} custom={i} initial="hidden" animate="visible" variants={fadeUp}
                    data-testid={`roadmap-phase-${i}`}
                    className="relative pl-16 md:pl-20"
                  >
                    {/* Timeline dot */}
                    <div className="absolute left-4 md:left-6 w-4 h-4 rounded-full bg-[#3B82F6] border-4 border-[#0B0C10] shadow-[0_0_10px_rgba(59,130,246,0.4)]" />

                    <div className="bg-[#1A1D25] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-colors">
                      <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-3">
                        <Badge className="bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/20 text-xs w-fit">
                          {phase.phase}
                        </Badge>
                        <h3 className="text-lg font-medium text-[#F8FAFC]" style={{ fontFamily: 'Outfit, sans-serif' }}>
                          {phase.title}
                        </h3>
                      </div>

                      <ul className="space-y-2 mb-4">
                        {phase.tasks?.map((task, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm text-[#94A3B8]">
                            <ChevronRight className="w-4 h-4 text-[#3B82F6] mt-0.5 shrink-0" />
                            {task}
                          </li>
                        ))}
                      </ul>

                      {phase.skills?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {phase.skills.map((sk, j) => (
                            <Badge key={j} variant="outline" className="border-[#8B5CF6]/20 text-[#8B5CF6] text-xs bg-[#8B5CF6]/5">
                              {sk}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Bottom CTA */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          className="mt-16 text-center"
        >
          <Link to="/analyze">
            <Button
              data-testid="new-analysis-btn"
              className="bg-[#3B82F6] text-white rounded-full px-8 py-3 font-semibold hover:opacity-90 transition-all shadow-[0_0_20px_-5px_rgba(59,130,246,0.5)]"
            >
              Start New Analysis
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
