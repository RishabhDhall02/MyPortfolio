import { useState, useEffect, useRef } from 'react';
import { motion, useScroll } from 'framer-motion';
import axios from 'axios';

// --- Types ---
interface Project {
  id: number;
  name: string;
  description: string;
  url: string;
  language: string;
  stars: number;
  forks: number;
  topics: string[];
  isPinned: boolean;
  imageUrl?: string | null;
}


interface Experience {
  id: number;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string | null;
  description: string;
  technologies: string[];
}

interface About {
  headline: string;
  bio: string;
  location: string;
  githubUrl: string;
  linkedinUrl: string;
  avatarUrl: string;
}

// --- Helpers ---
const monthYear = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

// --- Components ---

const InteractiveCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trail = useRef<{ x: number; y: number; age: number }[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const strokeRgb = '225, 29, 72';

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    // Detect browser zoom changes (DPR changes)
    let dprQuery = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
    const onDprChange = () => {
      resize();
      // Re-register with new DPR value
      dprQuery.removeEventListener('change', onDprChange);
      dprQuery = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
      dprQuery.addEventListener('change', onDprChange);
    };
    dprQuery.addEventListener('change', onDprChange);

    const handleMouseMove = (e: MouseEvent) => {
      trail.current.push({ x: e.clientX, y: e.clientY, age: 1.0 });
    };
    window.addEventListener('mousemove', handleMouseMove);

    let animationFrameId: number;

    const render = () => {
      animationFrameId = requestAnimationFrame(render);
      const dpr = window.devicePixelRatio || 1;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      trail.current.forEach(p => { p.age -= 0.015; });
      trail.current = trail.current.filter(p => p.age > 0);

      if (trail.current.length < 2) return;

      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.shadowBlur = 12;
      ctx.shadowColor = `rgba(${strokeRgb}, 0.6)`;

      for (let i = 1; i < trail.current.length; i++) {
        const point = trail.current[i];
        const prev = trail.current[i - 1];
        const alpha = point.age * 0.7;

        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = `rgba(${strokeRgb}, ${alpha})`;
        ctx.moveTo(prev.x, prev.y);
        ctx.lineTo(point.x, point.y);
        ctx.stroke();
      }

      ctx.shadowBlur = 0;
    };
    render();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      dprQuery.removeEventListener('change', onDprChange);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1, pointerEvents: 'none' }}
    />
  );
};

const Navbar = () => (
  <nav style={{ position: 'absolute', top: '2rem', right: '4rem', zIndex: 100, display: 'flex', gap: '3rem' }}>
    <a href="#about" className="nav-link">About</a>
    <a href="#experience" className="nav-link">Experience</a>
    <a href="#projects" className="nav-link">Projects</a>
  </nav>
);



const Hero = ({ about }: { about: About }) => (
  <section id="hero" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
    <div className="grid-layout" style={{ width: '100%' }}>
      <div className="col-8">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 style={{ fontSize: 'clamp(4rem, 10vw, 8rem)', fontWeight: 700, lineHeight: 0.9, marginBottom: '2rem', textTransform: 'uppercase' }}>
            Rishabh <br /> <span className="accent-text">Dhall</span>
          </h1>
          <p style={{ fontSize: '1.4rem', color: 'var(--text-secondary)', maxWidth: '700px', marginBottom: '3.5rem', fontWeight: 400, lineHeight: 1.5, letterSpacing: '-0.01em' }}>
            {about.headline}
          </p>
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <button onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}>
              Explore Work
            </button>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <motion.a 
                whileHover={{ scale: 1.15, y: -5 }} 
                whileTap={{ scale: 0.95 }} 
                href={about.githubUrl} target="_blank" rel="noreferrer" className="accent-text" style={{ transition: 'color 0.3s' }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              </motion.a>
              <motion.a 
                whileHover={{ scale: 1.15, y: -5 }} 
                whileTap={{ scale: 0.95 }} 
                href={about.linkedinUrl} target="_blank" rel="noreferrer" className="accent-text" style={{ transition: 'color 0.3s' }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.238 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', opacity: 0.5 }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 13l5 5 5-5M7 6l5 5 5-5"/></svg>
      </motion.div>
    </div>
  </section>
);

const ProjectCard = ({ project, isHighlight }: { project: Project, isHighlight?: boolean }) => (
  <motion.div 
    layout
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true }}
    className="brutalist-card" 
    style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
  >
    {project.imageUrl && (
      <div style={{ width: '100%', height: '220px', marginBottom: '1.5rem', overflow: 'hidden', borderRadius: '8px' }}>
        <img src={project.imageUrl} alt={project.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
      </div>
    )}
    <div style={{ marginBottom: '1.5rem' }}>
      <div style={{ marginBottom: '0.5rem' }}>
        <h3 style={{ fontSize: '1.35rem', lineHeight: 1.3, display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
          {isHighlight && (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--accent)" style={{ flexShrink: 0 }}>
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          )}
          {project.name}
        </h3>
      </div>
      <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', lineHeight: 1.6, marginBottom: '0.5rem' }}>{project.description}</p>
    </div>
    <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
      <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--accent)', flexShrink: 1, minWidth: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{project.language}</span>
      <a href={project.url} target="_blank" rel="noreferrer" className="source-btn" style={{ flexShrink: 0 }}>
        View Source
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17l9.2-9.2M17 17V7H7"/></svg>
      </a>
    </div>
  </motion.div>
);

const App = () => {
  const [projects, setProjects] = useState<Project[]>([
    { id: 1, name: "Task Automation Core", description: "Multi-threaded task orchestrator built with .NET 9 and PostgreSQL.", url: "#", language: "C#", stars: 12, forks: 4, topics: ["system", "backend"], isPinned: true },
    { id: 2, name: "Market Data Scraper", description: "Asynchronous scraper utilizing HtmlAgilityPack to sync real-time market data.", url: "#", language: "C#", stars: 8, forks: 2, topics: ["data", "scraping"], isPinned: true },
    { id: 3, name: "Industrial Dashboard", description: "High-contrast monitoring dashboard with Space Grotesk typography.", url: "#", language: "TypeScript", stars: 24, forks: 6, topics: ["react", "frontend"], isPinned: false }
  ]);

  const [experience, setExperience] = useState<Experience[]>([
    { id: 1, company: "Modern Systems", role: "Software Engineer", location: "Remote", startDate: "2023-01-01", endDate: null, description: "Architecting cloud-native solutions and scalable microservices.", technologies: [".NET", "React", "Docker"] },
    { id: 2, company: "Core Dev Group", role: "Developer", location: "Global", startDate: "2021-06-01", endDate: "2022-12-31", description: "Focused on API design and backend performance optimization.", technologies: ["ASP.NET", "SQL"] }
  ]);
  const [about, setAbout] = useState<About>({
    headline: 'Building high-performance, scalable web systems with a focus on precision and impact.',
    bio: "Specializing in crafting robust full-stack applications using React, TypeScript, and .NET. I focus on building distributed backends, AI-powered tools, and high-utility interfaces that deliver real-world value.",
    location: 'Ontario, Canada',
    githubUrl: 'https://github.com/RishabhDhall02',
    linkedinUrl: 'https://linkedin.com/in/rishabhdhall',
    avatarUrl: ''
  });
  const [loading, setLoading] = useState(true);

  const API_BASE = 'http://localhost:5129/api';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projRes, expRes, aboutRes] = await Promise.all([
          axios.get(`${API_BASE}/projects`),
          axios.get(`${API_BASE}/experience`),
          axios.get(`${API_BASE}/about`)
        ]);
        setProjects(projRes.data);
        setExperience(expRes.data);
        setAbout(aboutRes.data);
      } catch (err) {
        console.warn("API fallback active.");
      } finally {
        setTimeout(() => setLoading(false), 500);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div style={{ height: '100vh', background: 'var(--bg-color)' }}></div>;

  return (
    <div className="container">
      <InteractiveCanvas />
      <Navbar />
      <Hero about={about} />

      <motion.section 
        id="about"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="grid-layout" style={{ alignItems: 'start' }}>
          <div className="col-4">
            <h2 style={{ fontSize: '2.8rem', textTransform: 'uppercase', lineHeight: 1 }}>About</h2>
          </div>
          <div className="col-8" style={{ paddingTop: '0.35rem' }}>
            <p style={{ fontSize: '1.15rem', lineHeight: 1.8, fontWeight: 400, color: 'var(--text-secondary)', maxWidth: '680px', marginBottom: '2rem' }}>
              {about.bio}
            </p>
            <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
              {[
                { name: 'Python', url: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/python.svg' },
                { name: 'JavaScript', url: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/javascript.svg' },
                { name: 'TypeScript', url: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/typescript.svg' },
                { name: 'React', url: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/react.svg' },
                { name: 'Node.js', url: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/nodedotjs.svg' },
              ].map(tech => (
                <div key={tech.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.8rem' }}>
                  <img 
                    src={tech.url} 
                    alt={tech.name} 
                    width="32" 
                    height="32" 
                    style={{ 
                      filter: 'brightness(0) saturate(100%) invert(31%) sepia(91%) saturate(2283%) hue-rotate(338deg) brightness(102%) contrast(101%)',
                      transition: 'all 0.2s ease-out',
                      cursor: 'default'
                    }} 
                    onMouseEnter={e => {
                      const img = e.target as HTMLImageElement;
                      img.style.transform = 'translateY(-2px) scale(1.1)';
                      img.style.filter = 'brightness(0) saturate(100%) invert(31%) sepia(91%) saturate(3000%) hue-rotate(338deg) brightness(120%) contrast(110%)';
                    }}
                    onMouseLeave={e => {
                      const img = e.target as HTMLImageElement;
                      img.style.transform = 'translateY(0) scale(1)';
                      img.style.filter = 'brightness(0) saturate(100%) invert(31%) sepia(91%) saturate(2283%) hue-rotate(338deg) brightness(102%) contrast(101%)';
                    }}
                  />
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>{tech.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section 
        id="experience"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="grid-layout" style={{ alignItems: 'start' }}>
          <div className="col-4">
            <h2 style={{ fontSize: '2.8rem', textTransform: 'uppercase', lineHeight: 1 }}>Experience</h2>
          </div>
          <div className="col-8" style={{ paddingTop: '0.35rem' }}>
            {experience.map(exp => (
              <div key={exp.id} style={{ marginBottom: '3.5rem', paddingBottom: '2rem', borderBottom: '1px solid var(--border)' }}>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 600, marginBottom: '0.4rem', lineHeight: 1.3 }}>{exp.role}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 500 }}>{exp.company}</span>
                  {exp.location && (
                    <>
                      <span style={{ opacity: 0.3 }}>·</span>
                      <span>{exp.location}</span>
                    </>
                  )}
                  <span style={{ opacity: 0.3 }}>·</span>
                  <span className="accent-text" style={{ fontWeight: 600 }}>
                    {monthYear(exp.startDate)} – {exp.endDate ? monthYear(exp.endDate) : 'Present'}
                  </span>
                </div>
                <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', lineHeight: 1.75, marginBottom: '0.5rem', maxWidth: '640px' }}>{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section 
        id="projects"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="grid-layout" style={{ alignItems: 'start' }}>
          <div className="col-4">
            <h2 style={{ fontSize: '2.8rem', textTransform: 'uppercase', lineHeight: 1 }}>Projects</h2>
          </div>
          <div className="col-8" style={{ paddingTop: '0.35rem' }}>
            <div className="grid-layout" style={{ gap: '1.2rem' }}>
              {projects.map((p, index) => (
                <div key={p.id} className="col-6">
                  <ProjectCard project={p} isHighlight={index < 2} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>



      <footer style={{ padding: '4rem 0', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
        <p style={{ opacity: 0.5 }}>© {new Date().getFullYear()} Rishabh Dhall</p>
      </footer>
    </div>
  );
};

export default App;
