# SkillSync 🚀 
**Your AI-Powered Career Partner**

An intelligent, multi-dimensional job matching engine designed to bridge the gap between job seekers and their perfect roles. Built for speed, precision, and predictive learning, SkillSync doesn’t just search for jobs—it analyzes your trajectory.

### 🌟 High-Level Features
- **V2 Recalibration Engine:** Calculates an ultra-accurate `calculatedScore` matrix based on NLP-extracted textual skills from your resume weighted against live RapidAPI JSearch schemas.
- **Behavioral Loop Tracking:** Machine Learning simulation natively hooks into your interaction graph. When you 'Quick Apply' to consecutive roles (e.g. React roles), the internal brain actively learns and mathematically boosts similar jobs up your feed.
- **Parametric Preference Routing:** Fully supports hybrid, on-site, and remote-first sorting logic. Aggressively drops matrix scoring when job requirements misalign with your explicitly requested work environments or experience levels.
- **Dynamic Deep Analysis:** Secure React Router handoffs seamlessly pass live extracted API payload data straight into the secondary Analysis Views without requiring redundant network overhead.
- **Smart Pathway Upskilling:** Features a one-click automated predictor that evaluates your indexed skill count, identifies your next logical career promotion track (e.g., Mid-Level to Senior), and immediately queries the live database for advanced roles.

### 🛠️ Core Technology Stack
- **Frontend Framework:** React (+ Vite Compiler for sub-3-second HMR delivery)
- **Design Architecture:** Tailwind CSS (V4) running custom UI Tokens & dynamic Micro-animations. Native Tailwind Form injection. 
- **Database & Auth pipeline:** Supabase (Remote cloud data syncing & identity logic)
- **Exchange Engine:** JSearch (Powered by RapidAPI)

### 🚀 Getting Started

**1. Clone the repository**
```bash
git clone https://github.com/PraneethBadri/SkillSync.git
cd SkillSync
```

**2. Install native dependencies**
```bash
npm install
```

**3. Configure your API Keys**
You will need to clone a `.env` file into your root and map:
```env
VITE_RAPIDAPI_KEY=your_rapidapi_token_here
```

**4. Engage Local Server**
```bash
npm run dev
```
Access the local node at `http://localhost:5173`. 

---
*Built with ❤️ for rapid hackathon execution.*
