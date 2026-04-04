import { motion } from 'motion/react';
import { ArrowUpRight, ArrowLeft, Sun, Moon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PORTFOLIO_DATA } from './constants';
import { useDarkMode } from './hooks/useDarkMode';

export default function AllBlogsPage() {
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
              Blog
            </h1>
            <p className="text-sm text-gray-500 dark:text-[#8a8b9a] uppercase tracking-widest font-bold">
              {PORTFOLIO_DATA.blog.length} {PORTFOLIO_DATA.blog.length === 1 ? 'post' : 'posts'}
            </p>
          </motion.div>

          <div className="max-w-4xl">
            {PORTFOLIO_DATA.blog.map((post, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => navigate(`/blog/${post.slug}`)}
                className="group flex flex-col md:flex-row md:items-start justify-between py-10 border-b border-black dark:border-[#252630] hover:bg-black dark:hover:bg-[#e3e4ed] hover:text-white dark:hover:text-[#111318] transition-all duration-300 px-0 hover:px-6 -mx-0 hover:-mx-6 cursor-pointer"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-[#6a6b7e] group-hover:text-gray-300 dark:group-hover:text-[#4a4b5c]">
                      {post.date}
                    </span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold uppercase tracking-tight mb-3">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-[#8a8b9a] group-hover:text-gray-300 dark:group-hover:text-[#4a4b5c] leading-relaxed max-w-2xl">
                    {post.summary}
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-4 md:mt-1 shrink-0 md:ml-12">
                  <span className="text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                    Read
                  </span>
                  <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
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
          onClick={() => navigate(-1)}
          className="relative overflow-hidden inline-block group text-xs font-bold uppercase tracking-widest"
        >
          <span className="flex items-center gap-2 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full">
            <ArrowLeft className="w-3 h-3" /> Home
          </span>
          <span
            aria-hidden
            className="absolute inset-x-0 top-full flex items-center gap-2 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full"
          >
            <ArrowLeft className="w-3 h-3" /> Home
          </span>
        </button>
      </footer>
    </div>
  );
}
