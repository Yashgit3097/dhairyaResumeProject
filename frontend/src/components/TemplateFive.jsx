"use client";
import React, { useEffect, useRef, useState } from "react";
import { 
  LuMail, 
  LuPhone, 
  LuMapPin, 
  LuGlobe, 
  LuGithub, 
  LuExternalLink, 
  LuBriefcase, 
  LuGraduationCap, 
  LuAward 
} from "react-icons/lu";
import { RiLinkedinLine } from "react-icons/ri";
import { formatYearMonth } from "../utils/helper";

const TemplateFive = ({ resumeData = {}, containerWidth }) => {
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
      className="bg-white font-sans text-stone-800 p-8 shadow-sm print:shadow-none"
      style={{
        transform: containerWidth > 0 ? `scale(${scale})` : undefined,
        transformOrigin: "top left",
        width: containerWidth > 0 ? `${baseWidth}px` : "100%",
        minHeight: "1120px",
        boxSizing: "border-box",
      }}
    >
      {/* Top Emerald Header */}
      <div className="pb-6 border-b border-emerald-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                {profileInfo.designation || "Available for Opportunities"}
              </span>
            </div>
            <h1 className="text-3xl font-black text-stone-900 tracking-tight">
              {profileInfo.fullName || "Your Full Name"}
            </h1>
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-stone-600 font-medium">
            {contactInfo.email && (
              <a href={`mailto:${contactInfo.email}`} className="flex items-center gap-1.5 hover:text-emerald-700 transition">
                <LuMail className="text-emerald-600" />
                <span>{contactInfo.email}</span>
              </a>
            )}
            {contactInfo.phone && (
              <a href={`tel:${contactInfo.phone}`} className="flex items-center gap-1.5 hover:text-emerald-700 transition">
                <LuPhone className="text-emerald-600" />
                <span>{contactInfo.phone}</span>
              </a>
            )}
            {contactInfo.location && (
              <span className="flex items-center gap-1.5">
                <LuMapPin className="text-emerald-600" />
                <span>{contactInfo.location}</span>
              </span>
            )}
            {contactInfo.linkedin && (
              <a href={contactInfo.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-emerald-700 transition">
                <RiLinkedinLine className="text-emerald-600" />
                <span>LinkedIn</span>
              </a>
            )}
            {contactInfo.github && (
              <a href={contactInfo.github} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-emerald-700 transition">
                <LuGithub className="text-emerald-600" />
                <span>GitHub</span>
              </a>
            )}
            {contactInfo.website && (
              <a href={contactInfo.website} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-emerald-700 transition">
                <LuGlobe className="text-emerald-600" />
                <span>Website</span>
              </a>
            )}
          </div>
        </div>

        {/* Profile Summary */}
        {profileInfo.summary && (
          <div className="mt-4 pt-4 border-t border-stone-100">
            <p className="text-xs text-stone-600 leading-relaxed">
              {profileInfo.summary}
            </p>
          </div>
        )}
      </div>

      {/* Main Grid: 68% Left Experience & Projects, 32% Right Skills & Education */}
      <div className="grid grid-cols-12 gap-8 mt-6">
        {/* Left Column: Experience & Projects */}
        <div className="col-span-12 md:col-span-8 space-y-7">
          {/* Work Experience with Modern Timeline */}
          {workExperience && workExperience.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <LuBriefcase className="text-emerald-600 text-lg" />
                <h2 className="text-sm font-extrabold uppercase tracking-wider text-stone-900">
                  Experience & Roles
                </h2>
                <div className="flex-1 h-px bg-stone-200 ml-2" />
              </div>

              <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-emerald-200">
                {workExperience.map((exp, index) => (
                  <div key={index} className="relative group text-xs">
                    {/* Timeline node */}
                    <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-emerald-600 ring-4 ring-emerald-100" />

                    <div className="flex justify-between items-baseline flex-wrap gap-1">
                      <h3 className="font-bold text-stone-900 text-sm">{exp.role}</h3>
                      {(exp.startDate || exp.endDate) && (
                        <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">
                          {formatYearMonth(exp.startDate)} — {exp.endDate ? formatYearMonth(exp.endDate) : "Present"}
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-semibold text-emerald-700 mb-2">{exp.company}</p>

                    {exp.description && (
                      <div className="text-xs text-stone-600 space-y-1.5">
                        {exp.description.split("\n").map((line, lIdx) => {
                          const cleanLine = line.replace(/^[•\-\*]\s*/, "").trim();
                          if (!cleanLine) return null;
                          return (
                            <div key={lIdx} className="flex items-start gap-2">
                              <span className="text-emerald-500 font-bold leading-none mt-1">✓</span>
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

          {/* Projects */}
          {projects && projects.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-sm font-extrabold uppercase tracking-wider text-stone-900">
                  Key Projects & Initiatives
                </h2>
                <div className="flex-1 h-px bg-stone-200 ml-2" />
              </div>

              <div className="space-y-3.5">
                {projects.map((proj, index) => (
                  <div key={index} className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/40 hover:border-emerald-300 transition text-xs">
                    <div className="flex justify-between items-center mb-1.5">
                      <h3 className="font-bold text-stone-900 text-xs flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                        {proj.title}
                      </h3>
                      <div className="flex items-center gap-3">
                        {proj.github && (
                          <a href={proj.github} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[11px] text-stone-600 hover:text-emerald-700 font-medium">
                            <LuGithub className="text-xs" /> Code
                          </a>
                        )}
                        {proj.liveDemo && (
                          <a href={proj.liveDemo} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[11px] text-emerald-700 font-bold hover:underline">
                            <LuExternalLink className="text-xs" /> Live Demo
                          </a>
                        )}
                      </div>
                    </div>

                    {proj.description && (
                      <p className="text-xs text-stone-600 leading-relaxed mb-2">
                        {proj.description}
                      </p>
                    )}

                    {proj.technologies && proj.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {proj.technologies.map((t, tIdx) => (
                          <span key={tIdx} className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-100/70 text-emerald-800">
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
        </div>

        {/* Right Column: Skills, Education, Certs, Languages */}
        <div className="col-span-12 md:col-span-4 space-y-6">
          {/* Skills Badges */}
          {skills && skills.length > 0 && (
            <div>
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-stone-900 mb-3 pb-1 border-b border-stone-200">
                Skills & Tech Stack
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-stone-100 text-stone-800 border border-stone-200 hover:bg-emerald-50 hover:border-emerald-300 transition"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {education && education.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-3 pb-1 border-b border-stone-200">
                <LuGraduationCap className="text-emerald-600 text-sm" />
                <h2 className="text-xs font-extrabold uppercase tracking-wider text-stone-900">
                  Education
                </h2>
              </div>
              <div className="space-y-3">
                {education.map((edu, index) => (
                  <div key={index} className="text-xs">
                    <p className="font-bold text-stone-900">{edu.degree}</p>
                    <p className="text-stone-600 font-medium">{edu.institution}</p>
                    {(edu.startDate || edu.endDate || edu.graduationYear) && (
                      <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">
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
              <div className="flex items-center gap-1.5 mb-3 pb-1 border-b border-stone-200">
                <LuAward className="text-emerald-600 text-sm" />
                <h2 className="text-xs font-extrabold uppercase tracking-wider text-stone-900">
                  Certifications
                </h2>
              </div>
              <div className="space-y-2">
                {certifications.map((cert, index) => (
                  <div key={index} className="text-xs p-2.5 rounded-lg bg-emerald-50/50 border border-emerald-100">
                    <p className="font-bold text-stone-800">{cert.title}</p>
                    <div className="flex justify-between items-center text-[11px] text-stone-500 mt-0.5">
                      <span>{cert.issuer}</span>
                      {cert.year && <span className="text-emerald-700 font-bold">{cert.year}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {languages && languages.length > 0 && (
            <div>
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-stone-900 mb-3 pb-1 border-b border-stone-200">
                Languages
              </h2>
              <div className="space-y-2">
                {languages.map((lang, index) => (
                  <div key={index} className="flex justify-between items-center text-xs">
                    <span className="font-medium text-stone-700">{lang.name}</span>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      {lang.progress ? `${Math.round(lang.progress / 20)}/5` : "Proficient"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Interests */}
          {interests && interests.length > 0 && interests[0] && (
            <div>
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-stone-900 mb-3 pb-1 border-b border-stone-200">
                Interests & Passions
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {interests.map((interest, index) => interest && (
                  <span
                    key={index}
                    className="text-[11px] font-medium px-2 py-0.5 bg-stone-50 border border-stone-200 text-stone-600 rounded-md"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplateFive;
