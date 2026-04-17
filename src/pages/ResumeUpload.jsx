import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ResumeUpload() {
  const { user, setExtractedSkills, userPreferences, setUserPreferences } = useAuth();
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [skills, setSkills] = useState([]);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      startScanning(selectedFile);
    }
  };

  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      startScanning(droppedFile);
    }
  };

  const startScanning = async (fileToScan) => {
    setIsScanning(true);
    setProgress(10);
    
    // Smooth progress simulation while we wait for the API
    const progressInterval = setInterval(() => {
        setProgress(p => Math.min(p + 5, 85));
    }, 200);

    try {
        const formData = new FormData();
        formData.append('file', fileToScan);

        const response = await fetch('http://localhost:8000/parse', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) throw new Error('Parsing failed');
        
        const data = await response.json();
        
        clearInterval(progressInterval);
        setProgress(100);
        
        if (data.skills && data.skills.length > 0) {
            setSkills(data.skills);
            setExtractedSkills(data.skills);
        } else {
            setSkills(["No specific technical skills identified"]);
            setExtractedSkills([]);
        }
    } catch (error) {
        console.error("Failed to parse resume:", error);
        clearInterval(progressInterval);
        setProgress(100);
        setSkills(["Parsing Error. Try manual entry."]);
    }
  };
  return (
    <main className="min-h-[80vh] pb-20 px-6 max-w-7xl mx-auto">
      {/* Editorial Header Section */}
      <header className="mb-12 md:ml-12">
        <span className="text-tertiary font-bold tracking-[0.2em] text-[10px] uppercase block mb-3">Onboarding — Phase 01</span>
        <h1 className="font-headline font-extrabold text-4xl md:text-6xl text-on-surface tracking-tight max-w-2xl leading-[1.1]">
          Intelligence starts with <span className="text-primary italic">your story.</span>
        </h1>
        <p className="mt-6 text-on-surface-variant text-lg max-w-xl">
          Upload your resume and let SkillSync AI map your unique career DNA to global opportunities.
        </p>
      </header>

      {/* Main Onboarding Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Interaction Zone */}
        <div className="lg:col-span-7 space-y-6">
          {/* Drag & Drop Zone */}
          <section 
            onDragOver={handleDragOver} 
            onDrop={handleDrop} 
            onClick={() => fileInputRef.current.click()}
            className="bg-surface-container-lowest rounded-xl p-8 border-2 border-dashed border-outline-variant/30 hover:border-primary/40 transition-colors group cursor-pointer relative overflow-hidden"
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept=".pdf,.docx" 
              onChange={handleFileChange} 
            />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative flex flex-col items-center py-10 text-center">
              <div className="w-16 h-16 bg-primary-fixed rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-primary text-3xl">{file ? "task" : "cloud_upload"}</span>
              </div>
              <h3 className="font-headline font-bold text-xl mb-2">{file ? file.name : "Drop your resume here"}</h3>
              <p className="text-on-surface-variant text-sm mb-6">{file ? "Click to change file" : "PDF or DOCX files supported (Max 5MB)"}</p>
              <button className="bg-secondary-container text-on-secondary-container px-8 py-3 rounded-xl font-bold text-sm tracking-wide transition-all hover:shadow-md active:scale-95">
                {file ? 'CHANGE FILE' : 'SELECT FILE'}
              </button>
            </div>
          </section>

          {/* Progress State */}
          <section className={`bg-surface-container-low rounded-xl p-8 flex items-center justify-between border-l-4 ${progress === 100 ? 'border-secondary' : 'border-tertiary'} transition-opacity ${!isScanning ? 'opacity-50 pointer-events-none' : ''}`}>
            <div className="flex items-center gap-6">
              <div className="relative">
                {progress < 100 ? (
                  <div className="w-12 h-12 rounded-full border-4 border-tertiary/20 border-t-tertiary animate-spin"></div>
                ) : (
                  <div className="w-12 h-12 rounded-full border-4 border-secondary/20 flex items-center justify-center bg-secondary/10"></div>
                )}
                <span className="material-symbols-outlined absolute inset-0 flex items-center justify-center text-tertiary text-xl" style={{fontVariationSettings: "'FILL' 1"}}>
                  {progress === 100 ? "check" : "auto_awesome"}
                </span>
              </div>
              <div>
                <h4 className="font-bold text-on-surface">{progress === 100 ? "Analysis Complete!" : "Scanning Skills..."}</h4>
                <p className="text-on-surface-variant text-xs">{progress === 100 ? "We've mapped your career DNA" : "AI is curating your professional highlights"}</p>
              </div>
            </div>
            <div className={`font-bold font-headline text-lg ${progress === 100 ? 'text-secondary' : 'text-tertiary'}`}>{progress}%</div>
          </section>
        </div>

        {/* Right: Preview and Refinement */}
        <div className="lg:col-span-5">
          <div className="glass-panel p-8 rounded-xl border border-white/40 shadow-2xl shadow-slate-900/10 sticky top-28">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-2 h-8 bg-primary rounded-full"></div>
              <h2 className="font-headline font-bold text-2xl tracking-tight">Extracted Intelligence</h2>
            </div>
            
            {/* Skills Cluster */}
            <div className="mb-10">
              <p className="text-[10px] font-bold text-on-surface-variant tracking-widest uppercase mb-4">Top Skill Clusters</p>
              <div className="flex flex-wrap gap-2">
                {skills.length > 0 ? skills.map(skill => (
                  <span key={skill} className="bg-secondary-fixed text-on-secondary-fixed-variant px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2">
                    {skill} <span className="material-symbols-outlined text-xs cursor-pointer hover:text-error">close</span>
                  </span>
                )) : (
                  <p className="text-sm text-outline italic">Upload your resume to see extracted skills.</p>
                )}
                
                {skills.length > 0 && (
                  <button className="border border-outline-variant/30 text-on-surface-variant px-3 py-1.5 rounded-full text-xs font-semibold hover:bg-surface-container-high transition-colors">
                    + Add Skill
                  </button>
                )}
              </div>
            </div>

            {/* Experience Preview List */}
            <div className="space-y-6 mb-8">
              <p className="text-[10px] font-bold text-on-surface-variant tracking-widest uppercase mb-2">Verified Identity</p>
              <div className="flex gap-4 group">
                <div className="flex flex-col items-center">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5"></div>
                  <div className="w-px h-full bg-outline-variant/30 mt-2"></div>
                </div>
                <div>
                  <h5 className="font-bold text-sm leading-none mb-1">{user ? user.name : 'Guest User'}</h5>
                  <p className="text-xs text-on-surface-variant mb-2">SkillSync AI Profile • Verified</p>
                </div>
              </div>
            </div>

            {/* Neural Preferences (V2) */}
            <div className="space-y-4 mb-12">
               <p className="text-[10px] font-bold text-on-surface-variant tracking-widest uppercase mb-0">Calibration Parameters</p>
               <div className="flex flex-col gap-3">
                  <div>
                    <label className="text-xs font-bold text-on-surface mb-1 block">Experience Track</label>
                    <select 
                      value={userPreferences?.experience || "Mid-Level"}
                      onChange={e => setUserPreferences(p => ({...p, experience: e.target.value}))} 
                      className="w-full bg-surface-container-highest border-none rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary/40 font-medium">
                      <option value="Junior">Junior (0-2 years)</option>
                      <option value="Mid-Level">Mid-Level (3-5 years)</option>
                      <option value="Senior">Senior (5+ years)</option>
                      <option value="Lead">Lead / Staff (8+ years)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-on-surface mb-1 block">Work Environment</label>
                    <div className="flex gap-2">
                      <button onClick={() => setUserPreferences(p => ({...p, environment: 'Remote'}))} className={`flex-1 py-1.5 rounded-md text-xs font-bold transition-all ${userPreferences?.environment === 'Remote' ? 'bg-primary text-on-primary shadow-sm' : 'bg-surface-container-highest text-on-surface-variant'}`}>Remote</button>
                      <button onClick={() => setUserPreferences(p => ({...p, environment: 'Hybrid'}))} className={`flex-1 py-1.5 rounded-md text-xs font-bold transition-all ${userPreferences?.environment === 'Hybrid' ? 'bg-primary text-on-primary shadow-sm' : 'bg-surface-container-highest text-on-surface-variant'}`}>Hybrid</button>
                      <button onClick={() => setUserPreferences(p => ({...p, environment: 'On-site'}))} className={`flex-1 py-1.5 rounded-md text-xs font-bold transition-all ${userPreferences?.environment === 'On-site' ? 'bg-primary text-on-primary shadow-sm' : 'bg-surface-container-highest text-on-surface-variant'}`}>On-site</button>
                    </div>
                  </div>
               </div>
            </div>

            {/* CTA */}
            <div className="space-y-3">
              <Link to="/dashboard" className="w-full bg-primary text-on-primary py-4 rounded-xl font-bold text-sm tracking-widest uppercase flex items-center justify-center gap-3 transition-all hover:bg-primary-container shadow-xl shadow-primary/20">
                REFINE AND CONTINUE
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
              <p className="text-center text-[10px] text-on-surface-variant/60 font-medium">You can further edit these details in the next step.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
