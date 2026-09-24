import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import UserProvider from "./context/UserContext.jsx";
import { Toaster } from "react-hot-toast";
import EditResume from "./components/EditResume.jsx";
import AiChatbot from "./components/AiChatbot.jsx";

const App = () => {
  return (
    <UserProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/resume/:resumeId" element={<EditResume />} />
      </Routes>

      {/* Global AI Career Coach & Resume Assistant Chatbot */}
      <AiChatbot />

      <Toaster
        position="top-right"
        toastOptions={{
          className: '',
          style: {
            fontSize: '13px',
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        }}
      />
    </UserProvider>
  );
};

export default App;

