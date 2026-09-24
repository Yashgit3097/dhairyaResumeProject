"use client";
import React, { useEffect, useRef, useState } from "react";
import { 
  LuMail, 
  LuPhone, 
  LuMapPin, 
  LuGlobe, 
  LuGithub, 
  LuExternalLink, 
  LuCode, 
  LuCpu, 
  LuGraduationCap, 
  LuAward, 
  LuTerminal 
} from "react-icons/lu";
import { RiLinkedinLine } from "react-icons/ri";
import { formatYearMonth } from "../utils/helper";

const TemplateSix = ({ resumeData = {}, containerWidth }) => {
  const {
    profileInfo = {},
    contactInfo = {},
    education = [],
    languages = [],
    workExperience = [],
    projects = [],
    skills = [],
    certifications = [],
    interests = [],
  } = resumeData;

  const resumeRef = useRef(null);
  const [baseWidth, setBaseWidth] = useState(800);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (resumeRef.current && containerWidth > 0) {
      const actualWidth = resumeRef.current.offsetWidth;
      setBaseWidth(actualWidth);
      setScale(containerWidth / actualWidth);
    }
  }, [containerWidth]);

  return (
    <div
      ref={resumeRef}
      className="bg-white font-sans text-slate-900 shadow-sm print:shadow-none"
      style={{
        transform: containerWidth > 0 ? `scale(${scale})` : undefined,
        transformOrigin: "top left",
        width: containerWidth > 0 ? `${baseWidth}px` : "100%",
        minHeight: "1120px",
        boxSizing: "border-box",
      }}
    >
      {/* Top Accent Gradient Bar */}
      <div className="h-2 bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500" />

      <div className="p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-5 border-b-2 border-slate-900">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 font-mono">
              {profileInfo.fullName || "Developer Name"}
            </h1>
            <p className="text-sm font-bold text-indigo-600 tracking-wide mt-1 flex items-center gap-1.5 font-mono">
              <LuTerminal className="text-indigo-600" />
              {profileInfo.designation || "Software Engineering Professional"}
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-1.5 text-xs text-slate-700 font-mono">
            <div className="flex flex-wrap items-center gap-3">
              {contactInfo.email && (
                <a href={`mailto:${contactInfo.email}`} className="flex items-center gap-1 hover:text-indigo-600 font-medium">
                  <LuMail className="text-indigo-600" /> {contactInfo.email}
                </a>
              )}
              {contactInfo.phone && (
                <a href={`tel:${contactInfo.phone}`} className="flex items-center gap-1 hover:text-indigo-600 font-medium">
                  <LuPhone className="text-indigo-600" /> {contactInfo.phone}
                </a>
              )}
              {(contactInfo.location || contactInfo.address) && (
                <span className="flex items-center gap-1 text-slate-500">
                  <LuMapPin className="text-indigo-600" /> {contactInfo.location || contactInfo.address}
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-1">
              {contactInfo.linkedin && (
                <a href={contactInfo.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-indigo-600">
                  <RiLinkedinLine className="text-indigo-600" /> LinkedIn
                </a>
              )}
              {contactInfo.github && (
                <a href={contactInfo.github} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-indigo-600 font-semibold">
                  <LuGithub className="text-indigo-600" /> GitHub
                </a>
              )}
              {contactInfo.website && (
                <a href={contactInfo.website} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-indigo-600 font-semibold">
                  <LuGlobe className="text-indigo-600" /> Portfolio
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Professional Summary */}
        {profileInfo.summary && (
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-black uppercase tracking-widest text-indigo-700 font-mono">
                // 01. SUMMARY
              </h2>
              <div className="flex-1 h-px bg-indigo-100" />
            </div>
            <p className="text-xs text-slate-700 leading-relaxed text-justify">
              {profileInfo.summary}
            </p>
          </div>
        )}

        {/* Technical Competencies Matrix */}
        {skills && skills.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-black uppercase tracking-widest text-indigo-700 font-mono flex items-center gap-1">
                <LuCpu className="text-indigo-600" /> // 02. TECHNICAL SKILLS & STACK
              </h2>
              <div className="flex-1 h-px bg-indigo-100" />
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 text-xs font-mono font-medium px-2.5 py-1 bg-white border border-slate-300 text-slate-800 rounded shadow-2xs hover:border-indigo-500 hover:text-indigo-700 transition"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Experience */}
        {workExperience && workExperience.length > 0 && (
          <div className="space-y-3.5">
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-black uppercase tracking-widest text-indigo-700 font-mono">
                // 03. WORK EXPERIENCE
              </h2>
              <div className="flex-1 h-px bg-indigo-100" />
            </div>

            <div className="space-y-4">
              {workExperience.map((exp, index) => (
                <div key={index} className="text-xs space-y-1">
                  <div className="flex justify-between items-baseline flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{exp.role}</span>
                      <span className="text-indigo-600 font-bold">@ {exp.company}</span>
                    </div>
                    {(exp.startDate || exp.endDate) && (
                      <span className="font-mono text-[11px] font-semibold text-slate-500">
                        [{formatYearMonth(exp.startDate)} — {exp.endDate ? formatYearMonth(exp.endDate) : "Present"}]
                      </span>
                    )}
                  </div>

                  {exp.description && (
                    <div className="text-xs text-slate-700 space-y-1 pl-1 pt-1">
                      {exp.description.split("\n").map((line, lIdx) => {
                        const cleanLine = line.replace(/^[•\-\*]\s*/, "").trim();
                        if (!cleanLine) return null;
                        return (
                          <div key={lIdx} className="flex items-start gap-2">
                            <span className="text-indigo-600 font-mono font-bold leading-none mt-1">›</span>
                            <span className="leading-relaxed">{cleanLine}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Featured Projects */}
        {projects && projects.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-black uppercase tracking-widest text-indigo-700 font-mono flex items-center gap-1">
                <LuCode className="text-indigo-600" /> // 04. PROJECTS & SYSTEM BUILDS
              </h2>
              <div className="flex-1 h-px bg-indigo-100" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {projects.map((proj, index) => (
                <div key={index} className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs hover:border-indigo-400 transition text-xs flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-slate-900 font-mono text-xs">{proj.title}</h3>
                      <div className="flex items-center gap-2">
                        {proj.github && (
                          <a href={proj.github} target="_blank" rel="noreferrer" className="text-slate-500 hover:text-indigo-600">
                            <LuGithub className="text-xs" />
                          </a>
                        )}
                        {proj.liveDemo && (
                          <a href={proj.liveDemo} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">
                            <LuExternalLink className="text-xs" />
                          </a>
                        )}
                      </div>
                    </div>
                    {proj.description && (
                      <p className="text-xs text-slate-600 leading-relaxed mb-2">
                        {proj.description}
                      </p>
                    )}
                  </div>

                  {proj.technologies && proj.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1 pt-1.5 border-t border-slate-100">
                      {proj.technologies.map((t, tIdx) => (
                        <span key={tIdx} className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education & Certifications 2-Column Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
          {/* Education */}
          {education && education.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <LuGraduationCap className="text-indigo-600" />
                <h2 className="text-xs font-black uppercase tracking-widest text-indigo-700 font-mono">
                  // EDUCATION
                </h2>
              </div>
              <div className="space-y-2.5">
                {education.map((edu, index) => (
                  <div key={index} className="text-xs">
                    <p className="font-bold text-slate-900">{edu.degree}</p>
                    <div className="flex justify-between items-center text-slate-600">
                      <span>{edu.institution}</span>
                      {(edu.startDate || edu.endDate || edu.graduationYear) && (
                        <span className="font-mono text-[10px] text-slate-500">
                          {edu.startDate ? `${formatYearMonth(edu.startDate)} - ${formatYearMonth(edu.endDate) || 'Present'}` : edu.graduationYear}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications & Languages */}
          <div className="space-y-4">
            {certifications && certifications.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2.5">
                  <LuAward className="text-indigo-600" />
                  <h2 className="text-xs font-black uppercase tracking-widest text-indigo-700 font-mono">
                    // CERTIFICATIONS
                  </h2>
                </div>
                <div className="space-y-2">
                  {certifications.map((cert, index) => (
                    <div key={index} className="text-xs flex justify-between items-center">
                      <div>
                        <p className="font-bold text-slate-900">{cert.title}</p>
                        <p className="text-[11px] text-slate-500">{cert.issuer}</p>
                      </div>
                      {cert.year && (
                        <span className="font-mono text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                          {cert.year}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {languages && languages.length > 0 && (
              <div>
                <h2 className="text-xs font-black uppercase tracking-widest text-indigo-700 font-mono mb-1.5">
                  // LANGUAGES
                </h2>
                <div className="flex flex-wrap gap-2 text-xs">
                  {languages.map((lang, index) => (
                    <span key={index} className="font-mono text-[11px] bg-indigo-50 text-indigo-900 px-2 py-0.5 rounded border border-indigo-200">
                      {lang.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateSix;
