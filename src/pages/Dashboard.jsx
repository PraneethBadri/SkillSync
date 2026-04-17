import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { extractSkillsFromDescription } from '../utils/skillExtractor';

export default function Dashboard() {
  const location = useLocation();
  const { appliedJobs, applyToJob, extractedSkills, userPreferences, interactedSkillsBank } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(location.state?.query || 'Remote Developer');

  const fetchLiveJobs = async (query) => {
    if (!query) return;
    setIsLoading(true);
    
    try {
      const url = `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(query)}&page=1&num_pages=1`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'x-rapidapi-key': import.meta.env.VITE_RAPIDAPI_KEY,
          'x-rapidapi-host': 'jsearch.p.rapidapi.com'
        }
      });
      
      const result = await response.json();
      
      if (result && result.data) {
        // Normalize schema into internal format
        const normalizedLiveJobs = result.data.slice(0, 15).map((apiJob, index) => {
           // Run local AI NLP Regex to identify required skills on the fly
           const dynamicSkills = extractSkillsFromDescription(apiJob.job_description);
           
           return {
              id: apiJob.job_id || index,
              title: apiJob.job_title || "Unknown Role",
              company: apiJob.employer_name || "Confidential",
              location: `${apiJob.job_city || ''} ${apiJob.job_state || ''}`.trim() || (apiJob.job_is_remote ? 'Remote' : 'Location Not Specified'),
              type: apiJob.job_is_remote ? "Remote" : "On-site",
              salary: apiJob.job_min_salary ? `$${apiJob.job_min_salary} - $${apiJob.job_max_salary}` : 'Competitive',
              description: apiJob.job_description || "No description provided.",
              logo: apiJob.employer_logo || "https://ui-avatars.com/api/?name=" + encodeURIComponent(apiJob.employer_name || 'U'),
              skillsRequired: dynamicSkills
           };
        });
        setJobs(normalizedLiveJobs);
      }
    } catch (err) {
      console.error("RapidAPI Fetch failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Robust debouncing to prevent throttling RapidAPI limits
    const delayDebounceFn = setTimeout(() => {
      fetchLiveJobs(searchQuery);
    }, 1500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // V2 Machine Learning Engine: NLP Intersections + Behavioral Graph + Constraints
  const calculatedJobs = jobs.map(job => {
    let baseScore = 15;
    
    // 1. Core NLP Skills Alignment (Weight: ~60%)
    if (extractedSkills && extractedSkills.length > 0 && job.skillsRequired && job.skillsRequired.length > 0) {
      let intersection = 0;
      const userSkillsSet = new Set(extractedSkills.map(s => s.toLowerCase()));
      job.skillsRequired.forEach(skill => {
        if (userSkillsSet.has(skill.toLowerCase())) intersection++;
      });
      baseScore = Math.round((intersection / job.skillsRequired.length) * 100);
      if (baseScore < 15) baseScore = 15; // floor
    } else if (extractedSkills && extractedSkills.length > 0) {
      baseScore = 45; // baseline soft match
    }

    // 2. Behavioral Interaction Graph (Weight: ~20% Boost)
    // AI learns from what roles the user "Quick Applies" to
    let interactionBoost = 0;
    if (interactedSkillsBank && interactedSkillsBank.length > 0 && job.skillsRequired) {
      const interactionSet = new Set(interactedSkillsBank.map(s => s.toLowerCase()));
      let interactionHits = 0;
      job.skillsRequired.forEach(skill => {
         if (interactionSet.has(skill.toLowerCase())) interactionHits++;
      });
      // Exponentially reward roles having the skills the user keeps applying for
      interactionBoost = Math.min((interactionHits / Math.max(job.skillsRequired.length, 1)) * 25, 25);
    }

    // 3. User Calibration Constraints (Weight: ~20% Variance)
    let preferenceVariance = 0;
    const prefEnv = userPreferences?.environment || 'Remote';
    const prefExp = userPreferences?.experience?.toLowerCase() || 'mid-level';
    
    // Environment logic
    const isJobRemote = job.type.toLowerCase().includes('remote');
    if (prefEnv === 'Remote' && isJobRemote) preferenceVariance += 10;
    if (prefEnv === 'Remote' && !isJobRemote) preferenceVariance -= 15;
    if (prefEnv === 'On-site' && !isJobRemote) preferenceVariance += 10;

    // Experience hierarchy logic
    const title = job.title.toLowerCase();
    if (prefExp.includes('junior')) {
       if (title.includes('senior') || title.includes('lead') || title.includes('staff')) preferenceVariance -= 25;
       if (title.includes('junior') || title.includes('associate')) preferenceVariance += 15;
    } else if (prefExp.includes('senior') || prefExp.includes('lead')) {
       if (title.includes('junior')) preferenceVariance -= 20;
       if (title.includes('senior') || title.includes('lead') || title.includes('staff')) preferenceVariance += 15;
    }

    // Aggregate Neural Math
    let finalScore = Math.round(baseScore + interactionBoost + preferenceVariance);
    if (finalScore > 99) finalScore = 99; // 99% cap for realism
    if (finalScore < 5) finalScore = 5;

    return { ...job, calculatedScore: finalScore, debugScores: { baseScore, interactionBoost, preferenceVariance } };
  });

  const topMatches = [...calculatedJobs].sort((a, b) => b.calculatedScore - a.calculatedScore).slice(0, 2);
  const targetJob = topMatches[0] || jobs[0];
  
  const missingSkills = (targetJob?.skillsRequired || []).filter(
    skill => !(extractedSkills || []).some(s => s.toLowerCase() === skill.toLowerCase())
  );
  const matchedSkills = (targetJob?.skillsRequired || []).filter(
    skill => (extractedSkills || []).some(s => s.toLowerCase() === skill.toLowerCase())
  );
  
  const handleExplorePathway = () => {
    let nextRole = "Senior Developer";
    const prefExp = (userPreferences?.experience || "mid").toLowerCase();
    if (prefExp.includes("junior")) nextRole = "Mid-Level Developer";
    else if (prefExp.includes("mid")) nextRole = "Senior Developer";
    else if (prefExp.includes("senior")) nextRole = "Lead Engineer";
    else if (prefExp.includes("lead")) nextRole = "Director of Engineering";
    
    setSearchQuery(nextRole);
    fetchLiveJobs(nextRole);
    window.scrollTo({ top: document.body.scrollHeight / 2, behavior: 'smooth' });
  };

  const profileStrength = Math.min(Math.round(((extractedSkills?.length || 0) / 4) * 100), 100) || 5;

  return (
    <main className="pb-12 max-w-7xl mx-auto px-6">
      {/* Hero: Top AI Matches */}
      <section className="mb-12">
        <div className="flex items-end justify-between mb-8">
          <div className="max-w-2xl">
            <span className="text-tertiary font-bold tracking-[0.2em] text-xs uppercase mb-2 block">Curation Engine</span>
            <h1 className="text-4xl md:text-5xl font-black font-headline text-on-surface tracking-tight leading-none">Your Top AI Matches</h1>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {isLoading ? (
             Array(2).fill(0).map((_, i) => (
                <div key={i} className="rounded-xl bg-surface-container-lowest p-8 flex flex-col justify-between border-none animate-pulse h-[250px]">
                   <div className="h-12 w-12 bg-surface-container-highest rounded-lg mb-6"></div>
                   <div className="h-6 w-3/4 bg-surface-container-highest rounded mb-2"></div>
                   <div className="h-4 w-1/2 bg-surface-container-highest rounded mb-4"></div>
                   <div className="h-12 w-full bg-surface-container-high rounded-lg mt-auto"></div>
                </div>
             ))
          ) : (
            topMatches.map((job) => {
               const dashOffset = 175.9 - (175.9 * job.calculatedScore / 100);
               return (
                <div key={job.id} className="group relative overflow-hidden rounded-xl bg-surface-container-lowest p-8 flex flex-col justify-between transition-all hover:shadow-2xl hover:shadow-on-surface/5 border-none">
                  <div className="absolute top-0 right-0 p-6">
                    <div className="relative w-16 h-16 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle className="text-surface-container-high" cx="32" cy="32" fill="transparent" r="28" stroke="currentColor" strokeWidth="4"></circle>
                        <circle className="text-secondary transition-all duration-1000" cx="32" cy="32" fill="transparent" r="28" stroke="currentColor" strokeDasharray="175.9" strokeDashoffset={dashOffset} strokeWidth="4"></circle>
                      </svg>
                      <span className="absolute text-sm font-black font-headline">{job.calculatedScore}%</span>
                    </div>
                  </div>
                  <div>
                    <div className="w-12 h-12 rounded-lg bg-surface-container mb-6 flex items-center justify-center overflow-hidden p-2">
                      <img className="w-full h-full object-contain mix-blend-multiply" alt="company logo" src={job.logo}/>
                    </div>
                    <h3 className="text-xl font-bold font-headline mb-1 leading-tight">{job.title}</h3>
                    <p className="text-on-surface-variant text-sm mb-4">{job.company} • {job.location}</p>
                  </div>
                  <Link to={`/job/${job.id}`} state={{ jobData: job }} className="block text-center w-full py-3 bg-surface-container-low hover:bg-primary-fixed text-on-surface font-semibold rounded-lg transition-colors border border-primary/20 hover:text-primary">
                    View Deep Analysis
                  </Link>
                </div>
               )
            })
          )}
          
          {/* Match Card 3 - Pathway Spotlight */}
          <div className="group relative overflow-hidden rounded-xl bg-tertiary-container p-8 flex flex-col justify-between transition-all border-none">
            <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-on-tertiary-container" style={{fontVariationSettings: "'FILL' 1"}}>auto_awesome</span>
                <span className="text-on-tertiary-container font-bold text-xs uppercase tracking-widest">AI Spotlight</span>
              </div>
              <h3 className="text-2xl font-black font-headline text-white mb-2">Unlock Career Trajectory Insights</h3>
              <p className="text-on-tertiary-container text-sm leading-relaxed mb-6">Our AI predicts you are ready for the next level: <strong className="text-white">{(userPreferences?.experience || 'Mid-Level')} to Advanced</strong> based on {extractedSkills?.length || 0} indexed skills. Start exploring now.</p>
              <button onClick={handleExplorePathway} className="px-6 py-3 bg-white text-tertiary font-bold rounded-lg hover:bg-surface-bright transition-colors active:scale-95 shadow-lg">Explore Pathway</button>
            </div>
          </div>
        </div>
      </section>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Filter & Feed (Main Content) */}
        <div className="flex-1 space-y-6">
          <div>
             <h2 className="text-2xl font-headline font-extrabold text-on-surface tracking-tight">Active Opportunities</h2>
             <p className="text-on-surface-variant text-sm mt-1">Search the live database to sync your skills with matching roles.</p>
          </div>
          <div className="glass-panel p-4 rounded-xl flex flex-wrap gap-4 items-center border border-outline-variant/30 relative z-20 shadow-md">
            <div className="flex-1 min-w-[200px] relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline">work</span>
              <input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => { if(e.key === 'Enter') fetchLiveJobs(searchQuery); }}
                className="w-full bg-surface-container-highest border-none rounded-lg pl-12 pr-4 py-3 focus:ring-2 focus:ring-primary/40 text-sm font-semibold" 
                placeholder="Search Live Jobs (e.g. React Developer)" 
                type="text"
              />
              {isLoading && (
                 <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined animate-spin text-primary">sync</span>
              )}
            </div>
            
            <div className="flex gap-3 w-full sm:w-auto mt-4 sm:mt-0 items-center shrink-0">
               <select className="bg-surface-container-highest border-none rounded-lg pr-10 pl-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary/40 min-w-[130px] shrink-0">
                 <option>Live DB</option>
                 <option>Remote DB</option>
               </select>
               <button onClick={() => fetchLiveJobs(searchQuery)} className="bg-primary hover:bg-primary-container text-on-primary hover:text-primary px-8 py-3 rounded-lg font-bold text-sm tracking-wide transition-colors whitespace-nowrap shadow-md shadow-primary/20">
                  Search
               </button>
            </div>
          </div>

          <div className="space-y-6">
            {isLoading ? (
               <p className="text-center text-on-surface-variant py-8 font-bold animate-pulse">Contacting Live Job Exchange API...</p>
            ) : calculatedJobs.length === 0 ? (
              <p className="text-center text-on-surface-variant py-8 font-bold text-lg">No internet roles found matching your query.</p>
            ) : (
              calculatedJobs.map(job => (
                <div key={job.id} className="bg-surface-container-lowest p-6 rounded-xl transition-all hover:translate-y-[-2px] border border-transparent hover:border-primary/20 shadow-sm hover:shadow-xl relative overflow-hidden group">
                  <Link to={`/job/${job.id}`} state={{ jobData: job }} className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-outline hover:text-primary z-10">
                     <span className="material-symbols-outlined">open_in_new</span>
                  </Link>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div className="flex gap-4">
                      <div className="w-16 h-16 bg-surface-container rounded-lg flex-shrink-0 flex items-center justify-center p-2 shadow-sm">
                        <img className="w-full h-full object-contain mix-blend-multiply" alt="company logo" src={job.logo} onError={(e) => e.target.src="https://via.placeholder.com/64?text=LOGO"}/>
                      </div>
                      <div>
                        <div className="flex gap-4 flex-wrap items-center">
                          <h4 className="text-xl font-bold font-headline leading-tight max-w-[400px] truncate">{job.title}</h4>
                          <span className="text-xs font-black bg-primary/10 text-primary px-3 py-1.5 rounded-md flex items-center gap-1">
                              <span className="material-symbols-outlined text-[14px]">bolt</span>
                              {job.calculatedScore}% NLP Match
                          </span>
                        </div>
                        <p className="text-on-surface-variant text-sm mt-1 mb-2 font-medium">{job.company} • {job.location}</p>
                        <div className="flex flex-wrap gap-2">
                           {job.skillsRequired?.slice(0, 4).map(skill => (
                              <span key={skill} className={`px-2 py-0.5 ${extractedSkills?.some(s => s.toLowerCase() === skill.toLowerCase()) ? 'bg-secondary-container text-on-secondary-container font-extrabold shadow-sm' : 'bg-surface-container text-on-surface-variant'} text-[10px] font-bold rounded uppercase tracking-widest`}>{skill}</span>
                           ))}
                           {(!job.skillsRequired || job.skillsRequired.length === 0) && (
                              <span className="px-2 py-0.5 bg-surface-container text-on-surface-variant text-[10px] font-bold rounded uppercase">No Specific Technologies Required</span>
                           )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-on-surface-variant text-sm leading-relaxed mb-6 line-clamp-3 mt-4 border-l-2 border-primary/20 pl-4 py-1 italic">
                    {job.description}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-surface-container-low">
                    <span className="text-lg font-black font-headline text-on-surface">{job.salary}</span>
                     <div className="flex gap-2">
                       {appliedJobs.includes(job.id) ? (
                         <span className="px-6 py-2 bg-surface-container-highest text-primary font-bold rounded-lg flex items-center gap-2 pointer-events-none">
                           <span className="material-symbols-outlined text-sm">check_circle</span> Application Tracked
                         </span>
                       ) : (
                         <button onClick={() => applyToJob(job)} className="px-8 py-2.5 bg-primary text-on-primary font-bold rounded-lg hover:shadow-lg hover:shadow-primary/30 transition-shadow bg-gradient-to-r hover:from-primary hover:to-primary-container">Quick Apply via AI</button>
                       )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Side Panel: Skill Gap Analysis */}
        <aside className="w-full lg:w-[340px] space-y-6 shrink-0 sticky top-24">
          <div className="bg-surface-container-highest p-6 rounded-xl border border-surface-container-highest shadow-inner">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-black font-headline tracking-tight uppercase">Gap Analysis</h2>
              <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-lg">insights</span>
            </div>
            
            {isLoading ? (
               <div className="py-10 flex flex-col items-center justify-center">
                  <span className="material-symbols-outlined text-4xl text-outline animate-spin mb-4">refresh</span>
                  <p className="text-xs text-on-surface-variant uppercase tracking-widest font-bold">Scanning Web Graph</p>
               </div>
            ) : !targetJob ? (
               <p className="text-sm text-on-surface-variant">No target job selected.</p>
            ) : (
               <>
                 <div className="mb-6 p-4 bg-surface-container-lowest rounded-lg border border-outline-variant/20 shadow-sm">
                    <p className="text-[10px] text-outline uppercase tracking-widest font-bold mb-1">Calibrating Against #1 Match</p>
                    <p className="text-sm font-black font-headline text-on-surface leading-tight">{targetJob.company}</p>
                    <p className="text-xs font-semibold text-primary">{targetJob.title}</p>
                 </div>
                 
                 <div className="space-y-4">
                  {matchedSkills.length === 0 && missingSkills.length === 0 && (
                     <div className="p-4 bg-tertiary-container/20 rounded-lg text-center border border-tertiary-container border-dashed">
                        <span className="material-symbols-outlined text-tertiary text-2xl mb-2">find_in_page</span>
                        <p className="text-xs font-bold text-on-surface">No technical keywords mapped in this description.</p>
                     </div>
                  )}

                  {matchedSkills.map(skill => (
                    <div key={skill} className="bg-surface-container-lowest p-3 rounded-lg border-l-4 border-secondary shadow-sm">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-sm font-black text-on-surface">{skill}</span>
                        <span className="text-[10px] font-bold text-secondary flex items-center gap-1 uppercase tracking-widest"><span className="material-symbols-outlined text-[14px]">check_circle</span> Verified</span>
                      </div>
                      <div className="h-1 w-full bg-surface-container-high rounded-full overflow-hidden">
                        <div className="h-full bg-secondary w-full"></div>
                      </div>
                    </div>
                  ))}
                  
                  {missingSkills.map(skill => (
                    <div key={skill} className="bg-surface-container-lowest p-3 rounded-lg border border-error/20 flex flex-col justify-center relative overflow-hidden bg-gradient-to-r from-error/5 to-transparent">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-sm font-black text-on-surface">{skill}</span>
                        <span className="text-[10px] font-bold text-error uppercase tracking-widest">Deficit</span>
                      </div>
                      <div className="h-1 w-full bg-surface-container-high rounded-full overflow-hidden">
                        <div className="h-full bg-error w-[15%]"></div>
                      </div>
                    </div>
                  ))}
                 </div>
               </>
            )}
          </div>
          
          {/* Profile Strength Widget */}
          <div className="bg-gradient-to-br from-primary to-primary-container p-6 rounded-xl text-on-primary shadow-2xl shadow-primary/30 relative overflow-hidden group">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
            <h3 className="text-lg font-black font-headline mb-1 relative z-10">Neural Profile Strength</h3>
            <p className="text-sm text-primary-fixed-dim/90 mb-6 font-medium relative z-10">Your resume yielded {extractedSkills?.length || 0} recognized NLP vectors.</p>
            <div className="flex gap-2 relative z-10">
              <div className="h-2 w-full bg-black/20 rounded-full overflow-hidden shadow-inner">
                <div className={`h-full bg-white transition-all duration-1000 ease-out`} style={{width: `${profileStrength}%`}}></div>
              </div>
            </div>
            <p className="text-right mt-2 text-sm font-black text-white tracking-widest relative z-10">{profileStrength}% Evaluated</p>
            <Link to="/resume-upload" className="block text-center mt-6 w-full py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-xs font-black uppercase tracking-widest transition-all relative z-10 hover:shadow-lg">Re-Upload Core Matrix</Link>
          </div>
        </aside>
      </div>
    </main>
  );
}
