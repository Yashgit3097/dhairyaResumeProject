
import React, { useEffect, useState, useRef } from 'react'
import { DUMMY_RESUME_DATA, resumeTemplates } from '../utils/data';
import { TemplateCard } from './Cards';
import RenderResume from './RenderResume';
import Tabs from './Tabs';
import { Check } from 'react-feather';

const TAB_DATA = [{ label: 'Templates' }]
 
const ThemeSelector = ({ selectedTheme, setSelectedTheme, resumeData, onClose }) => {
    const resumeRef = useRef(null);
    const [baseWidth, setBaseWidth] = useState(800);

    const initialIndex = resumeTemplates.findIndex(t => t.id === selectedTheme);
    const [selectedTemplate, setSelectedTemplate] = useState({
        theme: selectedTheme || resumeTemplates[0].id || "",
        index: initialIndex >= 0 ? initialIndex : 0
    })

    const [tabValue, setTabValue] = useState("Templates")

    const handleThemeSelection = () => {
      setSelectedTheme(selectedTemplate.theme)
      onClose()
    }

    const updateBaseWidth = () => {
      if (resumeRef.current) {
        setBaseWidth(resumeRef.current.offsetWidth);
      }
    }

    useEffect(() => {
      updateBaseWidth(); 
      window.addEventListener("resize", updateBaseWidth);
      return () => {
        window.removeEventListener("resize", updateBaseWidth);
      };
    }, []);

  return (
    <div className="w-full h-full flex flex-col p-1 sm:p-2">
      {/* Header */}
      <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3 p-3 sm:p-4 bg-gradient-to-r from-white to-violet-50 rounded-2xl border border-violet-100 shrink-0 shadow-xs'> 
        <div className="flex items-center gap-3">
          <Tabs tabs={TAB_DATA} activeTab={tabValue} setActiveTab={setTabValue} />
          <span className="hidden sm:inline-block text-xs font-bold text-violet-700 bg-violet-100/70 px-3 py-1.5 rounded-xl border border-violet-200/50">
            {resumeTemplates.length} ATS Optimized Templates
          </span>
        </div>

        <button 
          className='w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-bold rounded-xl hover:scale-105 active:scale-95 transition-all shadow-md hover:shadow-lg' 
          onClick={handleThemeSelection}
        >
          <Check size={18} /> Apply Changes
        </button>
      </div>

      {/* Main Split: Left Templates List & Right Live Preview */}
      <div className='grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 min-h-0'>
        {/* Left Templates Column */}
        <div className='lg:col-span-5 bg-white rounded-2xl border border-gray-100 p-3 sm:p-4 flex flex-col min-h-0 h-full shadow-xs'>
          <div className="flex items-center justify-between mb-2 px-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Select Resume Template
            </h4>
            <span className="text-[11px] text-slate-500 font-medium">
              Click to preview
            </span>
          </div>
          
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-3.5 overflow-y-auto p-1 flex-1 custom-scrollbar'>
            {resumeTemplates.map((template, index) => (
              <TemplateCard 
                key={`templates_${index}`}
                name={template.name}
                thumbnailImg={template.thumbnailImg}
                isSelected={selectedTemplate.index === index}
                onSelect={() => setSelectedTemplate({ 
                  theme: template.id, 
                  index 
                })}
              />
            ))}
          </div>
        </div>
 
        {/* Right Preview Area */}
        <div className='lg:col-span-7 bg-slate-50/70 rounded-2xl border border-gray-200/70 p-3 sm:p-4 flex flex-col min-h-0 h-full shadow-xs'> 
          <div className="flex items-center justify-between mb-2 px-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Template Preview
            </h4>
            <span className="text-xs font-bold text-violet-700 bg-violet-100 px-3 py-0.5 rounded-full border border-violet-200/50">
              {resumeTemplates[selectedTemplate.index]?.name || "Selected"}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar bg-white rounded-xl shadow-xs p-3 sm:p-5 flex justify-center" ref={resumeRef}>
            <RenderResume 
              templateId={selectedTemplate?.theme || ""}
              resumeData={resumeData || DUMMY_RESUME_DATA}
              containerWidth={baseWidth}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ThemeSelector
