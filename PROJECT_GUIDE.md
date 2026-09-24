# 📄 Full Project Architecture & Developer Guide

Welcome to the **Resume Builder** project guide. This document explains the entire architecture, data models, end-to-end workflows (including how resumes are created, edited, saved, and rendered), and provides a step-by-step pattern to implement new modules.

---

## 🛠️ 1. Tech Stack Overview

- **Backend:** Node.js, Express.js (ES Modules), MongoDB & Mongoose, Multer (file uploads), JWT & BcryptJS (auth), CORS.
- **Frontend:** React 18, Vite, Tailwind CSS, React Router DOM v6, Axios, Lucide React (icons), `html2canvas` (thumbnail capture), `html2pdf.js` (PDF generation), `react-hot-toast` (notifications).

---

## 📁 2. Workspace & Folder Structure

```
Resume-2/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection logic
│   ├── controllers/
│   │   ├── userController.js     # Register, Login, Get User Profile
│   │   ├── resumeController.js   # CRUD operations for resumes
│   │   └── uploadImages.js       # Uploads profile pic & captured resume thumbnail
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT verification ('protect')
│   │   └── uploadMiddleware.js   # Multer diskStorage & file filters
│   ├── models/
│   │   ├── userModel.js          # User schema (name, email, password)
│   │   └── resumeModel.js        # Comprehensive Resume schema
│   ├── routes/
│   │   ├── userRoutes.js         # /api/auth routes
│   │   └── resumeRoutes.js       # /api/resume routes
│   ├── uploads/                  # Static directory storing uploaded images/thumbnails
│   └── server.js                 # App entry point, CORS, static routes, DB init
│
└── frontend/
    └── src/
        ├── context/
        │   └── UserContext.jsx   # Global auth state & token management
        ├── pages/
        │   ├── LandingPage.jsx   # Landing / marketing page
        │   ├── Dashboard.jsx     # User dashboard listing all saved resumes & creation modal
        │   └── ResumeEditor.jsx  # Editor shell / routing helper
        ├── components/
        │   ├── EditResume.jsx    # Master multi-step resume editor controller
        │   ├── Forms.jsx         # Sub-forms (Profile, Contact, Work, Education, Skills, etc.)
        │   ├── RenderResume.jsx  # Template renderer switch
        │   ├── TemplateOne.jsx   # Resume Design Template 1
        │   ├── TemplateTwo.jsx   # Resume Design Template 2
        │   ├── TemplateThree.jsx # Resume Design Template 3
        │   ├── ThemeSelector.jsx # Palette & theme switcher
        │   ├── StepProgress.jsx  # Multi-step navigation bar & completion indicator
        │   ├── Cards.jsx         # Resume cards & preview components
        │   └── Navbar.jsx        # Navigation bar
        └── utils/
            ├── apiPaths.js       # Centralized API endpoint definitions
            ├── axiosInstance.js  # Axios client with automatic Bearer token injection
            ├── color.js          # Color palette definitions & html2canvas CSS fixers
            └── helper.js         # Data transformation & utility functions
```

---

## 🗄️ 3. Data Schema Breakdown

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
| `skills` | `[{ skillName, progress }]` | Skill names with proficiency % (1-100) |
| `projects` | `[{ title, description, githubLink, liveDemoLink }]` | Portfolio items |
| `certifications`| `[{ title, issuer, year }]` | Certification entries |
| `languages` | `[{ name, progress }]` | Language proficiencies |
| `interests` | `[String]` | List of interest tags |

---

## 🔄 4. How the Resume Lifecycle & Saving Works

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
1. **Profile Info** (`fullName`, `designation`, `summary`, profile image)
2. **Contact Info** (`email`, `phone`, `location`, `socials`)
3. **Work Experience** (repeating array with add/remove)
4. **Education** (repeating array with add/remove)
5. **Skills** (repeating array with progress sliders)
6. **Projects** (title, description, links)
7. **Certifications** (title, issuer, year)
8. **Additional Info** (languages & interests)

`EditResume.jsx` recalculates `completionPercentage` in real-time.

### Step 3 & 4: Thumbnail Generation & Save (`uploadResumeImages`)
When user clicks **Save & Exit** or proceeds through final preview:
1. **Hidden DOM Target:** A dedicated hidden element (`thumbnailRef`) renders the chosen resume template.
2. **Color Correction:** `fixTailwindColors(thumbnailElement)` converts modern `oklch`/hex Tailwind colors to standard RGB so `html2canvas` doesn't crash or render blank boxes.
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

## 🔒 5. Authentication Flow

1. **Registration/Login:** `POST /api/auth/register` or `POST /api/auth/login` checks credentials, returns a JWT containing `{ id: user._id }`.
2. **Frontend Storage:** Token stored in `localStorage.getItem('token')`.
3. **Axios Interceptor (`axiosInstance.js`):** Automatically attaches `Authorization: Bearer <token>` header to all outgoing API calls.
4. **Backend Guard (`authMiddleware.js`):** `protect` middleware decodes JWT, finds user via ID, attaches `req.user`, and rejects unauthenticated calls with `401`.

---

## 🚀 6. How to Implement Next Modules

Follow this 4-step recipe whenever adding a new feature:

### Example Scenario A: Adding a new Resume Section (e.g., "Publications" or "Custom Sections")
1. **Model (`backend/models/resumeModel.js`):**
   - Add the new field to `resumeSchema`:
     ```js
     publications: [
       { title: String, publisher: String, date: Date, link: String }
     ]
     ```
2. **Default State (`backend/controllers/resumeController.js` & `frontend/src/components/EditResume.jsx`):**
   - Add `publications: []` into `defaultResumeData` in both backend and frontend state.
3. **Form Component (`frontend/src/components/Forms.jsx`):**
   - Create `PublicationsForm({ data, onChange })` with add/remove entry controls.
4. **Template Display (`TemplateOne.jsx`, `TemplateTwo.jsx`, `TemplateThree.jsx`):**
   - Add a conditional section rendering `resumeData?.publications?.map(...)`.

---

### Example Scenario B: Adding a New Resume Template (e.g., "TemplateFour")
1. Create `frontend/src/components/TemplateFour.jsx`.
2. Add template styling (using Tailwind & `containerWidth` scale factor).
3. Register the new template in `frontend/src/components/RenderResume.jsx`:
   ```jsx
   case "04":
     return <TemplateFour resumeData={resumeData} containerWidth={containerWidth} />
   ```
4. Add template option & preview thumbnail in `frontend/src/components/ThemeSelector.jsx`.

---

### Example Scenario C: Adding AI Resume Generation / Summary Enhancer
1. Create route `POST /api/resume/ai-enhance` in `backend/routes/resumeRoutes.js`.
2. Connect OpenAI/Gemini SDK in a new controller function.
3. Add an "✨ AI Enhance" button inside `frontend/src/components/Forms.jsx` next to the `summary` or `jobDescription` fields.
4. Update state seamlessly with the returned response.

---

## 📡 7. API Reference Cheatsheet

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

