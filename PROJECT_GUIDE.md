# 📄 Full Project Architecture & Developer Guide

Welcome to the **Resume Builder** project guide. This document details the entire architecture, data models, end-to-end workflows (including how resumes are created, edited, saved, rendered, and exported), and provides an in-depth breakdown of the **AI Generation & Smart Replay Engine** powered by Google Gemini.

---

## 🛠️ 1. Tech Stack Overview

- **Backend:** Node.js, Express.js (ES Modules), MongoDB & Mongoose, `@google/genai` (Gemini SDK), Multer (file uploads), JWT & BcryptJS (auth), CORS.
- **Frontend:** React 18, Vite, Tailwind CSS, React Router DOM v6, Axios, Lucide React (icons), `html2canvas` (thumbnail capture), `html2pdf.js` (PDF generation), `react-hot-toast` (notifications).

---

## 📁 2. Workspace & Folder Structure

```
Resume-2/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection logic
│   ├── controllers/
│   │   ├── aiController.js       # AI Summary, STAR Bullets, & Chatbot Engine
│   │   ├── resumeController.js   # CRUD operations for resumes
│   │   ├── uploadImages.js       # Uploads profile pic & captured resume thumbnail
│   │   └── userController.js     # Register, Login, Get User Profile
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT verification ('protect')
│   │   └── uploadMiddleware.js   # Multer diskStorage & file filters
│   ├── models/
│   │   ├── resumeModel.js        # Comprehensive Resume schema
│   │   └── userModel.js          # User schema (name, email, password)
│   ├── routes/
│   │   ├── aiRoutes.js           # /api/ai endpoints
│   │   ├── resumeRoutes.js       # /api/resume endpoints
│   │   ├── uploadRoutes.js       # /api/upload endpoints
│   │   └── userRoutes.js         # /api/auth endpoints
│   ├── uploads/                  # Static directory storing uploaded images/thumbnails
│   ├── .env.example              # Environment variable template
│   └── server.js                 # App entry point, CORS, static routes, DB init
│
└── frontend/
    └── src/
        ├── context/
        │   └── UserContext.jsx   # Global auth state & token management
        ├── pages/
        │   ├── Dashboard.jsx     # User dashboard listing all saved resumes & creation modal
        │   ├── LandingPage.jsx   # Landing / marketing page
        │   └── ResumeEditor.jsx  # Editor shell & routing helper
        ├── components/
        │   ├── AiChatbot.jsx     # Floating AI Career Coach & Assistant
        │   ├── AiSummaryModal.jsx# AI Summary Generator Modal (Role, Level, Skills, Tone)
        │   ├── EditResume.jsx    # Master multi-step resume editor controller
        │   ├── Forms.jsx         # Sub-forms (Profile, Contact, Work, Education, Skills, Projects, etc.)
        │   ├── RenderResume.jsx  # Template renderer switch
        │   ├── TemplateOne.jsx   # Modern Minimal Resume Template
        │   ├── TemplateTwo.jsx   # Corporate Professional Resume Template
        │   ├── TemplateThree.jsx # Creative Accent Resume Template
        │   ├── TemplateFour.jsx  # Compact Technical Resume Template
        │   ├── TemplateFive.jsx  # Executive Header Resume Template
        │   ├── TemplateSix.jsx   # Clean Two-Column Resume Template
        │   ├── ThemeSelector.jsx # Palette & theme switcher
        │   ├── StepProgress.jsx  # Multi-step navigation bar & completion indicator
        │   ├── Cards.jsx         # Resume cards & preview components
        │   └── Navbar.jsx        # Navigation bar with user status
        └── utils/
            ├── apiPaths.js       # Centralized API endpoint definitions
            ├── axiosInstance.js  # Axios client with automatic Bearer token injection
            ├── color.js          # Color palette definitions & html2canvas CSS fixers
            └── helper.js         # Data transformation & utility functions
```

---

## 🤖 3. AI Generation & Replay Engine Architecture

The platform features an enterprise-grade AI engine built on top of the **Google Gemini SDK (`@google/genai`)** with resilient fallback handling, model auto-switching, and intelligent offline response generators.

### 🧩 Core AI Features

```
                                  ┌───────────────────────────────┐
                                  │   Frontend AI Integrations    │
                                  └───────────────┬───────────────┘
                                                  │
                 ┌────────────────────────────────┼────────────────────────────────┐
                 │                                │                                │
                 ▼                                ▼                                ▼
       [AiSummaryModal.jsx]              [Forms.jsx AI Buttons]             [AiChatbot.jsx]
     ✨ 3 Tailored Summaries            ✨ STAR Action Bullets            ✨ 24/7 Career Coach
                 │                                │                                │
                 └────────────────────────────────┼────────────────────────────────┘
                                                  │
                                                  ▼
                                 ┌─────────────────────────────────┐
                                 │   POST /api/ai/ (aiRoutes.js)   │
                                 └────────────────┬────────────────┘
                                                  │
                                                  ▼
                                 ┌─────────────────────────────────┐
                                 │       aiController.js           │
                                 │ 1. Model Rotation & Fallback    │
                                 │ 2. Exponential Backoff (503)    │
                                 │ 3. Smart Offline Replier        │
                                 └────────────────┬────────────────┘
                                                  │
                                                  ▼
                                     ┌────────────────────────┐
                                     │  Google Gemini API     │
                                     │  - gemini-3.6-flash     │
                                     │  - gemini-3.5-flash-lite│
                                     │  - gemini-3.6-pro      │
                                     └────────────────────────┘
```

---

### 1️⃣ AI Professional Summary Generator (`POST /api/ai/generate-summary`)
Generates 3 humanized, non-robotic, ATS-optimized professional summaries tailored to:
- **Target Role / Designation** (e.g. Full Stack Developer, Product Manager, Data Scientist)
- **Experience Level:** `fresher` (entry level), `mid-level` (2–4 yrs), `senior` (5+ yrs), `executive`, `career-switcher`.
- **Key Skills / Tech Stack:** Injects concrete proficiencies into the summary.
- **Tone:** Professional, Confident, Modern, or Executive.

#### Output Response Format:
```json
{
  "success": true,
  "data": {
    "summaries": [
      {
        "title": "Impact & Results-Driven",
        "summary": "Accomplished Full Stack Developer with hands-on experience building performant web applications..."
      },
      {
        "title": "Technical & Skills-Focused",
        "summary": "Results-oriented Software Engineer with demonstrated expertise in React, Node.js, and MongoDB..."
      },
      {
        "title": "Concise & Punchy",
        "summary": "Dedicated developer focused on clean code, scalable microservices, and rapid agile delivery."
      }
    ],
    "recommended": "Accomplished Full Stack Developer..."
  }
}
```

---

### 2️⃣ Action Bullets & STAR Enhancer (`POST /api/ai/enhance-bullets`)
Transforms raw job descriptions or informal notes into recruiter-ready action bullets using the **Google X-Y-Z formula** (*"Accomplished [X], as measured by [Y], by doing [Z]"*) or **STAR methodology**.
- Starts each bullet point with a high-impact past-tense action verb (e.g., *Architected, Spearheaded, Engineered, Streamlined*).
- Produces individual bullets and a cohesive paragraph version.

#### Request Body:
```json
{
  "role": "Frontend Engineer",
  "text": "built the ui components and made the site load faster",
  "type": "experience"
}
```

---

### 3️⃣ AI Career Coach & Assistant Chatbot (`POST /api/ai/chat`)
An interactive, context-aware chatbot (`AiChatbot.jsx`) rendered as a floating launcher at the bottom-right corner.
- **Identity & Persona:** Explicitly recognizes itself as the platform's in-app resume guide and career mentor.
- **App Guidance:** Explains end-to-end steps (creating, filling sections, choosing templates, PDF download).
- **Career Coaching:** Suggests skills by role, crafts bullet points on the fly, provides interview advice, and reviews resume wording.
- **Multi-turn History:** Maintains conversational context across messages.

---

### 🛡️ AI Fault-Tolerance, Model Fallbacks & Offline Replay

The backend implements a 3-tier safety net to guarantee **100% uptime and zero UI crashes**:

1. **Candidate Model Rotation:** Tries `gemini-3.6-flash` first; if unavailable, automatically rolls over to `gemini-3.5-flash-lite` or `gemini-3.6-pro`.
2. **Exponential Backoff:** If transient 503 (server overloaded) or 429 (rate limit) errors occur, it automatically pauses and retries.
3. **Smart Offline Replay Engine:** If the Gemini API key is not configured or an outage occurs, the backend transparently serves curated, high-quality, level-specific summaries and STAR bullets. The user experience remains uninterrupted.

---

## 🗄️ 4. Data Schema Breakdown

### 👤 User Model (`backend/models/userModel.js`)
- `name` (String, required)
- `email` (String, required, unique)
- `password` (String, required - hashed with bcrypt)
- `timestamps` (`createdAt`, `updatedAt`)

### 📝 Resume Model (`backend/models/resumeModel.js`)
| Field | Type | Description |
|---|---|---|
| `userId` | `ObjectId` (ref: 'User') | Owner of the resume |
| `title` | `String` | Resume title (e.g. "Software Engineer Resume") |
| `thumbnailLink` | `String` | URL of the auto-generated preview snapshot |
| `template` | `{ theme: String, colorPalette: [String] }` | Selected layout & color scheme |
| `profileInfo` | `{ fullName, designation, summary, profilePreviewUrl }` | Basic identity & summary |
| `contactInfo` | `{ email, phone, address, website, linkedin, github }` | Socials & contact details |
| `workExperience` | `[{ companyName, jobTitle, startDate, endDate, description }]` | Experience list |
| `education` | `[{ institutionName, degree, startDate, endDate, description }]` | Education history |
| `skills` | `[{ skillName, progress }]` | Skill names with proficiency rating |
| `projects` | `[{ title, description, githubLink, liveDemoLink }]` | Portfolio items |
| `certifications`| `[{ title, issuer, year }]` | Certification entries |
| `languages` | `[{ name, progress }]` | Language proficiencies |
| `interests` | `[String]` | List of interest tags |

---

## 🔄 5. How the Resume Lifecycle & Saving Works

```
┌──────────────┐     ┌──────────────┐     ┌────────────────┐     ┌──────────────────┐
│ 1. Create    │ ──> │ 2. Edit &    │ ──> │ 3. Generate    │ ──> │ 4. Upload Images │ ──> 5. Update DB
│ on Dashboard │     │ Validate     │     │ Thumbnail      │     │ & Thumbnail      │     & Return
└──────────────┘     └──────────────┘     └────────────────┘     └──────────────────┘
```

### Step 1: Creation (`Dashboard.jsx` ➔ `POST /api/resume`)
1. User clicks **"Create New Resume"** on the Dashboard.
2. An initial title is submitted.
3. Backend creates a document populated with default placeholder structures and returns the new `_id`.
4. User is redirected to `/resume/:resumeId`.

### Step 2: Multi-Step Editing (`EditResume.jsx`)
The editor maintains the full `resumeData` object in state and steps through sequential sections:
1. **Profile Info** (`fullName`, `designation`, `summary`, profile image, with **✨ AI Summary Generator**)
2. **Contact Info** (`email`, `phone`, `location`, `socials`)
3. **Work Experience** (repeating array with **✨ AI Action Bullets**)
4. **Education** (repeating array with add/remove)
5. **Skills** (repeating array with proficiency sliders)
6. **Projects** (title, description with **✨ AI Action Bullets**, links)
7. **Certifications** (title, issuer, year)
8. **Additional Info** (languages & interests)

`EditResume.jsx` recalculates `completionPercentage` in real-time.

### Step 3 & 4: Thumbnail Generation & Save (`uploadResumeImages`)
When user clicks **Save & Exit** or proceeds through final preview:
1. **Hidden DOM Target:** A dedicated hidden element (`thumbnailRef`) renders the chosen resume template.
2. **Color Correction:** `fixTailwindColors(thumbnailElement)` converts modern `oklch`/hex Tailwind colors to standard RGB so `html2canvas` renders crisp, clean snapshots without color distortion.
3. **Canvas Capture:** `html2canvas` renders the DOM node into a PNG canvas.
4. **DataURL to File:** `dataURLtoFile` turns the canvas snapshot into a multipart `File` (`thumbnail-<id>.png`).
5. **Upload Request (`PUT /api/resume/:id/upload-images`):**
   - Multer saves the thumbnail image into `backend/uploads/`.
   - Deletes the previous thumbnail file to save disk space.
   - Updates `resume.thumbnailLink` in MongoDB.
6. **Full Update Request (`PUT /api/resume/:id`):**
   - The entire `resumeData` (all sections) is saved to MongoDB.
   - User is redirected back to `/dashboard` with updated cards.

### Step 5: PDF Export (`downloadPDF`)
- Uses `html2pdf.js` targeting `resumeDownloadRef`.
- Configured for standard A4 dimensions (`210mm x 297mm`) with `margin: 0` and high image quality (JPEG at 0.98 scale).

---

## 🔒 6. Authentication Flow

1. **Registration/Login:** `POST /api/auth/register` or `POST /api/auth/login` checks credentials, returns a JWT containing `{ id: user._id }`.
2. **Frontend Storage:** Token stored in `localStorage.getItem('token')`.
3. **Axios Interceptor (`axiosInstance.js`):** Automatically attaches `Authorization: Bearer <token>` header to all outgoing API calls.
4. **Backend Guard (`authMiddleware.js`):** `protect` middleware decodes JWT, finds user via ID, attaches `req.user`, and rejects unauthenticated calls with `401`.

---

## ⚙️ 7. Environment Setup & Configuration

### Backend `.env` (`backend/.env`)
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/resume-builder
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_google_gemini_api_key
```

> **Security Note:** Never commit `backend/.env` to Git. A template is provided in `backend/.env.example`.

---

## 📡 8. API Reference Cheatsheet

| Endpoint | Method | Auth | Body / Params | Description |
|---|---|---|---|---|
| `/api/auth/register` | `POST` | Public | `{ name, email, password }` | Register new user |
| `/api/auth/login` | `POST` | Public | `{ email, password }` | Authenticate user & issue JWT |
| `/api/auth/profile` | `GET` | Bearer | - | Get current logged-in user details |
| `/api/resume` | `POST` | Bearer | `{ title, ... }` | Create a new resume |
| `/api/resume` | `GET` | Bearer | - | Get all resumes belonging to user |
| `/api/resume/:id` | `GET` | Bearer | `id` in param | Fetch specific resume |
| `/api/resume/:id` | `PUT` | Bearer | Updated resume JSON | Update resume fields & completion |
| `/api/resume/:id/upload-images` | `PUT` | Bearer | Multipart (`thumbnail`, `profileImage`) | Upload thumbnail & avatar |
| `/api/upload/image` | `POST` | Bearer | Multipart (`image`) | Standalone image / photo upload |
| `/api/resume/:id` | `DELETE` | Bearer | `id` in param | Delete resume & cleanup static files |
| `/api/ai/generate-summary` | `POST` | Bearer | `{ role, experienceLevel, tone, keySkills }` | Generate 3 humanized ATS summaries via Gemini |
| `/api/ai/enhance-bullets` | `POST` | Bearer | `{ role, text, type }` | Convert experience/project into STAR bullets |
| `/api/ai/chat` | `POST` | Bearer | `{ message, history, resumeContext }` | Interactive AI Career & Resume Coach |
| `/uploads/<filename>` | `GET` | Public | File static path | Serves uploaded images & thumbnails (CORS enabled) |
