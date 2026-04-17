import { Link, useParams, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { initialJobs } from '../data/mockData';

export default function JobDetails() {
  const { id } = useParams();
  const location = useLocation();
  const { appliedJobs, applyToJob } = useAuth();
  
  // Decoupled Router injection: Use Live RapidAPI data if available via Link state, fall back to DB.
  const job = location.state?.jobData || initialJobs.find(j => String(j.id) === String(id)) || initialJobs[0];
  const isApplied = appliedJobs.includes(job.id);
  return (
    <main className="pb-20 max-w-7xl mx-auto px-6 md:px-8">
      {/* Job Hero Section */}
      <div className="relative overflow-hidden rounded-xl mb-8">
        <div className="bg-surface-container-lowest p-8 md:p-12 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-xl bg-surface-container flex items-center justify-center overflow-hidden">
                <img className="w-full h-full object-cover" alt="company logo" src={job.logo || "/hero-image.png"} onError={(e) => e.target.src="/hero-image.png"}/>
              </div>
              <div>
                <p className="text-secondary font-bold font-label uppercase tracking-widest text-xs mb-1">Full-Time · Remote</p>
                <h1 className="text-4xl md:text-5xl font-black font-headline tracking-tight leading-tight mb-4">{job.title}</h1>
                <p className="text-xl text-on-surface-variant font-medium">{job.company} • {job.location} • {job.type}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-3 rounded-xl bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest transition-colors">
                <span className="material-symbols-outlined">bookmark</span>
              </button>
              {isApplied ? (
                <button className="px-8 py-4 bg-surface-container-highest text-primary font-bold rounded-xl flex items-center gap-2 pointer-events-none">
                  <span className="material-symbols-outlined text-sm">check_circle</span> Applied
                </button>
              ) : (
                <button onClick={() => applyToJob(job)} className="bg-primary text-on-primary px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-primary/20 hover:scale-[0.98] transition-transform flex items-center gap-2">
                  Apply Now
                </button>
              )}
            </div>
          </div>
        </div>
        {/* Subtle gradient background element */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary-fixed/20 to-transparent pointer-events-none"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: AI Matching & Description */}
        <div className="lg:col-span-2 space-y-8">
          {/* AI Insight Card */}
          <section className="bg-tertiary-container/10 border-l-4 border-tertiary rounded-xl p-8 relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-tertiary" style={{fontVariationSettings: "'FILL' 1"}}>auto_awesome</span>
                <h2 className="text-xl font-bold font-headline text-tertiary">Why SkillSync Thinks You're a Great Fit</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle className="text-tertiary/20" cx="32" cy="32" fill="transparent" r="28" stroke="currentColor" strokeWidth="4"></circle>
                        <circle className="text-tertiary" cx="32" cy="32" fill="transparent" r="28" stroke="currentColor" strokeDasharray="176" strokeDashoffset="14" strokeWidth="4"></circle>
                      </svg>
                      <span className="absolute font-bold text-sm">92%</span>
                    </div>
                    <div>
                      <p className="font-bold text-on-surface">Skill Alignment</p>
                      <p className="text-sm text-on-surface-variant">Your expertise in Figma matches 9/10 core requirements.</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="text-xs font-bold font-label uppercase tracking-widest text-on-surface-variant">Strongest Skills Matched</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-secondary-fixed text-on-secondary-fixed-variant rounded-full text-xs font-semibold">Prototyping</span>
                    <span className="px-3 py-1 bg-secondary-fixed text-on-secondary-fixed-variant rounded-full text-xs font-semibold">React.js</span>
                    <span className="px-3 py-1 bg-secondary-fixed text-on-secondary-fixed-variant rounded-full text-xs font-semibold">Visual Design</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Job Description Content */}
          <article className="bg-surface-container-lowest rounded-xl p-8 md:p-12 space-y-10">
            <section>
              <h2 className="text-2xl font-black font-headline mb-4 tracking-tight">The Role</h2>
              <p className="text-on-surface-variant text-lg leading-relaxed mb-6">
                {job.description}
              </p>
            </section>
            
            <section>
              <h3 className="text-2xl font-bold font-headline mb-6">Key Responsibilities</h3>
              <ul className="space-y-4 list-none">
                <li className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-primary mt-1">check_circle</span>
                  <p className="text-on-surface-variant leading-relaxed">Lead the end-to-end design process.</p>
                </li>
                <li className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-primary mt-1">check_circle</span>
                  <p className="text-on-surface-variant leading-relaxed">Partner with engineering to build Spark.</p>
                </li>
              </ul>
            </section>
            
          </article>
        </div>
        
        {/* Right Column: Metadata & Sidebar */}
        <div className="space-y-8">
          <div className="bg-surface-container-highest rounded-xl p-8 sticky top-28">
            <h4 className="text-lg font-bold font-headline mb-6">Apply for this position</h4>
            <div className="space-y-6">
              <div className="p-4 bg-surface-container-lowest rounded-lg">
                <p className="text-xs font-bold font-label uppercase tracking-widest text-on-surface-variant mb-2">Active Profile</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-fixed-dim"></div>
                  <div>
                    <h4 className="font-bold font-headline mb-1">Base Range</h4>
                    <p className="text-xl text-secondary font-black">{job.salary}</p>
                  </div>
                </div>
              </div>
              {isApplied ? (
                <button className="block text-center w-full bg-surface-container-highest text-primary py-4 rounded-xl font-bold flex items-center justify-center gap-2 pointer-events-none">
                  <span className="material-symbols-outlined text-sm">check_circle</span> Applied Successfully
                </button>
              ) : (
                <button onClick={() => applyToJob(job)} className="block text-center w-full bg-primary text-on-primary py-4 rounded-xl font-bold hover:shadow-xl transition-all shadow-primary/20">
                  Quick Apply with SkillSync
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
