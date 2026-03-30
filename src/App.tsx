import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useSpring } from "motion/react";
import { Github, Linkedin, Mail, ArrowUpRight, ChevronDown, Sun, Moon } from "lucide-react";
import { PORTFOLIO_DATA } from './constants';
import { useDarkMode } from './hooks/useDarkMode';
import AllProjectsPage from './AllProjectsPage';

// Navbar — transparent with mix-blend-difference on hero, switches to frosted glass on scroll
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 72);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.nav
      animate={scrolled ? 'scrolled' : 'top'}
      variants={{
        top: { backgroundColor: 'transparent', borderBottomColor: 'transparent' },
        scrolled: {},
      }}
      className={`fixed top-0 left-0 w-full z-50 py-5 px-6 md:px-12 flex justify-end items-center transition-colors duration-300 ${
        scrolled
          ? 'bg-white/80 dark:bg-[#111318]/85 backdrop-blur-md border-b border-black/[0.08] dark:border-white/[0.06] text-black dark:text-[#e3e4ed]'
          : 'mix-blend-difference text-white'
      }`}
    >
      <div className="flex items-center gap-8 text-xs font-bold uppercase tracking-widest">
        {[
          { label: 'About', href: '#about' },
          { label: 'Experience', href: '#experience' },
          { label: 'Projects', href: '#projects' },
          { label: 'Blog', href: '#blog' },
          { label: 'Resume', href: 'https://drive.google.com/file/d/1z7kFpLoIGI0LxqNhGw5Qvnqi1ofAOFc4/view?usp=sharing', external: true },
        ].map(({ label, href, external }) => (
          <a
            key={label}
            href={href}
            target={external ? '_blank' : undefined}
            rel={external ? 'noopener noreferrer' : undefined}
            className={`relative py-1 transition-transform duration-200 hover:-translate-y-0.5
              after:absolute after:bottom-0 after:left-0 after:h-px after:w-full
              after:origin-left after:scale-x-0 after:transition-transform after:duration-300
              hover:after:scale-x-100
              ${scrolled ? 'after:bg-black dark:after:bg-[#e3e4ed]' : 'after:bg-white'}
              ${label === 'Resume' ? (scrolled ? 'border border-current px-3' : 'border border-white px-3') : ''}
            `}
          >
            {label}
          </a>
        ))}
      </div>
    </motion.nav>
  );
};

// Floating dark-mode toggle — bottom-right, animated icon swap
const FloatingThemeToggle = ({
  isDark,
  onToggle,
}: {
  isDark: boolean;
  onToggle: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) => (
  <motion.button
    onClick={onToggle}
    aria-label="Toggle dark mode"
    whileHover={{ scale: 1.12 }}
    whileTap={{ scale: 0.92 }}
    className="fixed bottom-8 right-8 z-50 w-13 h-13 rounded-full
      bg-black dark:bg-[#e3e4ed] text-white dark:text-[#111318]
      flex items-center justify-center
      shadow-[0_4px_24px_rgba(0,0,0,0.18)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.4)]
      hover:shadow-[0_6px_32px_rgba(0,0,0,0.28)] dark:hover:shadow-[0_6px_32px_rgba(0,0,0,0.6)]
      transition-shadow duration-300 p-3"
  >
    <AnimatePresence mode="wait" initial={false}>
      <motion.span
        key={isDark ? 'sun' : 'moon'}
        initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
        transition={{ duration: 0.22, ease: 'easeInOut' }}
        className="flex items-center justify-center"
      >
        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </motion.span>
    </AnimatePresence>
  </motion.button>
);

const Hero = () => (
  <section className="min-h-screen flex flex-col justify-center px-6 md:px-12 relative overflow-hidden">
    <div className="max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400 dark:text-[#6a6b7e] mb-6 block">
          {PORTFOLIO_DATA.role}
        </span>
        <h1 className="text-6xl md:text-[10vw] font-black leading-[0.9] tracking-tighter uppercase mb-8">
          {PORTFOLIO_DATA.name.split(' ')[0]}<br />
          <span className="text-gray-300 dark:text-[#2d2e3e]">{PORTFOLIO_DATA.name.split(' ')[1]}</span>
        </h1>
        <p className="text-xl md:text-3xl max-w-2xl text-gray-600 dark:text-[#8a8b9a] font-light leading-relaxed mb-12 text-balance">
          {PORTFOLIO_DATA.bio}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex gap-6"
      >
        <a href={PORTFOLIO_DATA.github} target="_blank" className="p-3 border border-black dark:border-[#252630] hover:bg-black hover:text-white dark:hover:bg-[#e3e4ed] dark:hover:text-[#111318] transition-all">
          <Github className="w-6 h-6" />
        </a>
        <a href={PORTFOLIO_DATA.linkedin} target="_blank" className="p-3 border border-black dark:border-[#252630] hover:bg-black hover:text-white dark:hover:bg-[#e3e4ed] dark:hover:text-[#111318] transition-all">
          <Linkedin className="w-6 h-6" />
        </a>
        <a href={`mailto:${PORTFOLIO_DATA.email}`} className="p-3 border border-black dark:border-[#252630] hover:bg-black hover:text-white dark:hover:bg-[#e3e4ed] dark:hover:text-[#111318] transition-all">
          <Mail className="w-6 h-6" />
        </a>
      </motion.div>
    </div>

    <motion.div
      animate={{ y: [0, 10, 0] }}
      transition={{ repeat: Infinity, duration: 2 }}
      className="absolute bottom-12 left-1/2 -translate-x-1/2 hidden md:block"
    >
      <ChevronDown className="w-6 h-6 text-gray-300 dark:text-[#2d2e3e]" />
    </motion.div>
  </section>
);

const About = () => (
  <section id="about" className="whitespace-massive border-t border-black dark:border-[#252630] bg-white dark:bg-[#111318]">
    <div className="container mx-auto px-6">
      <div className="max-w-5xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-8xl font-black tracking-tighter uppercase mb-24"
        >
          {PORTFOLIO_DATA.about.headline}
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <div className="space-y-6">
            {PORTFOLIO_DATA.about.paragraphs.map((p, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-lg text-gray-600 dark:text-[#8a8b9a] leading-relaxed font-light"
              >
                {p}
              </motion.p>
            ))}
          </div>

          <div className="space-y-0">
            {PORTFOLIO_DATA.about.facts.map((fact, idx) => (
              <motion.div
                key={fact.label}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="border-b border-black dark:border-[#252630] py-5 first:pt-0"
              >
                <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 dark:text-[#6a6b7e] mb-1">{fact.label}</div>
                <div className="text-lg font-semibold tracking-tight">{fact.value}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

const Projects = () => {
  const navigate = useNavigate();

  return (
    <section id="projects" className="whitespace-massive border-t border-black dark:border-[#252630]">
      {/* Section header — container-aligned */}
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <h2 className="text-4xl md:text-7xl font-bold tracking-tighter uppercase">Projects</h2>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-[#6a6b7e] max-w-xs text-right">
            A collection of systems and tools built with precision and performance in mind.
          </p>
        </div>
      </div>

      {/* Horizontal scroll — first card aligns with container left edge */}
      <div className="overflow-x-auto scrollbar-hide pb-8">
        <div className="flex gap-6 snap-x snap-mandatory w-max px-6 md:px-[max(24px,calc((100vw-1280px)/2+24px))]">
          {PORTFOLIO_DATA.projects.map((project, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="flex-none w-[320px] md:w-[480px] snap-start group cursor-pointer"
            >
              <a href={project.link} target="_blank" rel="noopener noreferrer">
                {/* Card thumbnail */}
                <div className="aspect-[16/10] bg-gray-100 dark:bg-[#191a22] border border-black dark:border-[#252630] mb-6 overflow-hidden relative">
                  {project.image ? (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="absolute inset-0 w-full h-full object-cover
                        opacity-85 dark:opacity-60
                        group-hover:opacity-100 dark:group-hover:opacity-80
                        group-hover:scale-105 transition-all duration-700"
                    />
                  ) : null}
                  {/* Subtle dark gradient so overlay text is always readable */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  <div className="absolute top-5 left-5 text-4xl font-black opacity-20 z-10 text-white select-none">
                    0{idx + 1}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] border-b border-white pb-1 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      View Project <ArrowUpRight className="w-3 h-3" />
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                <h3 className="text-2xl font-bold uppercase tracking-tight mb-2 group-hover:translate-x-1 transition-transform duration-300">
                  {project.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-[#8a8b9a] mb-4 leading-relaxed">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 border border-gray-200 dark:border-[#252630] text-[10px] font-bold uppercase tracking-widest">
                      {tag}
                    </span>
                  ))}
                </div>
              </a>
            </motion.div>
          ))}
        </div>
      </div>

      {/* View All button — same left-edge alignment as scroll track */}
      <div className="mt-12 px-6 md:px-[max(24px,calc((100vw-1280px)/2+24px))]">
        <motion.button
          onClick={() => navigate('/projects')}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="group flex items-center gap-3 text-xs font-bold uppercase tracking-widest border border-black dark:border-[#e3e4ed] px-8 py-4 hover:bg-black dark:hover:bg-[#e3e4ed] hover:text-white dark:hover:text-[#111318] transition-all duration-300"
        >
          View All Projects
          <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
        </motion.button>
      </div>
    </section>
  );
};

const Experience = () => (
  <section id="experience" className="whitespace-massive border-t border-black dark:border-[#252630] bg-white dark:bg-[#111318] text-black dark:text-[#e3e4ed]">
    <div className="container mx-auto px-6">
      <div className="max-w-5xl">
        <h2 className="text-4xl md:text-8xl font-black tracking-tighter uppercase mb-24">
          Professional<br />
          <span className="text-gray-300 dark:text-[#2d2e3e]">Experience</span>
        </h2>

        <div className="space-y-24">
          {PORTFOLIO_DATA.experience.map((exp, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8 md:gap-16 group"
            >
              <div className="space-y-2">
                <div className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 dark:text-[#6a6b7e]">
                  {exp.period}
                </div>
                <div className="h-px w-12 bg-black dark:bg-[#e3e4ed] group-hover:w-full transition-all duration-700" />
              </div>
              <div>
                <h3 className="text-3xl md:text-5xl font-bold uppercase tracking-tighter mb-2">{exp.role}</h3>
                <p className="text-xl text-gray-500 dark:text-[#8a8b9a] mb-8 font-medium uppercase tracking-widest">{exp.company}</p>
                <p className="text-lg text-gray-600 dark:text-[#8a8b9a] leading-relaxed max-w-3xl font-light">
                  {exp.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const Skills = () => (
  <section id="skills" className="whitespace-massive border-t border-black dark:border-[#252630] bg-gray-50 dark:bg-[#191a22]">
    <div className="container mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        <div>
          <h2 className="text-4xl font-bold uppercase tracking-tighter mb-8">Technical Stack</h2>
          <p className="text-gray-500 dark:text-[#8a8b9a] max-w-sm leading-relaxed">
            Specializing in backend systems, cloud infrastructure, and high-performance computing.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {PORTFOLIO_DATA.skills.map((skill, idx) => (
            <motion.div
              key={skill}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: idx * 0.05 }}
              viewport={{ once: true }}
              className="p-4 border border-black/10 dark:border-[#252630] bg-white dark:bg-[#111318] text-[10px] font-bold uppercase tracking-widest flex items-center justify-center text-center hover:bg-black dark:hover:bg-[#e3e4ed] hover:text-white dark:hover:text-[#111318] transition-colors cursor-default"
            >
              {skill}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const Blog = () => (
  <section id="blog" className="whitespace-massive border-t border-black dark:border-[#252630] bg-white dark:bg-[#111318]">
    <div className="container mx-auto px-6">
      <div className="max-w-5xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-7xl font-bold tracking-tighter uppercase mb-16"
        >
          Writing
        </motion.h2>

        <div>
          {PORTFOLIO_DATA.blog.map((post, idx) => (
            <motion.a
              key={idx}
              href={post.link}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group flex flex-col md:flex-row md:items-start justify-between py-8 border-b border-black dark:border-[#252630] hover:bg-black dark:hover:bg-[#e3e4ed] hover:text-white dark:hover:text-[#111318] transition-all duration-300 px-0 hover:px-6 -mx-0 hover:-mx-6 block"
            >
              <div className="flex-1">
                <h3 className="text-xl md:text-2xl font-bold uppercase tracking-tight mb-2">{post.title}</h3>
                <p className="text-sm text-gray-500 dark:text-[#8a8b9a] group-hover:text-gray-300 dark:group-hover:text-[#4a4b5c] leading-relaxed max-w-2xl">{post.summary}</p>
              </div>
              <div className="flex items-center gap-3 mt-4 md:mt-1 shrink-0 md:ml-12">
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-[#6a6b7e] group-hover:text-gray-300 dark:group-hover:text-[#4a4b5c]">{post.date}</span>
                <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </div>
  </section>
);

// Rolling "coming up" text link — bottom text slides up into view on hover
const RollingLink = ({ href, label, target }: { href: string; label: string; target?: string }) => (
  <a
    href={href}
    target={target}
    rel={target === '_blank' ? 'noopener noreferrer' : undefined}
    aria-label={label}
    className="relative overflow-hidden inline-block group"
  >
    <span className="block transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full">
      {label}
    </span>
    <span
      aria-hidden
      className="absolute inset-x-0 top-full block transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full"
    >
      {label}
    </span>
  </a>
);

const Footer = () => (
  <footer className="py-12 px-6 md:px-12 border-t border-black dark:border-[#252630] flex flex-col md:flex-row justify-between items-center gap-8">
    <div className="text-xs font-bold uppercase tracking-widest">
      © {new Date().getFullYear()} Hemesh Gupta
    </div>
    <div className="flex gap-8 text-xs font-bold uppercase tracking-widest">
      <RollingLink href={PORTFOLIO_DATA.linkedin} label="LinkedIn" target="_blank" />
      <RollingLink href={PORTFOLIO_DATA.github} label="GitHub" target="_blank" />
      <RollingLink href={`mailto:${PORTFOLIO_DATA.email}`} label="Email" />
    </div>
  </footer>
);

function MainPage() {
  const { isDark, toggle } = useDarkMode();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="relative">
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-black dark:bg-[#e3e4ed] origin-left z-[60]"
        style={{ scaleX }}
      />
      <Navbar />
      <FloatingThemeToggle isDark={isDark} onToggle={toggle} />
      <main>
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Blog />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/projects" element={<AllProjectsPage />} />
      </Routes>
    </HashRouter>
  );
}
