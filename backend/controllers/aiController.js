import { GoogleGenAI } from '@google/genai';

// Initialize Gemini Client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

// Candidate model list matching current Gemini API specifications
const CANDIDATE_MODELS = [
  'gemini-3.6-flash',
  'gemini-3.5-flash-lite',
  'gemini-3.6-pro',
];

// Helper delay
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Robust content generator with automatic retries and model fallbacks
 */
const generateWithModelFallback = async (ai, options, maxRetries = 2) => {
  let lastError = null;

  for (const modelName of CANDIDATE_MODELS) {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        if (attempt > 0) {
          await sleep(800 * attempt); // Brief pause before retry on high demand (503)
        }
        const response = await ai.models.generateContent({
          ...options,
          model: modelName,
        });
        if (response && (response.text || response.candidates)) {
          return response;
        }
      } catch (err) {
        lastError = err;
        // If high demand (503) or rate limit (429), try retrying with exponential backoff
        const isTransient = err.message?.includes('503') || err.message?.includes('high demand') || err.message?.includes('429') || err.message?.includes('fetch failed');
        if (isTransient && attempt < maxRetries) {
          console.warn(`Transient issue with ${modelName} (attempt ${attempt + 1}), retrying...`);
          continue;
        }
        console.warn(`Model ${modelName} failed: ${err.message}. Moving to next candidate...`);
        break; // Break inner loop to try next model in CANDIDATE_MODELS
      }
    }
  }

  throw lastError || new Error('All candidate Gemini models failed.');
};

/**
 * High-quality role-tailored fallback summary generator in case API experiences temporary outages (503)
 */
const getFallbackSummaries = (role, experienceLevel = 'fresher', keySkills = '') => {
  const cleanRole = role || 'Professional';
  const skillsText = keySkills ? `with demonstrated proficiencies in ${keySkills}` : 'with strong core technical and problem-solving abilities';

  if (experienceLevel === 'senior') {
    return {
      summaries: [
        {
          title: "Impact & Leadership-Driven",
          summary: `Accomplished Senior ${cleanRole} with 5+ years of experience leading cross-functional teams, architecting scalable solutions, and delivering high-value business outcomes. Proven track record of optimizing engineering workflows, driving product quality, and mentoring junior engineers.`
        },
        {
          title: "Technical & Systems-Focused",
          summary: `Results-oriented Senior ${cleanRole} ${skillsText}. Experienced in system design, agile execution, and cross-platform deployment. Passionate about leveraging cutting-edge architectures to solve intricate real-world bottlenecks.`
        },
        {
          title: "Concise & Executive",
          summary: `High-impact Senior ${cleanRole} with a background in engineering excellence, technical strategy, and driving cross-team collaboration from concept to production.`
        }
      ],
      recommended: `Accomplished Senior ${cleanRole} with 5+ years of experience leading cross-functional teams, architecting scalable solutions, and delivering high-value business outcomes.`
    };
  }

  if (experienceLevel === 'mid-level') {
    return {
      summaries: [
        {
          title: "Impact & Results-Driven",
          summary: `Driven ${cleanRole} with 2-4 years of hands-on experience building robust, responsive, and maintainable applications. Adept at collaborating in fast-paced agile environments, writing clean code, and accelerating product releases.`
        },
        {
          title: "Technical & Skills-Focused",
          summary: `Proactive ${cleanRole} ${skillsText}. Experienced in building user-centric features, debugging complex issues, and integrating modern APIs to enhance system performance.`
        },
        {
          title: "Concise & Punchy",
          summary: `Dedicated ${cleanRole} combining strong analytical skills with modern toolsets to deliver performant solutions and measurable business impact.`
        }
      ],
      recommended: `Driven ${cleanRole} with 2-4 years of hands-on experience building robust, responsive, and maintainable applications.`
    };
  }

  // Default Fresher / Entry Level
  return {
    summaries: [
      {
        title: "Impact & Foundation-Driven",
        summary: `Motivated and detail-oriented aspiring ${cleanRole} with a strong academic foundation and hands-on project experience in modern methodologies. Eager to apply problem-solving capabilities and passion for clean engineering in a collaborative team.`
      },
      {
        title: "Technical & Skills-Focused",
        summary: `Enthusiastic entry-level ${cleanRole} ${skillsText}. Adept at rapid learning, building full-stack projects, and translating complex requirements into reliable, user-friendly solutions.`
      },
      {
        title: "Concise & Punchy",
        summary: `Fast-learning ${cleanRole} graduate eager to contribute strong foundational skills, curiosity, and disciplined work ethic to high-impact development initiatives.`
      }
    ],
    recommended: `Motivated and detail-oriented aspiring ${cleanRole} with a strong academic foundation and hands-on project experience in modern methodologies.`
  };
};

/**
 * Fallback STAR bullets generator
 */
const getFallbackBullets = (role, text, type) => {
  const cleanRole = role || 'Developer';
  return {
    bulletPoints: [
      `Engineered and deployed key features for ${cleanRole} initiatives, improving system responsiveness and user satisfaction.`,
      `Collaborated with cross-functional stakeholders to translate requirements into clean, maintainable, and testable code.`,
      `Streamlined operational workflows and resolved critical edge cases to ensure 99%+ service reliability.`
    ],
    combinedParagraph: `Engineered and deployed key features for ${cleanRole} initiatives, improving system responsiveness and user satisfaction. Collaborated with cross-functional stakeholders to translate requirements into clean, maintainable code.`
  };
};

/**
 * Generate Humanized, ATS-Friendly Resume Summaries
 */
export const generateSummary = async (req, res) => {
  const { role, experienceLevel = 'fresher', keySkills = '', tone = 'professional' } = req.body;

  if (!role || !role.trim()) {
    return res.status(400).json({ message: 'Target Job Role / Designation is required.' });
  }

  const ai = getGeminiClient();

  if (!ai) {
    // Graceful smart fallback if API key is not yet set
    const fallbackData = getFallbackSummaries(role, experienceLevel, keySkills);
    return res.status(200).json({ success: true, data: fallbackData });
  }

  try {
    const levelDescriptions = {
      fresher: 'an entry-level graduate / fresher with strong foundational skills, passionate enthusiasm, academic projects, and fast learning ability. Focus on knowledge, eagerness, and potential.',
      'mid-level': 'a mid-level professional (2-5 years experience) with proven hands-on track record, technical depth, problem-solving, and collaborative impact.',
      senior: 'a senior/lead professional (5+ years experience) with technical leadership, architecture, mentoring, driving business metrics, and high-impact delivery.',
      executive: 'an executive / director-level leader with strategic vision, cross-functional leadership, and organizational growth.',
      'career-switcher': 'a driven career transitioner leveraging valuable transferable skills, cross-domain knowledge, and agile learning.',
    };

    const targetLevel = levelDescriptions[experienceLevel.toLowerCase()] || levelDescriptions.fresher;

    const prompt = `You are a certified professional resume writer and recruiter.
Write 3 distinct, highly humanized, ATS-friendly resume professional summaries for a candidate targeting the role of "${role}".
Candidate level: ${targetLevel}.
${keySkills ? `Key Skills / Tech Stack to emphasize: ${keySkills}.` : ''}
Desired tone: ${tone}.

Rules:
1. Make them sound genuine, compelling, and human (no robotic clichés).
2. Tailor strictly to the experience level (${experienceLevel}).
3. Keep each summary concise (3 to 4 impactful sentences, around 50-85 words each).
4. Provide 3 distinct styles:
   - Option 1 (Impact & Results-Driven)
   - Option 2 (Technical & Skills-Focused)
   - Option 3 (Concise & Punchy)

Respond ONLY with valid JSON in this exact structure without markdown formatting or code fences:
{
  "summaries": [
    {
      "title": "Impact & Results-Driven",
      "summary": "..."
    },
    {
      "title": "Technical & Skills-Focused",
      "summary": "..."
    },
    {
      "title": "Concise & Punchy",
      "summary": "..."
    }
  ],
  "recommended": "..."
}`;

    const response = await generateWithModelFallback(ai, {
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const responseText = response.text?.trim();
    let parsedData;
    try {
      parsedData = JSON.parse(responseText);
    } catch {
      const cleanJson = responseText.replace(/```json\n?|\n?```/g, '').trim();
      parsedData = JSON.parse(cleanJson);
    }

    res.status(200).json({
      success: true,
      data: parsedData,
    });
  } catch (error) {
    console.error('Gemini Summary Warning (serving smart fallback):', error.message);
    // Seamless fallback so the user always gets 3 tailored summaries without interruption
    const fallbackData = getFallbackSummaries(role, experienceLevel, keySkills);
    res.status(200).json({
      success: true,
      data: fallbackData,
      isFallback: true,
    });
  }
};

/**
 * Enhance Work Experience / Project Descriptions into Star-Method Action Bullets
 */
export const enhanceBulletPoints = async (req, res) => {
  const { role, text, type = 'experience' } = req.body;

  if (!text || !text.trim()) {
    return res.status(400).json({ message: 'Input text is required to enhance.' });
  }

  const ai = getGeminiClient();

  if (!ai) {
    const fallbackData = getFallbackBullets(role, text, type);
    return res.status(200).json({ success: true, data: fallbackData });
  }

  try {
    const prompt = `You are a professional resume editor. Rewrite and polish the following ${type} description for a candidate in the role "${role || 'Professional'}".
Input text:
"${text}"

Rules:
1. Turn this into 3 to 4 strong, humanized, high-impact resume bullet points.
2. Start each bullet point with a powerful past-tense action verb (e.g. Architected, Spearheaded, Engineered, Streamlined, Accelerated).
3. Follow the Google X-Y-Z formula (Accomplished [X], as measured by [Y], by doing [Z]) or STAR method where possible.
4. Keep it realistic, concise, and ATS-friendly.

Respond ONLY with valid JSON in this exact structure:
{
  "bulletPoints": [
    "...",
    "...",
    "..."
  ],
  "combinedParagraph": "..."
}`;

    const response = await generateWithModelFallback(ai, {
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const responseText = response.text?.trim();
    let parsedData;
    try {
      parsedData = JSON.parse(responseText);
    } catch {
      const cleanJson = responseText.replace(/```json\n?|\n?```/g, '').trim();
      parsedData = JSON.parse(cleanJson);
    }

    res.status(200).json({
      success: true,
      data: parsedData,
    });
  } catch (error) {
    console.error('Gemini Bullets Warning (serving smart fallback):', error.message);
    const fallbackData = getFallbackBullets(role, text, type);
    res.status(200).json({
      success: true,
      data: fallbackData,
      isFallback: true,
    });
  }
};

/**
 * AI Career Coach & Resume Assistant Chatbot
 */
export const chatWithAssistant = async (req, res) => {
  const { message, history = [], resumeContext = null } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ message: 'Message cannot be empty.' });
  }

  const ai = getGeminiClient();

  if (!ai) {
    return res.status(200).json({
      success: true,
      reply: "I am ready to help you with your resume! Please make sure your `GEMINI_API_KEY` is configured in `backend/.env`.",
    });
  }

  try {
    const systemInstruction = `You are the "Resume Builder AI Assistant", a friendly, highly concise, and smart career coach and in-app assistant for this Resume Builder web application.

CORE RULES:
1. IDENTITY: If the user asks "who are you", answer: "I am your Resume Builder AI Assistant, built directly into this platform to help you craft, polish, and download professional, ATS-friendly resumes."
2. APP FLOW & GUIDANCE: You know the full workflow of this app and can explain it clearly in short steps:
   - Step 1 (Dashboard): Click "Create New Resume", enter a title, and click Create.
   - Step 2 (Fill 8 Steps):
     • Personal Info: Fill name & role, and click "✨ AI Generate Summary" for customized summaries.
     • Contact Info: Email, phone number, location, and social profiles.
     • Work Experience: Add jobs & click "✨ AI Action Bullets" to generate strong STAR bullet points.
     • Education: Degree, institution, and graduation years.
     • Skills: List skills with 1-5 proficiency ratings.
     • Projects: Project title, live/github links, and "✨ AI Enhance Description".
     • Certifications & Additional Info: Certs, languages, and interests.
   - Step 3 (Theme & Palette): Click the Palette icon to switch between modern templates & color themes.
   - Step 4 (Export): Click "Download PDF" for clean A4 printing or "Save & Exit" to update your dashboard.
3. CONCISE & CLEAR: Keep all explanations, advice, and tips short, clear, and neatly formatted with bullet points. Avoid long-winded paragraphs.
4. SCOPE: Focus exclusively on resumes, job applications, interview tips, skill recommendations, and app usage. Politely redirect unrelated queries back to resumes.
5. READY-TO-USE PHRASES: When asked to write summaries, bullets, or cover letters, output clean, impactful text ready to copy.`;

    const formattedContents = [];
    
    formattedContents.push({
      role: 'user',
      parts: [{ text: `[System Instruction: ${systemInstruction}]\n\nHello! I need assistance with my resume and the app.` }]
    });
    formattedContents.push({
      role: 'model',
      parts: [{ text: `Hello! I'm your Resume Builder AI Assistant. How can I help you build or polish your resume today?` }]
    });


    const recentHistory = history.slice(-10);
    for (const msg of recentHistory) {
      formattedContents.push({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content || msg.text || '' }]
      });
    }

    formattedContents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const response = await generateWithModelFallback(ai, {
      contents: formattedContents,
    });

    res.status(200).json({
      success: true,
      reply: response.text || 'I am here to help you refine your resume! Could you share your target role or experience?',
    });
  } catch (error) {
    console.error('AI Chat Warning (serving smart fallback):', error.message);
    const lower = (message || '').toLowerCase();
    let smartReply = '';

    if (lower.includes('who are you') || lower.includes('who r u') || lower.includes('what are you')) {
      smartReply = `I am your **Resume Builder AI Assistant**! I'm built directly into this platform to help you create, polish, format, and download professional, ATS-friendly resumes.`;
    } else if (lower.includes('how') && (lower.includes('make') || lower.includes('build') || lower.includes('create') || lower.includes('app') || lower.includes('flow'))) {
      smartReply = `Here is how to create a resume in 4 simple steps:\n\n1. **Dashboard:** Click **"Create New Resume"** and enter a title.\n2. **Fill Details:** Complete the 8 sections (use **✨ AI Generate Summary** & **✨ AI Action Bullets** to auto-write content).\n3. **Style & Theme:** Click the Palette icon to pick your template and color palette.\n4. **Download:** Click **Download PDF** for an ATS-ready resume or **Save & Exit**.\n\nNeed help with any specific section?`;
    } else {
      smartReply = `Here are key recommendations for your resume:\n\n- **Targeted Summary:** Click the **✨ AI Generate Summary** button to create personalized, ATS-ready summaries.\n- **Action Verbs:** Start your work experience bullets with words like *Architected, Spearheaded, Engineered, Streamlined*.\n- **Quantify Impact:** Include measurable metrics (e.g. *Improved performance by 30%*).\n\nAsk me anytime to write bullet points, suggest skills, or explain any part of the app!`;
    }

    res.status(200).json({
      success: true,
      reply: smartReply,
    });
  }
};

