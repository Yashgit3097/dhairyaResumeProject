"use client";
import React, { useEffect, useRef, useState } from "react";
import { 
  LuMail, 
  LuPhone, 
  LuMapPin, 
  LuGlobe, 
  LuGithub, 
  LuExternalLink, 
  LuGraduationCap, 
  LuBriefcase, 
  LuFolderGit2, 
  LuAward, 
  LuLanguages, 
  LuSparkles 
} from "react-icons/lu";
import { RiLinkedinLine } from "react-icons/ri";
import { formatYearMonth } from "../utils/helper";

const TemplateFour = ({ resumeData = {}, containerWidth }) => {
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
      className="bg-white font-sans text-slate-800 shadow-sm print:shadow-none"
      style={{
        transform: containerWidth > 0 ? `scale(${scale})` : undefined,
        transformOrigin: "top left",
        width: containerWidth > 0 ? `${baseWidth}px` : "100%",
        minHeight: "1120px",
        boxSizing: "border-box",
      }}
    >
      {/* Executive Header Banner */}
      <div className="bg-slate-900 text-white px-8 py-7 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-sky-600/20 to-transparent rounded-full -mr-20 -mt-20 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white uppercase">
              {profileInfo.fullName || "Your Name"}
            </h1>
            <p className="text-lg font-medium text-sky-400 mt-1 tracking-wide">
              {profileInfo.designation || "Professional Title"}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-300">
            {contactInfo.email && (
              <a href={`mailto:${contactInfo.email}`} className="flex items-center gap-1.5 hover:text-white transition">
                <LuMail className="text-sky-400 text-sm" />
                <span>{contactInfo.email}</span>
              </a>
            )}
            {contactInfo.phone && (
              <a href={`tel:${contactInfo.phone}`} className="flex items-center gap-1.5 hover:text-white transition">
                <LuPhone className="text-sky-400 text-sm" />
                <span>{contactInfo.phone}</span>
              </a>
            )}
            {contactInfo.location && (
              <span className="flex items-center gap-1.5">
                <LuMapPin className="text-sky-400 text-sm" />
                <span>{contactInfo.location}</span>
              </span>
            )}
          </div>
        </div>

        {/* Social / Web Links Strip */}
        {(contactInfo.linkedin || contactInfo.github || contactInfo.website) && (
          <div className="relative z-10 flex flex-wrap gap-4 mt-3 pt-3 border-t border-slate-800 text-xs text-slate-400">
            {contactInfo.linkedin && (
              <a href={contactInfo.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-sky-300 transition">
                <RiLinkedinLine className="text-sky-400" />
                <span>LinkedIn</span>
              </a>
            )}
            {contactInfo.github && (
              <a href={contactInfo.github} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-sky-300 transition">
                <LuGithub className="text-sky-400" />
                <span>GitHub</span>
              </a>
            )}
            {contactInfo.website && (
              <a href={contactInfo.website} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-sky-300 transition">
                <LuGlobe className="text-sky-400" />
                <span>Portfolio</span>
              </a>
            )}
          </div>
        )}
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-12 min-h-[950px]">
        {/* Left Sidebar (35%) */}
        <div className="col-span-12 md:col-span-4 bg-slate-50 p-6 border-r border-slate-200 space-y-6">
          {/* Skills */}
          {skills && skills.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3 pb-1 border-b-2 border-sky-600">
                <LuSparkles className="text-sky-600 text-base" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Key Competencies
                </h2>
              </div>
              <div className="space-y-2.5">
                {skills.map((skill, index) => {
                  const percent = typeof skill.progress === 'number' ? skill.progress : 80;
                  return (
                    <div key={index} className="text-xs">
                      <div className="flex justify-between font-medium text-slate-700 mb-1">
                        <span>{skill.name}</span>
                        <span className="text-[10px] text-slate-500 font-semibold">{percent}%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-sky-600 to-indigo-600 h-full rounded-full"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Education */}
          {education && education.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3 pb-1 border-b-2 border-sky-600">
                <LuGraduationCap className="text-sky-600 text-base" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Education
                </h2>
              </div>
              <div className="space-y-3">
                {education.map((edu, index) => (
                  <div key={index} className="text-xs">
                    <p className="font-bold text-slate-800">{edu.degree}</p>
                    <p className="text-slate-600 font-medium">{edu.institution}</p>
                    {(edu.startDate || edu.endDate || edu.graduationYear) && (
                      <p className="text-[11px] text-sky-700 font-semibold mt-0.5">
                        {edu.startDate ? `${formatYearMonth(edu.startDate)} - ${formatYearMonth(edu.endDate) || 'Present'}` : edu.graduationYear}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {certifications && certifications.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3 pb-1 border-b-2 border-sky-600">
                <LuAward className="text-sky-600 text-base" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Certifications
                </h2>
              </div>
              <div className="space-y-2.5">
                {certifications.map((cert, index) => (
                  <div key={index} className="text-xs bg-white p-2 rounded-lg border border-slate-200/80 shadow-2xs">
                    <p className="font-bold text-slate-800 leading-tight">{cert.title}</p>
                    <div className="flex justify-between items-center text-[11px] text-slate-500 mt-1">
                      <span>{cert.issuer}</span>
                      {cert.year && <span className="text-sky-600 font-semibold">{cert.year}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {languages && languages.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3 pb-1 border-b-2 border-sky-600">
                <LuLanguages className="text-sky-600 text-base" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Languages
                </h2>
              </div>
              <div className="space-y-2">
                {languages.map((lang, index) => {
                  const dots = Math.max(1, Math.min(5, Math.round((lang.progress || 80) / 20)));
                  return (
                    <div key={index} className="flex justify-between items-center text-xs">
                      <span className="font-medium text-slate-700">{lang.name}</span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((d) => (
                          <div
                            key={d}
                            className={`w-2 h-2 rounded-full ${
                              d <= dots ? "bg-sky-600" : "bg-slate-200"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Interests */}
          {interests && interests.length > 0 && interests[0] && (
            <div>
              <div className="flex items-center gap-2 mb-3 pb-1 border-b-2 border-sky-600">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Interests
                </h2>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {interests.map((interest, index) => interest && (
                  <span
                    key={index}
                    className="text-[11px] font-medium px-2 py-0.5 bg-white border border-slate-200 text-slate-600 rounded-md"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Main Content (65%) */}
        <div className="col-span-12 md:col-span-8 p-6 space-y-6">
          {/* Executive Summary */}
          {profileInfo.summary && (
            <div>
              <div className="flex items-center gap-2 mb-2 pb-1 border-b-2 border-slate-900">
                <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                  Executive Summary
                </h2>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed text-justify bg-slate-50/50 p-3 rounded-lg border-l-4 border-sky-600">
                {profileInfo.summary}
              </p>
            </div>
          )}

          {/* Work Experience */}
          {workExperience && workExperience.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3 pb-1 border-b-2 border-slate-900">
                <LuBriefcase className="text-slate-900 text-base" />
                <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                  Professional Experience
                </h2>
              </div>

              <div className="space-y-4">
                {workExperience.map((exp, index) => (
                  <div key={index} className="text-xs">
                    <div className="flex justify-between items-baseline flex-wrap gap-1">
                      <h3 className="text-sm font-bold text-slate-900">{exp.role}</h3>
                      {(exp.startDate || exp.endDate) && (
                        <span className="text-[11px] font-semibold text-sky-800 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                          {formatYearMonth(exp.startDate)} — {exp.endDate ? formatYearMonth(exp.endDate) : "Present"}
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-semibold text-slate-600 mb-1.5">{exp.company}</p>

                    {exp.description && (
                      <div className="text-xs text-slate-700 space-y-1 pl-2">
                        {exp.description.split("\n").map((line, lIdx) => {
                          const cleanLine = line.replace(/^[•\-\*]\s*/, "").trim();
                          if (!cleanLine) return null;
                          return (
                            <div key={lIdx} className="flex items-start gap-1.5">
                              <span className="text-sky-600 font-bold leading-none mt-1">▸</span>
                              <span className="leading-normal">{cleanLine}</span>
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

          {/* Key Projects */}
          {projects && projects.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3 pb-1 border-b-2 border-slate-900">
                <LuFolderGit2 className="text-slate-900 text-base" />
                <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                  Featured Projects
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-3.5">
                {projects.map((proj, index) => (
                  <div key={index} className="text-xs bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="font-bold text-slate-900 text-xs">{proj.title}</h3>
                      <div className="flex items-center gap-2">
                        {proj.github && (
                          <a
                            href={proj.github}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-slate-600 hover:text-sky-600 font-medium"
                          >
                            <LuGithub className="text-xs" /> Code
                          </a>
                        )}
                        {proj.liveDemo && (
                          <a
                            href={proj.liveDemo}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-sky-700 hover:underline font-bold"
                          >
                            <LuExternalLink className="text-xs" /> Demo
                          </a>
                        )}
                      </div>
                    </div>
                    {proj.description && (
                      <p className="text-xs text-slate-600 leading-relaxed mb-1.5">{proj.description}</p>
                    )}
                    {proj.technologies && proj.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {proj.technologies.map((tech, tIdx) => (
                          <span
                            key={tIdx}
                            className="text-[10px] font-semibold px-2 py-0.5 bg-slate-100 text-slate-700 rounded"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplateFour;
