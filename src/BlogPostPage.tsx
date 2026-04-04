import { motion } from 'motion/react';
import { ArrowLeft, Sun, Moon } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { allPosts, getPostBySlug } from './lib/posts';
import { PORTFOLIO_DATA } from './constants';
import { useDarkMode } from './hooks/useDarkMode';

export default function BlogPostPage() {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const { isDark, toggle } = useDarkMode();

  const post = getPostBySlug(slug ?? '');

  if (!post) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#111318] text-black dark:text-[#e3e4ed] flex flex-col items-center justify-center gap-6">
        <p className="text-sm font-bold uppercase tracking-widest text-gray-400 dark:text-[#6a6b7e]">Post not found</p>
        <button
          onClick={() => navigate('/blog')}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:-translate-x-0.5 transition-transform duration-200"
        >
          <ArrowLeft className="w-4 h-4" /> All Writing
        </button>
      </div>
    );
  }

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

      <main className="pt-32 pb-32">
        <div className="container mx-auto px-6 md:px-12 max-w-3xl">
          {/* Post header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mb-16"
          >
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-[#6a6b7e] mb-6">
              {post.date}
            </p>
            <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase leading-[1.05] mb-8">
              {post.title}
            </h1>
            <p className="text-base text-gray-500 dark:text-[#8a8b9a] leading-relaxed border-l-2 border-black dark:border-[#e3e4ed] pl-5">
              {post.summary}
            </p>
          </motion.div>

          {/* Divider */}
          <div className="border-t border-black dark:border-[#252630] mb-16" />

          {/* Post content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div
              className="prose-blog"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </motion.div>

          {/* Bottom nav */}
          <div className="border-t border-black dark:border-[#252630] mt-20 pt-10 flex justify-between items-center">
            <button
              onClick={() => navigate('/blog', { replace: true })}
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:-translate-x-0.5 transition-transform duration-200 text-gray-500 dark:text-[#8a8b9a] hover:text-black dark:hover:text-[#e3e4ed]"
            >
              <ArrowLeft className="w-3 h-3" /> All Writing
            </button>

            {/* Prev / Next navigation */}
            <div className="flex gap-6 text-xs font-bold uppercase tracking-widest">
              {(() => {
                const currentIdx = allPosts.findIndex(p => p.slug === slug);
                const prev = currentIdx > 0 ? allPosts[currentIdx - 1] : null;
                const next = currentIdx < allPosts.length - 1 ? allPosts[currentIdx + 1] : null;
                return (
                  <>
                    {prev && (
                      <button
                        onClick={() => navigate(`/blog/${prev.slug}`)}
                        className="text-gray-400 dark:text-[#6a6b7e] hover:text-black dark:hover:text-[#e3e4ed] transition-colors duration-200"
                      >
                        ← Prev
                      </button>
                    )}
                    {next && (
                      <button
                        onClick={() => navigate(`/blog/${next.slug}`)}
                        className="text-gray-400 dark:text-[#6a6b7e] hover:text-black dark:hover:text-[#e3e4ed] transition-colors duration-200"
                      >
                        Next →
                      </button>
                    )}
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
