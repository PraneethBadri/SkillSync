import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LandingPage() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const { user, openModal } = useAuth();

  // Force scroll to anchor tags on initial cross-page render
  useEffect(() => {
    if (window.location.hash) {
      setTimeout(() => {
        const element = document.querySelector(window.location.hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo(0, 0); // Explicitly scroll to top on standard navigation
    }
  }, []);

  const handleSearch = () => {
    if (!user) {
      openModal(true);
    } else {
      navigate('/dashboard', { state: { query: search } });
    }
  };
  return (
    <>
      {/* Hero Section */}
      <section id="search-jobs" className="relative px-8 py-20 lg:py-32 max-w-7xl mx-auto overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="z-10">
            <span className="inline-block px-4 py-1.5 mb-6 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-semibold text-xs tracking-widest uppercase font-label">
              AI-Powered Career Matching
            </span>
            <h1 className="text-5xl lg:text-7xl font-extrabold font-headline leading-[1.1] tracking-tight mb-8 text-on-surface">
              Your AI-Powered <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-tertiary">Career Partner</span>
            </h1>
            <p className="text-lg text-on-surface-variant max-w-lg mb-10 leading-relaxed">
              Skip the endless scrolling. SkillSync uses advanced neural matching to curate opportunities that perfectly align with your unique trajectory.
            </p>
            {/* Search Bar */}
            <div className="relative max-w-xl group">
              <div className="absolute inset-0 bg-primary/10 blur-2xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
              <div className="relative flex items-center bg-surface-container-lowest p-2 rounded-2xl editorial-shadow">
                <span className="material-symbols-outlined px-4 text-outline">search</span>
                <input 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full border-none focus:ring-0 bg-transparent text-on-surface placeholder:text-outline py-4 text-base" 
                  placeholder="Job title, skills, or company..." 
                  type="text"
                />
                <button onClick={handleSearch} className="bg-primary text-on-primary px-8 py-4 rounded-xl font-bold hover:bg-primary-container transition-all">Search</button>
              </div>
            </div>
            {/* Social Proof Logos */}
            <div className="mt-16">
              <p className="text-xs font-bold text-outline uppercase tracking-[0.2em] mb-6">Trusted by innovators at</p>
              <div className="flex flex-wrap gap-8 opacity-40 grayscale">
                <img alt="Stripe" className="h-6" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD8x_NZ6GC9nUGuDQkn3pDzqN_LgkrrOk3w88le7k9JHUgwyb1j5VizC0jZP5Pr60JFPyLRWbiqUYn8LgZps6uNyhe9FCkqcw6pLpXQtUseHluOyiiwWhz8mfALpE_TNlmkAYpWe6BlxatL5iDxvARkF820RfFD8sMol9SFHyGiY_wAYiq4rfuxgUWCnOq1AlsVK4DGEUO-j533IvRDr2xVTOQ_esfACP2vLh4jSNb96cgfeSBtNrmKCVFKcJWvLlQsh8lMjTsP8Qs"/>
                <img alt="Airbnb" className="h-6" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_Mbi5J2NueQ4cQzsvn0JQPw7Zo9yRHRjYFkTOisUGU3ENhzjI9KQFfxrskdV2o2HfFp3pzcfRNC04JIbyBSy-9U57DJzKsPa74bDfS4sI5Jk4dlBQMZoh81tezLYjsgiclQ7SJex0OsMMFEIUFlH-6pfkJkOnyOagVKwLJHP51NFStjjFJwQ16QfSkEicAOusjt6k6lrOiisZeBDCLTADQ-rtT92YPInbb3HiGffYDiUwSyxszdcFDa8PVPyFKS5Q_SCf91oKLQA"/>
                <img alt="Linear" className="h-6" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDsLO_C_RXjeFeAqTNjHFt0VUGwlswvVp5QzzvU12tusdPPCoHK7gN2mKuDFxhPep-uTwxIb0yvJm_sDXnfnwmyR2cIXgk2BkXYmWODlQw4xGjjenc8y2-q7kykDtR3kS9njKXxqFVKkIqu7K5Zr5FgcUalNgMPzhmwI_B4dHwfkfu-9A87ZvAyHvkMaloL2ZMTkycBIGYGLhn1zFnXKGf41KwtQ2l_SccvhVyfpC5q1RWVk4gd0xzXgwjbTtT0UQNAbqWlILjQVwM"/>
                <img alt="Loom" className="h-6" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAmHn3maKzAo7vANBIN_bt7dekbVak_Llb3kdxlfBr1fjQLFYXHg9LwZLaKEsCDPfkdHl-dOUF2a_ep7x2Js5gniTh5-9gDB-KRnpc6by4pA4YiBBmbzOQAdoUfMmxuo_i9Dw98XDONZvHQIaymAnQZCH8jLGfUXPoMNcViPTQcew5GcI-yMK72JUSTWicCEPKxfH6RlLJqv_AdvKBTdR2q6fIc-HGV_EleGPUcHi3ovHnRG31h3OD-VA7d5z58FqNXDzJO_re265s"/>
              </div>
            </div>
          </div>
          <div className="relative lg:h-[600px] flex items-center justify-center">
            {/* Asymmetrical Bento-style Mockup */}
            <div className="relative w-full aspect-square max-w-md">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-primary/5 to-tertiary/5 rounded-full blur-3xl"></div>
              {/* Floating Cards */}
              <div className="absolute top-0 right-0 w-64 p-6 bg-white/90 backdrop-blur-md rounded-2xl editorial-shadow border border-white/20 transform rotate-3 z-20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center">
                    <span className="material-symbols-outlined text-on-secondary-container">auto_awesome</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-on-surface">Match Quality</p>
                    <p className="text-[10px] text-on-surface-variant">Real-time analysis</p>
                  </div>
                </div>
                <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-secondary to-secondary-fixed w-[94%]"></div>
                </div>
                <p className="text-right mt-1 text-[10px] font-bold text-secondary">94% Expert Match</p>
              </div>
              <div className="absolute bottom-10 left-0 w-72 p-6 bg-surface-container-lowest rounded-2xl editorial-shadow transform -rotate-2 z-10">
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 p-2">
                      <img alt="Vercel" className="w-full h-full object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6SzAn4xGIFHmUTIWbH3HnlgXI1AmdwsuJGT7azvEcVcWzZIPbEKjOvloC5yV_UnlHHNPujUJwjMcD0tSfipuQkfirJNoMY5VXnatWhD6Q1lza_JEmhjx5fTfWmPJTJSnHrozMhMPfGbKCuxJ5_nxOetretkY97EvNfKudFmx85N34Pi22_cmChRVwQWDl5H0ptVxrMDyuXqlU5RdRciY8W3XB5zwwxvTo_ghwKySnxd7IhU1op7p5GEVIk2sRUMLfYFTt_bLVLzM"/>
                    </div>
                    <span className="px-2 py-1 bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-bold rounded uppercase">Active</span>
                  </div>
                  <div>
                    <h4 className="font-headline font-bold text-sm">Senior Product Designer</h4>
                    <p className="text-xs text-on-surface-variant">Remote • $160k - $210k</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="px-2 py-1 bg-surface-container rounded-md text-[10px] font-medium">Figma</span>
                    <span className="px-2 py-1 bg-surface-container rounded-md text-[10px] font-medium">React</span>
                  </div>
                </div>
              </div>
              {/* Main Hero Image */}
              <div className="w-full h-full rounded-[2.5rem] overflow-hidden editorial-shadow border-4 border-white">
                <img className="w-full h-full object-cover" alt="Modern professional woman" src="/hero-image.png"/>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="bg-surface-container-low py-32 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20 max-w-2xl">
            <h2 className="text-4xl font-extrabold font-headline tracking-tight mb-6">Curated Intelligence for Both Sides</h2>
            <p className="text-on-surface-variant text-lg">We've rebuilt the recruitment process from the ground up, replacing broad filters with semantic understanding.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="group relative bg-surface-container-lowest p-10 rounded-[2rem] overflow-hidden editorial-shadow transition-all hover:-translate-y-2">
              <div className="relative z-10 h-full flex flex-col">
                <div className="mb-8 w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-3xl">person_search</span>
                </div>
                <h3 className="text-3xl font-headline font-bold mb-4">For Talent</h3>
                <p className="text-on-surface-variant mb-8 leading-relaxed">
                  Our AI analyzes more than just your CV. It understands your professional trajectory, side projects, and soft skills to place you in roles where you'll thrive.
                </p>
                <ul className="space-y-4 mb-10">
                  <li className="flex items-center gap-3 text-sm font-medium">
                    <span className="material-symbols-outlined text-secondary" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span> Personalized Career Roadmaps
                  </li>
                  <li className="flex items-center gap-3 text-sm font-medium">
                     <span className="material-symbols-outlined text-secondary" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span> Invisible Job Opportunities
                  </li>
                  <li className="flex items-center gap-3 text-sm font-medium">
                     <span className="material-symbols-outlined text-secondary" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span> AI Salary Benchmarking
                  </li>
                </ul>
                <div className="mt-auto">
                  <button className="flex items-center gap-2 text-primary font-bold hover:gap-4 transition-all">Explore Job Board <span className="material-symbols-outlined">arrow_forward</span></button>
                </div>
              </div>
              <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors"></div>
            </div>
            
            <div id="recruiters" className="group relative bg-surface-container-lowest p-10 rounded-[2rem] overflow-hidden editorial-shadow transition-all hover:-translate-y-2">
              <div className="relative z-10 h-full flex flex-col">
                <div className="mb-8 w-16 h-16 rounded-2xl bg-tertiary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-tertiary text-3xl">groups</span>
                </div>
                <h3 className="text-3xl font-headline font-bold mb-4">For Companies</h3>
                <p className="text-on-surface-variant mb-8 leading-relaxed">
                  Stop sifting through noise. SkillSync’s curator engine pre-vets candidates using behavioral insights and skill-validation algorithms.
                </p>
                <ul className="space-y-4 mb-10">
                  <li className="flex items-center gap-3 text-sm font-medium">
                    <span className="material-symbols-outlined text-tertiary" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span> Automated Technical Screening
                  </li>
                  <li className="flex items-center gap-3 text-sm font-medium">
                     <span className="material-symbols-outlined text-tertiary" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span> Culture-Fit Prediction
                  </li>
                  <li className="flex items-center gap-3 text-sm font-medium">
                     <span className="material-symbols-outlined text-tertiary" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span> Diversity-First Shortlisting
                  </li>
                </ul>
                <div className="mt-auto">
                  <button className="flex items-center gap-2 text-tertiary font-bold hover:gap-4 transition-all">Hire with Intelligence <span className="material-symbols-outlined">arrow_forward</span></button>
                </div>
              </div>
              <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-tertiary/5 rounded-full blur-3xl group-hover:bg-tertiary/10 transition-colors"></div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-8 py-24 bg-surface max-w-7xl mx-auto">
        <div className="relative rounded-[3rem] bg-on-surface px-8 py-20 text-center overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)", backgroundSize: "32px 32px"}}></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-[160px] opacity-20 -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-tertiary rounded-full blur-[160px] opacity-20 translate-y-1/2 -translate-x-1/2"></div>
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-white text-4xl lg:text-5xl font-extrabold font-headline mb-6 tracking-tight">Ready to synchronize your future?</h2>
            <p className="text-white/60 text-lg mb-12">Join 50,000+ professionals finding their next big move with SkillSync AI.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link to="/resume-upload" className="w-full sm:w-auto px-10 py-5 bg-gradient-to-br from-primary to-primary-container text-white font-bold rounded-2xl hover:scale-105 active:scale-95 transition-all text-lg">Find Jobs</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
