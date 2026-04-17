export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-200/50 dark:border-slate-800/50 bg-slate-50 dark:bg-slate-950 mt-auto">
    <div className="flex flex-col md:flex-row justify-between items-center px-8 py-12 gap-6 max-w-7xl mx-auto">
    <div className="flex flex-col items-center md:items-start gap-2">
    <div className="text-lg font-bold text-slate-900 dark:text-white font-headline">SkillSync</div>
    <p className="text-slate-500 dark:text-slate-400 text-sm font-inter">© 2024 SkillSync AI. Curating the future of work.</p>
    </div>
    <div className="flex flex-wrap justify-center gap-8">
    <a className="text-slate-500 dark:text-slate-400 font-inter text-sm hover:text-blue-600 transition-colors" href="#">Privacy Policy</a>
    <a className="text-slate-500 dark:text-slate-400 font-inter text-sm hover:text-blue-600 transition-colors" href="#">Terms of Service</a>
    <a className="text-slate-500 dark:text-slate-400 font-inter text-sm hover:text-blue-600 transition-colors" href="#">Help Center</a>
    <a className="text-slate-500 dark:text-slate-400 font-inter text-sm hover:text-blue-600 transition-colors" href="#">API Docs</a>
    </div>
    <div className="flex gap-4">
    <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center hover:bg-surface-container-high transition-colors cursor-pointer">
    <span className="material-symbols-outlined text-slate-600" data-icon="language">language</span>
    </div>
    <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center hover:bg-surface-container-high transition-colors cursor-pointer">
    <span className="material-symbols-outlined text-slate-600" data-icon="share">share</span>
    </div>
    </div>
    </div>
    </footer>
  );
}
