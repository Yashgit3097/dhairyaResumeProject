import React, { useState, useEffect } from 'react';
import { Sparkles, Copy, Check, Wand2, X, RefreshCw, Layers, ArrowRight, ShieldCheck } from 'lucide-react';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';
import toast from 'react-hot-toast';

const EXPERIENCE_LEVELS = [
  { id: 'fresher', label: '🎓 Fresher / Entry Level', desc: 'No/little formal work exp, high passion & projects' },
  { id: 'mid-level', label: '💼 Mid-Level (2-5 yrs)', desc: 'Hands-on experience, core technical depth' },
  { id: 'senior', label: '🚀 Senior / Lead (5+ yrs)', desc: 'Architecture, leadership, driving impact' },
  { id: 'executive', label: '👑 Executive / Director', desc: 'Strategic vision, cross-functional leadership' },
  { id: 'career-switcher', label: '🔄 Career Switcher', desc: 'Transitioning with transferable skills' },
];

const TONES = [
  { id: 'professional', label: 'Professional & Impactful' },
  { id: 'modern', label: 'Modern & Dynamic' },
  { id: 'technical', label: 'Technical & Direct' },
];

const AiSummaryModal = ({ isOpen, onClose, initialRole = '', onApplySummary }) => {
  const [role, setRole] = useState(initialRole || '');
  const [experienceLevel, setExperienceLevel] = useState('fresher');
  const [tone, setTone] = useState('professional');
  const [keySkills, setKeySkills] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [selectedVariation, setSelectedVariation] = useState(0);

  // Sync role whenever modal opens or initialRole changes
  useEffect(() => {
    if (isOpen) {
      setRole(initialRole || '');
    }
  }, [isOpen, initialRole]);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!role.trim()) {
      toast.error('Please enter a target Job Role or Designation.');
      return;
    }

    try {
      setIsGenerating(true);
      setResults(null);
      setCopiedIndex(null);

      const response = await axiosInstance.post(API_PATHS.AI.GENERATE_SUMMARY, {
        role: role.trim(),
        experienceLevel,
        tone,
        keySkills: keySkills.trim(),
      });

      if (response.data && response.data.data) {
        setResults(response.data.data);
        setSelectedVariation(0);
        toast.success('Generated 3 personalized summaries with AI!');
      }
    } catch (error) {
      console.error('Error generating summary:', error);
      const errMsg = error.response?.data?.message || error.message || 'Failed to generate summary with AI';
      toast.error(errMsg, { duration: 5000 });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast.success('Summary copied to clipboard!');
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  const handleApply = (text) => {
    if (onApplySummary) {
      onApplySummary(text);
      toast.success('Summary applied to your resume!');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col border border-slate-100 animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/15 rounded-lg backdrop-blur-md">
              <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight flex items-center gap-2">
                AI Summary Generator
                <span className="text-[10px] bg-yellow-400/30 text-yellow-200 uppercase font-semibold px-2 py-0.5 rounded-full border border-yellow-300/40">
                  AI Powered
                </span>
              </h3>
              <p className="text-xs text-purple-100">
                Generate humanized, ATS-compliant summaries customized to your experience level
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
          {/* Form Inputs */}
          <div className="space-y-4">
            {/* Target Job Role */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Target Job Role / Designation <span className="text-red-500">*</span>
                </label>
                {initialRole && role !== initialRole && (
                  <button
                    type="button"
                    onClick={() => setRole(initialRole)}
                    className="text-[11px] text-purple-600 hover:text-purple-800 font-semibold hover:underline"
                  >
                    ↺ Reset to "{initialRole}"
                  </button>
                )}
              </div>
              <input
                type="text"
                placeholder="e.g. Full Stack Developer, Data Analyst, Product Designer..."
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none text-sm transition font-medium"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                {initialRole
                  ? "✓ Pre-filled with your resume designation. You can edit it freely before generating."
                  : "Enter your target job title to generate highly tailored summaries."}
              </p>
            </div>

            {/* Experience Level */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Experience Level (Difficulty)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {EXPERIENCE_LEVELS.map((level) => (
                  <button
                    key={level.id}
                    type="button"
                    onClick={() => setExperienceLevel(level.id)}
                    className={`text-left p-2.5 rounded-xl border transition-all text-xs flex flex-col justify-between ${
                      experienceLevel === level.id
                        ? 'border-purple-600 bg-purple-50/70 text-purple-900 shadow-sm font-semibold'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 text-slate-600'
                    }`}
                  >
                    <span className="font-semibold text-slate-800">{level.label}</span>
                    <span className="text-[11px] text-slate-500 mt-0.5">{level.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Optional Skills & Tone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Key Skills / Keywords (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. React, Node.js, AWS, Tailwind..."
                  value={keySkills}
                  onChange={(e) => setKeySkills(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none text-xs transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Summary Tone
                </label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none text-xs transition bg-white"
                >
                  {TONES.map((t) => (
                    <option key={t.id} value={t.id}>{t.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating || !role.trim()}
            className={`w-full py-3 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 shadow-lg transition-all ${
              isGenerating || !role.trim()
                ? 'bg-slate-400 cursor-not-allowed shadow-none'
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 hover:shadow-purple-500/25 active:scale-[0.99]'
            }`}
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Crafting Humanized Summaries with AI...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                <span>Generate ATS-Friendly Summaries</span>
              </>
            )}
          </button>

          {/* Loading Animation Card */}
          {isGenerating && (
            <div className="p-6 bg-gradient-to-br from-purple-50/50 to-indigo-50/50 rounded-2xl border border-purple-100 flex flex-col items-center text-center space-y-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin" />
                <Sparkles className="w-5 h-5 text-purple-600 absolute inset-0 m-auto animate-pulse" />
              </div>
              <div>
                <p className="text-sm font-bold text-purple-900">AI is writing your summary...</p>
                <p className="text-xs text-purple-600 mt-0.5">
                  Optimizing keywords for ATS, crafting humanized voice & tailoring to {experienceLevel}
                </p>
              </div>
            </div>
          )}

          {/* Results Section */}
          {results && results.summaries && (
            <div className="space-y-4 pt-2 border-t border-slate-100 animate-fadeIn">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-purple-600" />
                  Select Your Preferred Variation (3 Generated)
                </h4>
                <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> 100% ATS Ready
                </span>
              </div>

              {/* Variation Tabs */}
              <div className="flex gap-2 p-1 bg-slate-100 rounded-xl overflow-x-auto">
                {results.summaries.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedVariation(idx)}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                      selectedVariation === idx
                        ? 'bg-white text-purple-700 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {item.title || `Variation ${idx + 1}`}
                  </button>
                ))}
              </div>

              {/* Selected Summary Card */}
              {results.summaries[selectedVariation] && (
                <div className="p-4 rounded-xl border-2 border-purple-500 bg-purple-50/40 relative group space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-900 px-2.5 py-0.5 bg-purple-200/60 rounded-md">
                      {results.summaries[selectedVariation].title}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(results.summaries[selectedVariation].summary, selectedVariation)}
                      className="flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-purple-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200 hover:border-purple-300 shadow-sm transition"
                    >
                      {copiedIndex === selectedVariation ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-600">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-sm text-slate-700 leading-relaxed font-normal">
                    {results.summaries[selectedVariation].summary}
                  </p>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleApply(results.summaries[selectedVariation].summary)}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-purple-500/20 flex items-center gap-1.5 transition active:scale-95"
                    >
                      <span>Apply to Summary Field</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AiSummaryModal;
