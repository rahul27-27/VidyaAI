import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, FileText, PenLine, Loader2, X, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function ResumeInputPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [pdfName, setPdfName] = useState("");
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    education: "",
    skills: "",
    experience: "",
    interests: "",
    career_goals: "",
  });

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === "application/pdf") {
        setSelectedFile(file);
      } else {
        toast.error("Please upload a PDF file");
      }
    }
  }, []);

  const handleFileSelect = (e) => {
    if (e.target.files?.[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handlePdfSubmit = async () => {
    if (!selectedFile) {
      toast.error("Please select a PDF file");
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("file", selectedFile);
      fd.append("full_name", pdfName || "");
      const res = await axios.post(`${API}/analyze-resume`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 120000,
      });
      toast.success("Analysis complete!");
      navigate(`/results/${res.data.id}`);
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to analyze resume. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = async () => {
    if (!formData.full_name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (!formData.skills.trim() && !formData.education.trim()) {
      toast.error("Please enter at least your skills or education");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${API}/analyze-manual`, formData, { timeout: 120000 });
      toast.success("Analysis complete!");
      navigate(`/results/${res.data.id}`);
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to analyze. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const updateForm = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-sm uppercase tracking-widest text-[#3B82F6] mb-3">Career Analysis</p>
          <h1
            data-testid="analyze-page-title"
            className="text-3xl md:text-5xl font-semibold tracking-tight text-[#F8FAFC] mb-4"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            Analyze Your Profile
          </h1>
          <p className="text-base md:text-lg text-[#94A3B8] mb-10 max-w-2xl">
            Upload your resume as a PDF or enter your details manually. Our AI will analyze your profile and provide personalized career guidance.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Tabs defaultValue="upload" className="w-full">
            <TabsList
              data-testid="input-tabs"
              className="bg-[#1A1D25] border border-white/5 rounded-xl p-1 mb-8 w-full md:w-auto"
            >
              <TabsTrigger
                value="upload"
                data-testid="tab-upload"
                className="rounded-lg data-[state=active]:bg-[#3B82F6] data-[state=active]:text-white text-[#94A3B8] px-6 py-2.5"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload PDF
              </TabsTrigger>
              <TabsTrigger
                value="manual"
                data-testid="tab-manual"
                className="rounded-lg data-[state=active]:bg-[#3B82F6] data-[state=active]:text-white text-[#94A3B8] px-6 py-2.5"
              >
                <PenLine className="w-4 h-4 mr-2" />
                Enter Manually
              </TabsTrigger>
            </TabsList>

            {/* PDF Upload Tab */}
            <TabsContent value="upload">
              <div className="bg-[#1A1D25] border border-white/5 rounded-2xl p-8">
                <div className="mb-6">
                  <Label className="text-[#F8FAFC] mb-2 block">Your Name (Optional)</Label>
                  <Input
                    data-testid="pdf-name-input"
                    value={pdfName}
                    onChange={(e) => setPdfName(e.target.value)}
                    placeholder="Enter your full name"
                    className="bg-[#0F1117] border-white/10 focus:border-[#3B82F6]/50 focus:ring-1 focus:ring-[#3B82F6]/50 rounded-lg h-12 px-4 text-white placeholder:text-white/20"
                  />
                </div>

                <div
                  data-testid="pdf-upload-zone"
                  className={`upload-zone rounded-2xl p-12 text-center cursor-pointer transition-all ${
                    dragActive ? "drag-active" : ""
                  } ${selectedFile ? "border-[#14B8A6]/50 bg-[#14B8A6]/5" : ""}`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById("pdf-input").click()}
                >
                  <input
                    id="pdf-input"
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={handleFileSelect}
                    data-testid="pdf-file-input"
                  />

                  {selectedFile ? (
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 rounded-xl bg-[#14B8A6]/10 flex items-center justify-center">
                        <CheckCircle className="w-8 h-8 text-[#14B8A6]" />
                      </div>
                      <div>
                        <p className="text-[#F8FAFC] font-medium mb-1">{selectedFile.name}</p>
                        <p className="text-sm text-[#94A3B8]">
                          {(selectedFile.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                      <button
                        data-testid="remove-file-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFile(null);
                        }}
                        className="text-sm text-[#EF4444] hover:text-[#EF4444]/80 flex items-center gap-1"
                      >
                        <X className="w-3 h-3" /> Remove
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 rounded-xl bg-[#3B82F6]/10 flex items-center justify-center">
                        <FileText className="w-8 h-8 text-[#3B82F6]" />
                      </div>
                      <div>
                        <p className="text-[#F8FAFC] font-medium mb-1">
                          Drop your resume here or click to browse
                        </p>
                        <p className="text-sm text-[#94A3B8]">PDF files only, max 10MB</p>
                      </div>
                    </div>
                  )}
                </div>

                <Button
                  data-testid="pdf-submit-btn"
                  onClick={handlePdfSubmit}
                  disabled={loading || !selectedFile}
                  className="mt-8 bg-[#3B82F6] text-white rounded-full px-10 py-3 font-semibold hover:opacity-90 transition-all shadow-[0_0_20px_-5px_rgba(59,130,246,0.5)] disabled:opacity-40 disabled:cursor-not-allowed w-full md:w-auto"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing Resume...
                    </>
                  ) : (
                    "Analyze Resume"
                  )}
                </Button>
              </div>
            </TabsContent>

            {/* Manual Entry Tab */}
            <TabsContent value="manual">
              <div className="bg-[#1A1D25] border border-white/5 rounded-2xl p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <Label className="text-[#F8FAFC] mb-2 block">Full Name *</Label>
                    <Input
                      data-testid="manual-name-input"
                      value={formData.full_name}
                      onChange={(e) => updateForm("full_name", e.target.value)}
                      placeholder="John Doe"
                      className="bg-[#0F1117] border-white/10 focus:border-[#3B82F6]/50 focus:ring-1 focus:ring-[#3B82F6]/50 rounded-lg h-12 px-4 text-white placeholder:text-white/20"
                    />
                  </div>
                  <div>
                    <Label className="text-[#F8FAFC] mb-2 block">Email</Label>
                    <Input
                      data-testid="manual-email-input"
                      value={formData.email}
                      onChange={(e) => updateForm("email", e.target.value)}
                      placeholder="john@example.com"
                      className="bg-[#0F1117] border-white/10 focus:border-[#3B82F6]/50 focus:ring-1 focus:ring-[#3B82F6]/50 rounded-lg h-12 px-4 text-white placeholder:text-white/20"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <Label className="text-[#F8FAFC] mb-2 block">Education *</Label>
                    <Textarea
                      data-testid="manual-education-input"
                      value={formData.education}
                      onChange={(e) => updateForm("education", e.target.value)}
                      placeholder="B.Tech in Computer Science, XYZ University (2020-2024)&#10;GPA: 8.5/10"
                      rows={3}
                      className="bg-[#0F1117] border-white/10 focus:border-[#3B82F6]/50 focus:ring-1 focus:ring-[#3B82F6]/50 rounded-lg px-4 py-3 text-white placeholder:text-white/20 resize-none"
                    />
                  </div>

                  <div>
                    <Label className="text-[#F8FAFC] mb-2 block">Skills *</Label>
                    <Textarea
                      data-testid="manual-skills-input"
                      value={formData.skills}
                      onChange={(e) => updateForm("skills", e.target.value)}
                      placeholder="Python, JavaScript, React, Node.js, SQL, Machine Learning, Git"
                      rows={2}
                      className="bg-[#0F1117] border-white/10 focus:border-[#3B82F6]/50 focus:ring-1 focus:ring-[#3B82F6]/50 rounded-lg px-4 py-3 text-white placeholder:text-white/20 resize-none"
                    />
                  </div>

                  <div>
                    <Label className="text-[#F8FAFC] mb-2 block">Work Experience</Label>
                    <Textarea
                      data-testid="manual-experience-input"
                      value={formData.experience}
                      onChange={(e) => updateForm("experience", e.target.value)}
                      placeholder="Software Intern at ABC Corp (June 2023 - Aug 2023)&#10;- Built REST APIs using Python Flask&#10;- Developed frontend with React"
                      rows={4}
                      className="bg-[#0F1117] border-white/10 focus:border-[#3B82F6]/50 focus:ring-1 focus:ring-[#3B82F6]/50 rounded-lg px-4 py-3 text-white placeholder:text-white/20 resize-none"
                    />
                  </div>

                  <div>
                    <Label className="text-[#F8FAFC] mb-2 block">Interests</Label>
                    <Textarea
                      data-testid="manual-interests-input"
                      value={formData.interests}
                      onChange={(e) => updateForm("interests", e.target.value)}
                      placeholder="Web Development, AI/ML, Cloud Computing, Open Source"
                      rows={2}
                      className="bg-[#0F1117] border-white/10 focus:border-[#3B82F6]/50 focus:ring-1 focus:ring-[#3B82F6]/50 rounded-lg px-4 py-3 text-white placeholder:text-white/20 resize-none"
                    />
                  </div>

                  <div>
                    <Label className="text-[#F8FAFC] mb-2 block">Career Goals *</Label>
                    <Textarea
                      data-testid="manual-goals-input"
                      value={formData.career_goals}
                      onChange={(e) => updateForm("career_goals", e.target.value)}
                      placeholder="I want to become a Full Stack Developer at a top tech company within 2 years. I'm also interested in exploring AI/ML roles."
                      rows={3}
                      className="bg-[#0F1117] border-white/10 focus:border-[#3B82F6]/50 focus:ring-1 focus:ring-[#3B82F6]/50 rounded-lg px-4 py-3 text-white placeholder:text-white/20 resize-none"
                    />
                  </div>
                </div>

                <Button
                  data-testid="manual-submit-btn"
                  onClick={handleManualSubmit}
                  disabled={loading}
                  className="mt-8 bg-[#3B82F6] text-white rounded-full px-10 py-3 font-semibold hover:opacity-90 transition-all shadow-[0_0_20px_-5px_rgba(59,130,246,0.5)] disabled:opacity-40 disabled:cursor-not-allowed w-full md:w-auto"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing Profile...
                    </>
                  ) : (
                    "Analyze My Profile"
                  )}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Loading overlay */}
        {loading && (
          <div data-testid="analysis-loading" className="fixed inset-0 z-50 bg-[#0B0C10]/80 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-[#1A1D25] border border-white/10 rounded-2xl p-10 text-center max-w-sm">
              <div className="w-16 h-16 rounded-full border-4 border-[#3B82F6]/20 border-t-[#3B82F6] animate-spin mx-auto mb-6" />
              <h3 className="text-xl font-medium text-[#F8FAFC] mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                AI is Analyzing
              </h3>
              <p className="text-sm text-[#94A3B8]">
                Our AI is reviewing your profile, identifying skill gaps, and mapping career paths. This may take up to a minute.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
