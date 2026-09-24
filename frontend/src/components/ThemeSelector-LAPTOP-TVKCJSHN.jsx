
import React from 'react'
import{ resumeTemplates } from '../utils/data';
import { useState, useRef } from 'react';


const TAB_DATA = [{ label: 'Templates' }]

const ThemeSelector = ({selectedTheme, setSelectedTheme, resumeData, onClose }) => {

    const resumeRef = useRef(null);
    const [baseWidth, setBaseWidth] = useState(800);  // Default width for desktop


    // Selected ThemeTemplate using id
    const initialIndex = resumeTemplates.findIndex(t => t.id === selectedTheme);
    const [selectedTemplate, setSelectedTemplate] = useState({
        theme: selectedTheme || resumeTemplates[0].id || "",
        index: initialIndex >= 0 ? initialIndex : 0
    });

    const [tabValue, setTabValue] = useState('Templates');

    const handleThemeSelection = () => {
      setSelectedTheme(selectedTemplate.theme);
      onClose();
    }

    const updateBaseWidth = () => {
      if(resumeRef.current) {
        setBaseWidth(resumeRef.current.offsetWidth); // Update base width based on the current width of the resumeRef
      }
    }

  return (
    <div className='max-w-7xl mx-auto px-4'>

      {/* Header */}
    <div className='flex flex-col sm:flex-row items:start sm:items:center justify-between gap-4 mb-8 p-4 sm:p-6 bg-gradient-to-r from-white to-violet-50 rounded-2xl border borde-violet-100'>

      <Tabs tabs={TAB_DATA} activeTab={tabValue} setActiveTab={setActiveTab} />

      <button className='w-full sm:w-auto flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-black rounded-2xl hover:scale-105 transition-all shadow-lg hover:shadow-xl' onClick={handleThemeSelection}>
        <Check size={18} /> Apply Changes
      </button>
    </div>

    <div className=''></div>
    
    </div>
  )
}

export default ThemeSelector
