import { useEffect, useRef, useState } from 'react'

export default function App() {
  const [scrolled, setScrolled] = useState(false)
  const [logoState, setLogoState] = useState<'hero' | 'mini'>('hero')
  const particlesRef = useRef<HTMLDivElement>(null)
  const particleTimers = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY
      setScrolled(y > 50)
      setLogoState(y > 80 ? 'mini' : 'hero')
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Particles
  useEffect(() => {
    const container = particlesRef.current
    if (!container) return

    const createParticle = () => {
      const p = document.createElement('div')
      p.style.cssText = `
        position:absolute;
        border-radius:50%;
        background:#7c3aed;
        opacity:0;
        animation:particleFloat linear infinite;
        left:${Math.random() * 100}%;
        width:${Math.random() * 3 + 1}px;
        height:${Math.random() * 3 + 1}px;
        animation-duration:${Math.random() * 10 + 8}s;
        animation-delay:${Math.random() * 5}s;
      `
      container.appendChild(p)
      const t = setTimeout(() => p.remove(), 20000)
      particleTimers.current.push(t)
    }

    for (let i = 0; i < 30; i++) {
      const t = setTimeout(createParticle, i * 300)
      particleTimers.current.push(t)
    }
    const interval = setInterval(createParticle, 800)

    return () => {
      clearInterval(interval)
      particleTimers.current.forEach(clearTimeout)
    }
  }, [])

  // Scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              ;(entry.target as HTMLElement).style.opacity = '1'
              ;(entry.target as HTMLElement).style.transform = 'translateY(0)'
            }, i * 80)
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const smoothScroll = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;700&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; }
        :root {
          --accent: #6d28d9;
          --accent-light: #a78bfa;
          --accent-mid: #7c3aed;
          --bg-dark: #0d0b14;
          --bg-card: #13101e;
          --bg-card-hover: #1a1530;
          --border: #1e1a30;
          --text: #e2e8f0;
          --text-dim: #6b7280;
        }
        html { scroll-behavior:smooth; }
        body {
          font-family:'Inter',sans-serif;
          background:var(--bg-dark);
          color:var(--text);
          overflow-x:hidden;
        }
        ::-webkit-scrollbar { width:6px; }
        ::-webkit-scrollbar-track { background:var(--bg-dark); }
        ::-webkit-scrollbar-thumb { background:var(--accent); border-radius:3px; }

        @keyframes heroBgZoom {
          0% { transform:scale(1.05); }
          100% { transform:scale(1.15); }
        }
        @keyframes logoGlow {
          0% { filter:drop-shadow(0 0 20px rgba(109,40,217,0.4)); }
          100% { filter:drop-shadow(0 0 50px rgba(167,139,250,0.7)); }
        }
        @keyframes pulse {
          0%,100% { opacity:1; box-shadow:0 0 0 0 rgba(34,197,94,0.4); }
          50% { opacity:0.7; box-shadow:0 0 0 8px rgba(34,197,94,0); }
        }
        @keyframes bounce {
          0%,100% { transform:translateX(-50%) translateY(0); }
          50% { transform:translateX(-50%) translateY(10px); }
        }
        @keyframes particleFloat {
          0% { opacity:0; transform:translateY(100vh) scale(0); }
          10% { opacity:0.5; }
          90% { opacity:0.5; }
          100% { opacity:0; transform:translateY(-100px) scale(1); }
        }

        /* Floating logo */
        .floating-logo {
          position: fixed;
          z-index: 200;
          transition: all 0.5s cubic-bezier(0.16,1,0.3,1);
          pointer-events: none;
        }
        .floating-logo.hero-pos {
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: min(420px, 70vw);
          opacity: 1;
        }
        .floating-logo.mini-pos {
          top: 10px;
          left: 18px;
          transform: translate(0, 0);
          width: 54px;
          opacity: 1;
          pointer-events: auto;
          cursor: pointer;
        }

        /* Hero */
        .hero {
          position:relative;
          min-height:100vh;
          display:flex;
          align-items:center;
          justify-content:center;
          overflow:hidden;
        }
        .hero-bg {
          position:absolute;
          inset:0;
          background:url('https://images.pexels.com/photos/6793608/pexels-photo-6793608.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=2000') center/cover no-repeat;
          filter:brightness(0.2) saturate(0.5);
          transform:scale(1.05);
          animation:heroBgZoom 20s ease-in-out infinite alternate;
        }
        .hero-overlay {
          position:absolute;
          inset:0;
          background:linear-gradient(180deg,rgba(13,11,20,0.3) 0%,rgba(13,11,20,0.65) 60%,rgba(13,11,20,1) 100%);
        }
        .hero-content {
          position:relative;
          z-index:10;
          text-align:center;
          padding:0 20px;
        }
        /* spacer for logo in hero */
        .hero-logo-spacer {
          display:block;
          width:min(420px,70vw);
          height:auto;
          margin:0 auto 40px;
          visibility:hidden;
        }
        .subtitle {
          font-size:clamp(0.9rem,2.5vw,1.3rem);
          color:var(--text-dim);
          font-weight:300;
          letter-spacing:0.3em;
          text-transform:uppercase;
          margin-bottom:28px;
        }
        .version-badge {
          display:inline-flex;
          align-items:center;
          gap:8px;
          padding:8px 20px;
          background:rgba(109,40,217,0.15);
          border:1px solid rgba(109,40,217,0.3);
          border-radius:50px;
          font-family:'JetBrains Mono',monospace;
          font-size:0.85rem;
          color:var(--accent-light);
          margin-bottom:28px;
        }
        .version-badge .dot {
          width:8px; height:8px;
          background:#22c55e;
          border-radius:50%;
          animation:pulse 2s infinite;
        }
        .dev-banner {
          display:inline-flex;
          align-items:center;
          gap:10px;
          padding:14px 28px;
          background:linear-gradient(135deg,rgba(245,158,11,0.15),rgba(239,68,68,0.1));
          border:1px solid rgba(245,158,11,0.3);
          border-radius:12px;
          font-size:0.95rem;
          color:#fbbf24;
          margin-bottom:28px;
          backdrop-filter:blur(10px);
        }
        .hero-buttons { margin-top: 8px; }
        .hero-cta {
          display:inline-flex;
          align-items:center;
          gap:10px;
          padding:16px 36px;
          background:linear-gradient(135deg,var(--accent-mid),var(--accent));
          color:white;
          text-decoration:none;
          border-radius:12px;
          font-weight:600;
          font-size:1.05rem;
          transition:all 0.3s;
          border:none;
          cursor:pointer;
          box-shadow:0 4px 30px rgba(109,40,217,0.35);
        }
        .hero-cta:hover {
          transform:translateY(-2px);
          box-shadow:0 8px 40px rgba(167,139,250,0.45);
        }
        .scroll-indicator {
          position:absolute;
          bottom:40px;
          left:50%;
          transform:translateX(-50%);
          z-index:10;
          animation:bounce 2s infinite;
        }

        /* Navbar */
        .navbar {
          position:fixed;
          top:0; left:0; right:0;
          z-index:100;
          padding:16px 30px;
          transition:all 0.4s;
        }
        .navbar.scrolled {
          background:rgba(13,11,20,0.92);
          backdrop-filter:blur(20px);
          border-bottom:1px solid var(--border);
          padding:10px 30px;
        }
        .nav-inner {
          max-width:1200px;
          margin:0 auto;
          display:flex;
          align-items:center;
          justify-content:space-between;
        }
        /* placeholder where mini logo will appear */
        .nav-logo-placeholder { width:54px; height:40px; display:block; }
        .nav-links { display:flex; gap:32px; list-style:none; }
        .nav-links a {
          color:var(--text-dim);
          text-decoration:none;
          font-size:0.9rem;
          font-weight:500;
          transition:color 0.3s;
          position:relative;
        }
        .nav-links a:hover { color:white; }
        .nav-links a::after {
          content:'';
          position:absolute;
          bottom:-4px; left:0;
          width:0; height:2px;
          background:var(--accent-mid);
          transition:width 0.3s;
        }
        .nav-links a:hover::after { width:100%; }
        .mobile-menu-btn {
          display:none;
          background:none;
          border:none;
          cursor:pointer;
          padding:8px;
        }
        .mobile-nav-open .nav-links {
          display:flex !important;
          position:fixed;
          top:60px; left:0; right:0;
          flex-direction:column;
          background:rgba(13,11,20,0.97);
          backdrop-filter:blur(20px);
          padding:20px 30px;
          gap:16px;
          border-bottom:1px solid var(--border);
          z-index:99;
        }

        /* Sections */
        .section {
          padding:100px 20px;
          max-width:1200px;
          margin:0 auto;
        }
        .section-label {
          display:inline-flex;
          align-items:center;
          gap:8px;
          font-family:'JetBrains Mono',monospace;
          font-size:0.8rem;
          color:var(--accent-light);
          text-transform:uppercase;
          letter-spacing:0.15em;
          margin-bottom:16px;
        }
        .section-label::before {
          content:'';
          width:24px; height:1px;
          background:var(--accent-mid);
        }
        .section-title {
          font-size:clamp(2rem,5vw,3.2rem);
          font-weight:800;
          margin-bottom:20px;
          line-height:1.1;
        }
        .section-desc {
          font-size:1.1rem;
          color:var(--text-dim);
          max-width:600px;
          line-height:1.7;
          margin-bottom:60px;
        }

        /* Cards */
        .features-grid {
          display:grid;
          grid-template-columns:repeat(auto-fit,minmax(320px,1fr));
          gap:20px;
        }
        .feature-card {
          background:var(--bg-card);
          border:1px solid var(--border);
          border-radius:16px;
          padding:36px;
          transition:all 0.4s;
          position:relative;
          overflow:hidden;
        }
        .feature-card::before {
          content:'';
          position:absolute;
          top:0; left:0; right:0;
          height:2px;
          background:linear-gradient(90deg,transparent,var(--accent-mid),transparent);
          opacity:0;
          transition:opacity 0.4s;
        }
        .feature-card:hover { background:var(--bg-card-hover); border-color:rgba(109,40,217,0.35); transform:translateY(-4px); }
        .feature-card:hover::before { opacity:1; }
        .feature-icon {
          width:52px; height:52px;
          background:rgba(109,40,217,0.12);
          border-radius:14px;
          display:flex; align-items:center; justify-content:center;
          font-size:1.5rem;
          margin-bottom:20px;
        }
        .feature-card h3 { font-size:1.2rem; font-weight:700; margin-bottom:10px; }
        .feature-card p { color:var(--text-dim); font-size:0.92rem; line-height:1.7; }

        .plugins-grid {
          display:grid;
          grid-template-columns:repeat(auto-fit,minmax(260px,1fr));
          gap:16px;
        }
        .plugin-card {
          background:var(--bg-card);
          border:1px solid var(--border);
          border-radius:12px;
          padding:24px;
          transition:all 0.3s;
        }
        .plugin-card:hover { border-color:rgba(109,40,217,0.3); background:var(--bg-card-hover); }
        .plugin-name { font-family:'JetBrains Mono',monospace; font-weight:700; font-size:0.95rem; color:var(--accent-light); margin-bottom:6px; }
        .plugin-desc { font-size:0.85rem; color:var(--text-dim); line-height:1.6; }

        .social-grid {
          display:grid;
          grid-template-columns:repeat(auto-fit,minmax(300px,1fr));
          gap:20px;
        }
        .social-card {
          display:flex; align-items:center; gap:20px;
          background:var(--bg-card);
          border:1px solid var(--border);
          border-radius:16px;
          padding:28px 32px;
          text-decoration:none;
          color:var(--text);
          transition:all 0.4s;
        }
        .social-card:hover { border-color:rgba(109,40,217,0.3); background:var(--bg-card-hover); transform:translateY(-3px); }
        .social-icon { width:56px; height:56px; border-radius:14px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .social-icon.yt { background:rgba(239,68,68,0.15); color:#ef4444; }
        .social-icon.tw { background:rgba(139,92,246,0.15); color:#8b5cf6; }
        .social-icon.tg { background:rgba(109,40,217,0.15); color:#a78bfa; }
        .social-info h3 { font-weight:700; font-size:1.05rem; margin-bottom:4px; }
        .social-info p { font-size:0.85rem; color:var(--text-dim); }
        .social-card .arrow { margin-left:auto; color:var(--text-dim); transition:all 0.3s; flex-shrink:0; }
        .social-card:hover .arrow { color:var(--accent-light); transform:translateX(4px); }

        .cta-banner {
          background:linear-gradient(135deg,rgba(109,40,217,0.12),rgba(99,102,241,0.08));
          border:1px solid rgba(109,40,217,0.22);
          border-radius:24px;
          padding:60px 40px;
          text-align:center;
          position:relative;
          overflow:hidden;
        }
        .cta-banner::before {
          content:'';
          position:absolute;
          top:-100px; right:-100px;
          width:300px; height:300px;
          background:radial-gradient(circle,rgba(109,40,217,0.12) 0%,transparent 70%);
        }
        .cta-banner h2 { font-size:clamp(1.8rem,4vw,2.5rem); font-weight:800; margin-bottom:16px; position:relative; }
        .cta-banner p { color:var(--text-dim); font-size:1.05rem; margin-bottom:30px; position:relative; }

        footer { border-top:1px solid var(--border); padding:40px 20px; text-align:center; }
        footer p { color:var(--text-dim); font-size:0.85rem; }

        .divider { width:100%; height:1px; background:linear-gradient(90deg,transparent,var(--border),transparent); max-width:1200px; margin:0 auto; }

        .reveal {
          opacity:0;
          transform:translateY(30px);
          transition:all 0.7s cubic-bezier(0.16,1,0.3,1);
        }

        @media (max-width:768px) {
          .nav-links { display:none; }
          .mobile-menu-btn { display:block; }
          .features-grid, .plugins-grid, .social-grid { grid-template-columns:1fr; }
          .section { padding:60px 16px; }
          .cta-banner { padding:40px 24px; }
          .floating-logo.hero-pos {
            width: min(240px, 65vw);
            top: 22%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
          .hero-logo-spacer {
            width: min(240px, 65vw);
            margin-bottom: 16px;
          }
          .hero-content {
            padding: 0 16px;
          }
          .subtitle {
            margin-bottom: 18px;
            letter-spacing: 0.15em;
          }
          .version-badge {
            margin-bottom: 18px;
            font-size: 0.78rem;
            padding: 7px 14px;
          }
          .dev-banner {
            font-size: 0.82rem;
            padding: 12px 16px;
            margin-bottom: 20px;
            text-align: left;
          }
          .hero-cta {
            font-size: 0.95rem;
            padding: 14px 24px;
          }
        }
        @media (max-width:480px) {
          .social-card { padding:20px; gap:14px; }
          .floating-logo.hero-pos {
            width: min(200px, 75vw);
            top: 20%;
          }
          .hero-logo-spacer {
            width: min(200px, 75vw);
          }
        }
      `}</style>

      {/* Particles */}
      <div ref={particlesRef} style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }} />

      {/* Floating Logo — hero pos or mini pos */}
      <img
        src={logoState === 'mini' ? '/logo-mini.png' : '/logo-full.png'}
        alt="QWorld"
        className={`floating-logo ${logoState === 'mini' ? 'mini-pos' : 'hero-pos'}`}
        onClick={() => logoState === 'mini' && window.scrollTo({ top: 0, behavior: 'smooth' })}
        style={{ animation: logoState === 'hero' ? 'logoGlow 3s ease-in-out infinite alternate' : 'none' }}
      />

      {/* Navbar */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''} ${mobileOpen ? 'mobile-nav-open' : ''}`} id="navbar">
        <div className="nav-inner">
          {/* placeholder so flex spacing works */}
          <div className="nav-logo-placeholder" />
          <ul className="nav-links">
            <li><a href="#about" onClick={(e) => { e.preventDefault(); smoothScroll('#about'); setMobileOpen(false) }}>О сервере</a></li>
            <li><a href="#features" onClick={(e) => { e.preventDefault(); smoothScroll('#features'); setMobileOpen(false) }}>Особенности</a></li>
            <li><a href="#plugins" onClick={(e) => { e.preventDefault(); smoothScroll('#plugins'); setMobileOpen(false) }}>Плагины</a></li>
            <li><a href="#social" onClick={(e) => { e.preventDefault(); smoothScroll('#social'); setMobileOpen(false) }}>Соц. сети</a></li>
          </ul>
          <button className="mobile-menu-btn" onClick={() => setMobileOpen(o => !o)} aria-label="Меню">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e2e8f0" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-overlay" />
        <div className="hero-content">
          {/* invisible spacer matching logo size so content isn't hidden behind it */}
          <img src="/logo-full.png" alt="" className="hero-logo-spacer" aria-hidden />

          <p className="subtitle">Roleplay Minecraft Server</p>
          <div className="version-badge">
            <span className="dot" />
            Minecraft 1.21.1
          </div>
          <div className="dev-banner">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            Сервер в разработке — следите за новостями в Telegram
          </div>
          <div className="hero-buttons">
            <a href="https://t.me/qworld_s" target="_blank" rel="noreferrer" className="hero-cta">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
              Telegram канал сервера
            </a>
          </div>
        </div>
        <div className="scroll-indicator">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2">
            <path d="M12 5v14M19 12l-7 7-7-7"/>
          </svg>
        </div>
      </section>

      {/* About */}
      <section className="section" id="about">
        <div className="reveal">
          <span className="section-label">О проекте</span>
          <h2 className="section-title">Что такое QWorld?</h2>
          <p className="section-desc">
            QWorld — это RP Minecraft сервер от qrenqq, где всё зависит от игроков. Строй города, создавай государства, торгуй, воюй и устанавливай свои правила. Экономика, политика, дипломатия — всё в руках сообщества.
          </p>
        </div>
        <div className="features-grid" id="features">
          {[
            { icon: '🏰', title: 'Полная свобода RP', desc: 'Создавай свою историю: будь королём, торговцем, наёмником или разбойником. Никаких рамок — только твоя фантазия и действия определяют ход событий на сервере.' },
            { icon: '🎤', title: 'Голосовой чат', desc: 'Plasmo Voice для живого общения прямо в игре. Разговаривай с соседями, ведите переговоры между городами или просто общайся с друзьями в реальном времени.' },
            { icon: '💰', title: 'Игровая экономика', desc: 'Экономика полностью в руках игроков. Торгуйте, создавайте магазины, устанавливайте цены. Реальный рынок, созданный и управляемый сообществом.' },
            { icon: '🤝', title: 'Дипломатия и союзы', desc: 'Объединяйтесь в группы, заключайте союзы, ведите переговоры. Каждое решение и договорённость влияют на развитие мира сервера.' },
            { icon: '🌍', title: 'Живой мир', desc: 'Уникальный мир, который меняется и развивается вместе с игроками. Стройте города, прокладывайте дороги, создавайте свою цивилизацию.' },
            { icon: '🆓', title: 'Бесплатный вход', desc: 'Никаких донатов для входа — нужно всего лишь оставить анкету в Telegram боте. Если администрация вами заинтересуется, вам будет открыт путь на сервер.' },
          ].map((f) => (
            <div key={f.title} className="feature-card reveal">
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="divider" />

      {/* Plugins */}
      <section className="section" id="plugins">
        <div className="reveal">
          <span className="section-label">Технологии</span>
          <h2 className="section-title">Плагины сервера</h2>
          <p className="section-desc">Подборка плагинов, которые делают QWorld уникальным RP-сервером с продуманным геймплеем.</p>
        </div>
        <div className="plugins-grid">
          {[
            { name: 'Plasmo Voice', desc: 'Голосовой чат в игре с поддержкой proximity voice — общайся с теми, кто рядом' },
            { name: 'EssentialsX', desc: 'Базовые команды, системы телепортации, управление игроками и утилиты' },
            { name: 'CoreProtect', desc: 'Логирование действий и откат грифа — защита построек игроков' },
            { name: 'Dynmap', desc: 'Онлайн-карта мира в браузере — смотри территории в реальном времени' },
            { name: 'DiscordSRV', desc: 'Интеграция с Discord — чат между игрой и сервером Discord' },
            { name: 'TAB', desc: 'Кастомный TAB-лист с информацией о ролях и онлайне игроков' },
          ].map((p) => (
            <div key={p.name} className="plugin-card reveal">
              <div className="plugin-name">{p.name}</div>
              <div className="plugin-desc">{p.desc}</div>
            </div>
          ))}
          <div className="plugin-card reveal" style={{ background: 'linear-gradient(135deg,rgba(109,40,217,0.08),rgba(99,102,241,0.05))', borderColor: 'rgba(109,40,217,0.22)' }}>
            <div className="plugin-name" style={{ color: '#a78bfa' }}>+ Кастомные плагины</div>
            <div className="plugin-desc">А также множество уникальных кастомных плагинов, разработанных специально для QWorld</div>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* Social */}
      <section className="section" id="social">
        <div className="reveal">
          <span className="section-label">Соц. сети</span>
          <h2 className="section-title">Соц. сети qrenqq</h2>
          <p className="section-desc">Подписывайся, чтобы быть в курсе новостей и следить за развитием проекта QWorld.</p>
        </div>
        <div className="social-grid">
          <a href="https://www.youtube.com/@qrenqq" target="_blank" rel="noreferrer" className="social-card reveal">
            <div className="social-icon yt">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </div>
            <div className="social-info"><h3>YouTube</h3><p>@qrenqq — видео, летсплеи и контент</p></div>
            <svg className="arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
          <a href="https://www.twitch.tv/qrenqq" target="_blank" rel="noreferrer" className="social-card reveal">
            <div className="social-icon tw">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z"/></svg>
            </div>
            <div className="social-info"><h3>Twitch</h3><p>@qrenqq — стримы и прямые эфиры</p></div>
            <svg className="arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
          <a href="https://t.me/qrentg" target="_blank" rel="noreferrer" className="social-card reveal">
            <div className="social-icon tg">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
            </div>
            <div className="social-info"><h3>Telegram</h3><p>@qrentg — личный канал qrenqq</p></div>
            <svg className="arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
        </div>
      </section>

      <div className="divider" />

      {/* CTA */}
      <section className="section">
        <div className="cta-banner reveal">
          <div className="dev-banner" style={{ marginBottom: 24 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            Сервер в разработке
          </div>
          <h2>Скоро открытие QWorld</h2>
          <p>Сервер сейчас находится в активной разработке. Вся актуальная информация, даты тестов и новости — в Telegram канале сервера.</p>
          <a href="https://t.me/qworld_s" target="_blank" rel="noreferrer" className="hero-cta">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
            Следить за новостями
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <p>© 2025 QWorld — Minecraft RP Server by qrenqq. Все права защищены.</p>
      </footer>
    </>
  )
}
