import { motion } from 'motion/react';
import { ArrowUpRight, ArrowLeft, Sun, Moon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PORTFOLIO_DATA } from './constants';
import { useDarkMode } from './hooks/useDarkMode';

export default function AllProjectsPage() {
  const navigate = useNavigate();
  const { isDark, toggle } = useDarkMode();

  return (
    <div className="min-h-screen bg-white dark:bg-[#111318] text-black dark:text-[#e3e4ed]">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 border-b border-black dark:border-[#252630] bg-white/90 dark:bg-[#111318]/90 backdrop-blur-sm py-5 px-6 md:px-12 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:-translate-x-0.5 transition-transform duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <span className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-[#6a6b7e]">
          {PORTFOLIO_DATA.name}
        </span>
        <button
          onClick={toggle}
          aria-label="Toggle dark mode"
          className="p-1 transition-transform duration-200 hover:-translate-y-0.5"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </header>

      <main className="pt-24 pb-24">
        <div className="container mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mb-24"
          >
            <h1 className="text-5xl md:text-[9vw] font-black tracking-tighter uppercase leading-[0.9] mb-6">
              All<br />
              <span className="text-gray-300 dark:text-[#2d2e3e]">Projects</span>
            </h1>
            <p className="text-sm text-gray-500 dark:text-[#8a8b9a] uppercase tracking-widest font-bold">
              {PORTFOLIO_DATA.projects.length} projects
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
            {PORTFOLIO_DATA.projects.map((project, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="group cursor-pointer"
              >
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="aspect-[16/10] bg-gray-50 dark:bg-[#191a22] border border-black dark:border-[#252630] mb-6 overflow-hidden relative">
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={project.title}
                        className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700"
                      />
                    ) : null}
                    <div className="absolute top-5 left-5 text-4xl font-black opacity-20 z-10 text-white mix-blend-overlay select-none">
                      {String(idx + 1).padStart(2, '0')}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                      <div className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] border-b border-white pb-1 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        View Project <ArrowUpRight className="w-3 h-3" />
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  <h3 className="text-xl font-bold uppercase tracking-tight mb-2 group-hover:translate-x-1 transition-transform duration-300">
                    {project.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-[#8a8b9a] mb-4 leading-relaxed">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-3 py-1 border border-gray-200 dark:border-[#252630] text-[10px] font-bold uppercase tracking-widest"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <footer className="py-10 px-6 md:px-12 border-t border-black dark:border-[#252630] flex justify-between items-center">
        <div className="text-xs font-bold uppercase tracking-widest">
          © {new Date().getFullYear()} {PORTFOLIO_DATA.name}
        </div>
        <button
          onClick={() => navigate('/')}
          className="text-xs font-bold uppercase tracking-widest hover:line-through"
        >
          Home
        </button>
      </footer>
    </div>
  );
}
