import { useState, useEffect, useRef } from "react";

// ── PHOTO (base64 placeholder – replaced at runtime from uploads) ──────────
const PHOTO_URL = "https://i.imgur.com/placeholder.png"; // will be overridden

// ── ICONS (inline SVG helpers) ─────────────────────────────────────────────
const Icon = ({ d, size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={2} strokeLinecap="round"
    strokeLinejoin="round" className={className}>
    <path d={d} />
  </svg>
);
const Icons = {
  Grid:      () => <Icon d="M3 3h7v7H3zm11 0h7v7h-7zM3 14h7v7H3zm11 0h7v7h-7z" />,
  Plus:      () => <Icon d="M12 5v14M5 12h14" />,
  Check:     () => <Icon d="M20 6L9 17l-5-5" />,
  X:         () => <Icon d="M18 6L6 18M6 6l12 12" />,
  Trash:     () => <Icon d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />,
  Edit:      () => <Icon d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />,
  Eye:       () => <Icon d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 100 6 3 3 0 000-6z" />,
  Save:      () => <Icon d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z M17 21v-8H7v8M7 3v5h8" />,
  Close:     () => <Icon d="M18 6L6 18M6 6l12 12" />,
  Briefcase: () => <Icon d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />,
  User:      () => <Icon d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2 M12 3a4 4 0 100 8 4 4 0 000-8z" />,
  Link:      () => <Icon d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71 M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />,
  Mail:      () => <Icon d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6" />,
  Phone:     () => <Icon d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.81 19.79 19.79 0 01.22 2.18 2 2 0 012.18 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.18 6.18l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />,
  Linkedin:  () => <Icon d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z M2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z" />,
  Chart:     () => <Icon d="M18 20V10M12 20V4M6 20v-6" />,
  Filter:    () => <Icon d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />,
  Search:    () => <Icon d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />,
  Globe:     () => <Icon d="M12 2a10 10 0 100 20A10 10 0 0012 2z M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />,
  Github:    () => <Icon d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" />,
  Star:      () => <Icon d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />,
  Rocket:    () => <Icon d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z M12 15L9 12C9 12 12 5 20 3c-2 8-5 9-8 12z" />,
  Copy:      () => <Icon d="M20 9h-9a2 2 0 00-2 2v9a2 2 0 002 2h9a2 2 0 002-2v-9a2 2 0 00-2-2z M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />,
  Info:      () => <Icon d="M12 22a10 10 0 100-20 10 10 0 000 20z M12 8v4M12 16h.01" />,
  Whatsapp:  () => (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  ),
};

// ── CHECKLIST ITEMS (from PRD) ─────────────────────────────────────────────
const CHECKLIST_TEMPLATE = [
  { id: "mobile",      label: "Mobile?",              category: "Design" },
  { id: "logo",        label: "Logo?",                category: "Design" },
  { id: "favicon",     label: "Favicon?",             category: "Design" },
  { id: "login",       label: "Login?",               category: "Funcionalidade" },
  { id: "darklight",   label: "Botão Dark/Light?",    category: "Funcionalidade" },
  { id: "manual",      label: "Manual de Instruções?",category: "Documentação" },
  { id: "home",        label: "Página Inicial?",      category: "Páginas" },
  { id: "about",       label: "Página Sobre Nós?",    category: "Páginas" },
  { id: "contact",     label: "Página Contatos?",     category: "Páginas" },
  { id: "lgpd",        label: "Políticas (LGPD)?",    category: "Compliance" },
  { id: "social",      label: "Links Redes Sociais?", category: "Marketing" },
  { id: "blog",        label: "Página Blog?",         category: "Páginas" },
  { id: "plans",       label: "Tem Planos?",          category: "Negócio" },
  { id: "appDesktop",  label: "App Desktop?",         category: "Distribuição" },
  { id: "appMobile",   label: "App Mobile?",          category: "Distribuição" },
  { id: "running",     label: "Projeto Rodando?",     category: "Deploy" },
  { id: "prd",         label: "Tem PRD?",             category: "Documentação" },
  { id: "folder",      label: "Pasta de Projeto?",    category: "Organização" },
  { id: "linkedin",    label: "Pub. LinkedIn?",       category: "Marketing" },
  { id: "instagram",   label: "Pub. Instagram?",      category: "Marketing" },
  { id: "whatsapp",    label: "Pub. WhatsApp?",       category: "Marketing" },
];

const defaultChecklist = () =>
  CHECKLIST_TEMPLATE.map(t => ({ ...t, status: null, obs: "" }));

const PROJECT_TYPES = ["APP", "SITE", "SAAS", "LANDING PAGE"];
const IA_OPTIONS = ["Claude (Anthropic)", "ChatGPT (OpenAI)", "Gemini (Google)", "Copilot (Microsoft)", "Bolt.new", "Lovable", "Cursor", "v0 (Vercel)", "Outro"];
const DEPLOY_OPTIONS = ["Vercel", "Netlify", "GitHub Pages", "Render", "Railway", "AWS", "GCP", "Azure", "Outro"];

const emptyProject = () => ({
  id: Date.now().toString(),
  title: "",
  area: "",
  type: "SITE",
  url: "",
  repo: "",
  deploy: "",
  ia: "",
  email: "",
  createdAt: new Date().toISOString().split("T")[0],
  checklist: defaultChecklist(),
  notes: "",
  pages: "",
  status: "Em Andamento",
});

// ── STYLES ─────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Montserrat:wght@300;400;500;600;700&display=swap');

  :root {
    --gold: #C9A84C;
    --gold-light: #E8C97A;
    --gold-dark: #9A7A32;
    --black: #0A0A0A;
    --black-2: #111111;
    --black-3: #1A1A1A;
    --black-4: #222222;
    --white: #FAFAFA;
    --white-2: #F0EDE6;
    --gray: #888888;
    --gray-light: #CCCCCC;
    --red: #C0392B;
    --green: #27AE60;
    --border: rgba(201,168,76,0.18);
    --shadow: 0 8px 40px rgba(0,0,0,0.5);
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'Montserrat', sans-serif;
    background: var(--black);
    color: var(--white);
    min-height: 100vh;
  }

  .app { display: flex; flex-direction: column; min-height: 100vh; }

  /* ── NAV ── */
  .nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 32px;
    height: 64px;
    background: rgba(10,10,10,0.92);
    border-bottom: 1px solid var(--border);
    backdrop-filter: blur(12px);
  }
  .nav-logo {
    display: flex; align-items: center; gap: 10px;
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.25rem; font-weight: 700;
    color: var(--gold);
    letter-spacing: 0.05em;
  }
  .nav-logo span { color: var(--white); font-weight: 300; }
  .nav-tabs { display: flex; gap: 4px; }
  .nav-tab {
    padding: 6px 16px; border-radius: 4px;
    font-size: 0.75rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase;
    cursor: pointer; border: none;
    background: transparent; color: var(--gray);
    transition: all 0.2s;
  }
  .nav-tab:hover { color: var(--gold-light); }
  .nav-tab.active { background: var(--gold); color: var(--black); }
  .nav-new-btn {
    display: flex; align-items: center; gap: 6px;
    padding: 8px 20px; border-radius: 4px;
    font-size: 0.75rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
    cursor: pointer; border: none;
    background: var(--gold); color: var(--black);
    transition: all 0.2s;
  }
  .nav-new-btn:hover { background: var(--gold-light); transform: translateY(-1px); }

  /* ── MAIN ── */
  .main { flex: 1; padding: 88px 32px 48px; max-width: 1400px; margin: 0 auto; width: 100%; }

  /* ── HERO STATS ── */
  .stats-row {
    display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 32px;
  }
  .stat-card {
    background: var(--black-3); border: 1px solid var(--border);
    border-radius: 8px; padding: 20px 24px;
    display: flex; flex-direction: column; gap: 4px;
  }
  .stat-val {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2.5rem; font-weight: 700; color: var(--gold);
    line-height: 1;
  }
  .stat-label { font-size: 0.72rem; color: var(--gray); letter-spacing: 0.1em; text-transform: uppercase; font-weight: 600; }

  /* ── FILTER BAR ── */
  .filter-bar {
    display: flex; align-items: center; gap: 12px; margin-bottom: 24px; flex-wrap: wrap;
  }
  .search-wrap {
    position: relative; flex: 1; min-width: 220px;
  }
  .search-wrap svg { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--gray); }
  .search-inp {
    width: 100%; padding: 10px 12px 10px 40px;
    background: var(--black-3); border: 1px solid var(--border); border-radius: 6px;
    color: var(--white); font-family: 'Montserrat', sans-serif; font-size: 0.85rem;
    outline: none; transition: border-color 0.2s;
  }
  .search-inp:focus { border-color: var(--gold); }
  .filter-select {
    padding: 10px 14px; background: var(--black-3); border: 1px solid var(--border); border-radius: 6px;
    color: var(--white); font-family: 'Montserrat', sans-serif; font-size: 0.82rem;
    outline: none; cursor: pointer;
  }
  .filter-select:focus { border-color: var(--gold); }

  /* ── PROJECT GRID ── */
  .project-grid {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 20px;
  }
  .project-card {
    background: var(--black-3); border: 1px solid var(--border);
    border-radius: 10px; padding: 24px;
    cursor: pointer; transition: all 0.25s;
    position: relative; overflow: hidden;
  }
  .project-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
    background: linear-gradient(90deg, var(--gold-dark), var(--gold-light));
    opacity: 0; transition: opacity 0.2s;
  }
  .project-card:hover { border-color: var(--gold); transform: translateY(-3px); box-shadow: var(--shadow); }
  .project-card:hover::before { opacity: 1; }
  .card-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 12px; }
  .card-type-badge {
    padding: 3px 10px; border-radius: 3px; font-size: 0.65rem; font-weight: 700;
    letter-spacing: 0.12em; text-transform: uppercase;
    background: rgba(201,168,76,0.12); color: var(--gold); border: 1px solid var(--border);
  }
  .card-actions { display: flex; gap: 6px; }
  .card-action-btn {
    width: 30px; height: 30px; border-radius: 4px; border: none;
    background: var(--black-4); color: var(--gray);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: all 0.2s;
  }
  .card-action-btn:hover { background: var(--gold); color: var(--black); }
  .card-action-btn.danger:hover { background: var(--red); color: var(--white); }
  .card-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.4rem; font-weight: 700; color: var(--white);
    margin-bottom: 4px; line-height: 1.2;
  }
  .card-area { font-size: 0.75rem; color: var(--gray); margin-bottom: 14px; }
  .progress-bar-wrap { margin-bottom: 10px; }
  .progress-label { display: flex; justify-content: space-between; font-size: 0.72rem; color: var(--gray); margin-bottom: 5px; }
  .progress-track { height: 5px; background: var(--black-4); border-radius: 3px; overflow: hidden; }
  .progress-fill {
    height: 100%; border-radius: 3px;
    background: linear-gradient(90deg, var(--gold-dark), var(--gold-light));
    transition: width 0.5s ease;
  }
  .card-meta { display: flex; gap: 16px; margin-top: 14px; }
  .card-meta-item { display: flex; align-items: center; gap: 5px; font-size: 0.72rem; color: var(--gray); }
  .card-status-badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 3px 10px; border-radius: 20px; font-size: 0.68rem; font-weight: 700; letter-spacing: 0.06em;
    margin-top: 10px;
  }
  .status-running { background: rgba(39,174,96,0.15); color: #2ecc71; border: 1px solid rgba(39,174,96,0.3); }
  .status-progress { background: rgba(201,168,76,0.12); color: var(--gold); border: 1px solid var(--border); }
  .status-paused { background: rgba(192,57,43,0.15); color: #e74c3c; border: 1px solid rgba(192,57,43,0.3); }

  /* ── EMPTY STATE ── */
  .empty-state {
    grid-column: 1/-1; text-align: center; padding: 80px 20px;
    color: var(--gray);
  }
  .empty-icon { color: var(--gold); opacity: 0.3; margin-bottom: 16px; }
  .empty-title { font-family: 'Cormorant Garamond', serif; font-size: 1.8rem; color: var(--white-2); margin-bottom: 8px; }

  /* ── MODAL ── */
  .modal-overlay {
    position: fixed; inset: 0; z-index: 200;
    background: rgba(0,0,0,0.85); backdrop-filter: blur(6px);
    display: flex; align-items: flex-start; justify-content: center;
    overflow-y: auto; padding: 24px;
  }
  .modal {
    background: var(--black-2); border: 1px solid var(--border);
    border-radius: 12px; width: 100%; max-width: 900px;
    box-shadow: 0 20px 80px rgba(0,0,0,0.8);
    animation: slideUp 0.3s ease;
  }
  @keyframes slideUp { from { opacity:0; transform: translateY(20px); } to { opacity:1; transform: translateY(0); } }
  .modal-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 24px 28px; border-bottom: 1px solid var(--border);
  }
  .modal-title {
    font-family: 'Cormorant Garamond', serif; font-size: 1.6rem; font-weight: 700;
    color: var(--gold);
  }
  .modal-close {
    width: 36px; height: 36px; border-radius: 6px; border: 1px solid var(--border);
    background: transparent; color: var(--gray); cursor: pointer;
    display: flex; align-items: center; justify-content: center; transition: all 0.2s;
  }
  .modal-close:hover { background: var(--red); color: var(--white); border-color: var(--red); }
  .modal-body { padding: 28px; }
  .modal-footer {
    display: flex; gap: 12px; justify-content: flex-end;
    padding: 20px 28px; border-top: 1px solid var(--border);
  }

  /* ── FORM ── */
  .form-section { margin-bottom: 28px; }
  .form-section-title {
    font-size: 0.7rem; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase;
    color: var(--gold); margin-bottom: 14px; padding-bottom: 8px;
    border-bottom: 1px solid var(--border);
  }
  .form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 14px; }
  .form-group { display: flex; flex-direction: column; gap: 5px; }
  .form-label { font-size: 0.72rem; font-weight: 600; letter-spacing: 0.06em; color: var(--gray); text-transform: uppercase; }
  .form-input, .form-select, .form-textarea {
    padding: 10px 14px;
    background: var(--black-4); border: 1px solid var(--border); border-radius: 6px;
    color: var(--white); font-family: 'Montserrat', sans-serif; font-size: 0.85rem;
    outline: none; transition: border-color 0.2s;
    width: 100%;
  }
  .form-input:focus, .form-select:focus, .form-textarea:focus { border-color: var(--gold); }
  .form-textarea { resize: vertical; min-height: 80px; }

  /* ── CHECKLIST TABLE ── */
  .checklist-wrap { overflow-x: auto; }
  .checklist-table { width: 100%; border-collapse: collapse; font-size: 0.82rem; }
  .checklist-table th {
    padding: 10px 14px; text-align: left;
    font-size: 0.68rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--gold); border-bottom: 1px solid var(--border); background: var(--black-4);
  }
  .checklist-table td { padding: 10px 14px; border-bottom: 1px solid rgba(201,168,76,0.07); vertical-align: middle; }
  .checklist-table tr:hover td { background: rgba(201,168,76,0.04); }
  .cat-badge {
    padding: 2px 8px; border-radius: 3px; font-size: 0.62rem; font-weight: 700; letter-spacing: 0.08em;
    background: rgba(201,168,76,0.1); color: var(--gold-dark); border: 1px solid var(--border);
  }
  .status-btn {
    width: 32px; height: 32px; border-radius: 5px; border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center; transition: all 0.15s;
  }
  .status-btn-yes {
    background: rgba(39,174,96,0.1); color: #27ae60; border: 1px solid rgba(39,174,96,0.3);
  }
  .status-btn-yes.active { background: #27ae60; color: var(--white); }
  .status-btn-no {
    background: rgba(192,57,43,0.1); color: #c0392b; border: 1px solid rgba(192,57,43,0.3);
  }
  .status-btn-no.active { background: #c0392b; color: var(--white); }
  .status-btns { display: flex; gap: 6px; }
  .obs-inp {
    width: 100%; padding: 6px 10px;
    background: var(--black); border: 1px solid var(--border); border-radius: 4px;
    color: var(--white); font-family: 'Montserrat', sans-serif; font-size: 0.78rem;
    outline: none; transition: border-color 0.2s;
  }
  .obs-inp:focus { border-color: var(--gold); }

  /* ── BUTTONS ── */
  .btn {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 10px 22px; border-radius: 5px; border: none;
    font-family: 'Montserrat', sans-serif; font-size: 0.78rem; font-weight: 700;
    letter-spacing: 0.1em; text-transform: uppercase;
    cursor: pointer; transition: all 0.2s;
  }
  .btn-gold { background: var(--gold); color: var(--black); }
  .btn-gold:hover { background: var(--gold-light); transform: translateY(-1px); }
  .btn-outline { background: transparent; color: var(--gold); border: 1px solid var(--border); }
  .btn-outline:hover { border-color: var(--gold); background: rgba(201,168,76,0.08); }
  .btn-danger { background: var(--red); color: var(--white); }
  .btn-danger:hover { background: #e74c3c; }

  /* ── ABOUT PAGE ── */
  .about-hero {
    display: flex; gap: 48px; align-items: flex-start;
    padding: 40px 0; border-bottom: 1px solid var(--border); margin-bottom: 40px;
  }
  .about-photo-wrap {
    flex-shrink: 0;
    width: 180px; height: 220px; border-radius: 10px; overflow: hidden;
    border: 2px solid var(--gold);
    box-shadow: 0 0 40px rgba(201,168,76,0.2);
  }
  .about-photo { width: 100%; height: 100%; object-fit: cover; object-position: top; }
  .about-name {
    font-family: 'Cormorant Garamond', serif; font-size: 2.8rem; font-weight: 700;
    color: var(--white); line-height: 1; margin-bottom: 6px;
  }
  .about-title-role {
    font-size: 0.8rem; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase;
    color: var(--gold); margin-bottom: 16px;
  }
  .about-bio { font-size: 0.9rem; color: var(--gray-light); line-height: 1.8; margin-bottom: 20px; }
  .about-contacts { display: flex; gap: 12px; flex-wrap: wrap; }
  .contact-link {
    display: flex; align-items: center; gap: 7px;
    padding: 8px 16px; border-radius: 5px;
    background: var(--black-3); border: 1px solid var(--border);
    color: var(--gray-light); font-size: 0.78rem; font-weight: 500;
    text-decoration: none; transition: all 0.2s;
  }
  .contact-link:hover { border-color: var(--gold); color: var(--gold); }
  .about-skills-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 12px; margin-bottom: 40px; }
  .skill-card {
    background: var(--black-3); border: 1px solid var(--border); border-radius: 8px; padding: 16px 20px;
  }
  .skill-card-title { font-size: 0.72rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--gold); margin-bottom: 8px; }
  .skill-tag {
    display: inline-block; padding: 3px 10px; margin: 3px 3px 0 0; border-radius: 3px;
    font-size: 0.68rem; font-weight: 600;
    background: var(--black-4); color: var(--gray-light); border: 1px solid rgba(255,255,255,0.06);
  }
  .section-title {
    font-family: 'Cormorant Garamond', serif; font-size: 1.8rem; font-weight: 700;
    color: var(--white); margin-bottom: 20px;
  }
  .section-title span { color: var(--gold); }

  /* ── DECORATIVE DIVIDER ── */
  .gold-divider {
    height: 1px; background: linear-gradient(90deg, transparent, var(--gold), transparent);
    margin: 32px 0;
  }

  /* ── VIEW MODAL specifics ── */
  .view-section { margin-bottom: 24px; }
  .view-label { font-size: 0.65rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--gold); margin-bottom: 6px; }
  .view-value { font-size: 0.9rem; color: var(--white-2); }
  .view-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 12px; }

  /* ── FOOTER ── */
  .footer {
    border-top: 1px solid var(--border); padding: 20px 32px;
    display: flex; align-items: center; justify-content: space-between;
    font-size: 0.72rem; color: var(--gray); flex-wrap: wrap; gap: 10px;
  }
  .footer-brand { color: var(--gold); font-weight: 700; font-family: 'Cormorant Garamond', serif; font-size: 1rem; }

  /* ── RESPONSIVE ── */
  @media (max-width: 768px) {
    .nav { padding: 0 16px; }
    .nav-tabs { display: none; }
    .main { padding: 80px 16px 40px; }
    .stats-row { grid-template-columns: repeat(2, 1fr); }
    .project-grid { grid-template-columns: 1fr; }
    .about-hero { flex-direction: column; gap: 24px; }
    .about-photo-wrap { width: 140px; height: 170px; }
    .about-name { font-size: 2rem; }
    .modal-overlay { padding: 0; align-items: flex-end; }
    .modal { border-radius: 12px 12px 0 0; }
    .footer { justify-content: center; text-align: center; }
  }

  /* ── MOBILE NAV ── */
  .mobile-nav {
    display: none; position: fixed; bottom: 0; left: 0; right: 0; z-index: 100;
    background: var(--black-2); border-top: 1px solid var(--border);
    padding: 10px 16px; justify-content: space-around;
  }
  .mobile-nav-btn {
    display: flex; flex-direction: column; align-items: center; gap: 3px;
    background: none; border: none; cursor: pointer; color: var(--gray);
    font-size: 0.6rem; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase;
    transition: color 0.2s;
  }
  .mobile-nav-btn.active { color: var(--gold); }
  @media (max-width: 768px) {
    .mobile-nav { display: flex; }
    .main { padding-bottom: 90px; }
  }

  /* scrollbar */
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: var(--black); }
  ::-webkit-scrollbar-thumb { background: var(--gold-dark); border-radius: 3px; }

  /* confirm dialog */
  .confirm-overlay {
    position: fixed; inset: 0; z-index: 300;
    background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center;
  }
  .confirm-box {
    background: var(--black-2); border: 1px solid var(--border); border-radius: 10px;
    padding: 32px; max-width: 380px; width: 90%; text-align: center;
  }
  .confirm-title { font-family: 'Cormorant Garamond', serif; font-size: 1.4rem; color: var(--white); margin-bottom: 10px; }
  .confirm-msg { font-size: 0.85rem; color: var(--gray); margin-bottom: 24px; }
  .confirm-btns { display: flex; gap: 12px; justify-content: center; }

  .toast {
    position: fixed; bottom: 80px; right: 24px; z-index: 400;
    background: var(--black-3); border: 1px solid var(--gold);
    border-radius: 8px; padding: 12px 20px;
    font-size: 0.82rem; color: var(--gold); font-weight: 600;
    animation: fadeIn 0.3s ease, fadeOut 0.3s ease 2.5s forwards;
  }
  @keyframes fadeIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeOut { to { opacity:0; transform:translateY(10px); } }
`;

// ── UTIL ───────────────────────────────────────────────────────────────────
function calcProgress(checklist) {
  const yes = checklist.filter(i => i.status === "yes").length;
  return Math.round((yes / checklist.length) * 100);
}
function statusClass(status) {
  if (status === "Rodando") return "status-running";
  if (status === "Pausado") return "status-paused";
  return "status-progress";
}
function formatDate(d) {
  if (!d) return "—";
  const [y, m, day] = d.split("-");
  return `${day}/${m}/${y}`;
}

// ── PHOTO DATA URI ─────────────────────────────────────────────────────────
// We'll load the uploaded photo as a data URI
let photoDataUri = null;
async function loadPhoto() {
  try {
    const res = await fetch("/mnt/user-data/uploads/FOTO_3X4_-_LIENYS_R_CARVALHO.jpg");
    const blob = await res.blob();
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  } catch { return null; }
}

// ── MAIN APP ───────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [projects, setProjects] = useState(() => {
    try { return JSON.parse(localStorage.getItem("lc_projects") || "[]"); }
    catch { return []; }
  });
  const [modal, setModal] = useState(null); // null | "new" | "edit" | "view"
  const [current, setCurrent] = useState(null);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("Todos");
  const [filterStatus, setFilterStatus] = useState("Todos");
  const [confirm, setConfirm] = useState(null);
  const [toast, setToast] = useState(null);
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    loadPhoto().then(d => { if (d) setPhoto(d); });
  }, []);

  const showToast = msg => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const save = (list) => {
    localStorage.setItem("lc_projects", JSON.stringify(list));
    setProjects(list);
  };

  const openNew = () => { setCurrent(emptyProject()); setModal("new"); };
  const openEdit = (p, e) => { e?.stopPropagation(); setCurrent({ ...p, checklist: p.checklist.map(i => ({ ...i })) }); setModal("edit"); };
  const openView = (p) => { setCurrent(p); setModal("view"); };
  const closeModal = () => { setModal(null); setCurrent(null); };

  const saveProject = () => {
    if (!current.title.trim()) { showToast("⚠ Informe o título do projeto"); return; }
    let updated;
    if (modal === "new") {
      updated = [current, ...projects];
    } else {
      updated = projects.map(p => p.id === current.id ? current : p);
    }
    save(updated);
    closeModal();
    showToast(modal === "new" ? "✓ Projeto criado com sucesso!" : "✓ Projeto atualizado!");
  };

  const deleteProject = (id) => {
    setConfirm({
      msg: "Esta ação não pode ser desfeita.",
      onConfirm: () => {
        save(projects.filter(p => p.id !== id));
        setConfirm(null);
        showToast("Projeto removido.");
      }
    });
  };

  const updateField = (field, val) => setCurrent(c => ({ ...c, [field]: val }));
  const updateCheck = (idx, field, val) => setCurrent(c => {
    const checklist = c.checklist.map((item, i) => i === idx ? { ...item, [field]: val } : item);
    return { ...c, checklist };
  });

  // filters
  const filtered = projects.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
      (p.area || "").toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === "Todos" || p.type === filterType;
    const matchStatus = filterStatus === "Todos" || p.status === filterStatus;
    return matchSearch && matchType && matchStatus;
  });

  // stats
  const total = projects.length;
  const running = projects.filter(p => p.status === "Rodando").length;
  const avgProgress = total ? Math.round(projects.reduce((s, p) => s + calcProgress(p.checklist), 0) / total) : 0;
  const types = [...new Set(projects.map(p => p.type))].length;

  return (
    <>
      <style>{css}</style>
      <div className="app">
        {/* NAV */}
        <nav className="nav">
          <div className="nav-logo">
            LC <span>Consultoria</span>
          </div>
          <div className="nav-tabs">
            {[["dashboard","Dashboard"],["about","Sobre"]].map(([t, l]) => (
              <button key={t} className={`nav-tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>{l}</button>
            ))}
          </div>
          <button className="nav-new-btn" onClick={openNew}>
            <Icons.Plus /> Novo Projeto
          </button>
        </nav>

        {/* MAIN */}
        <main className="main">
          {tab === "dashboard" && (
            <>
              {/* STATS */}
              <div className="stats-row">
                {[
                  { val: total, label: "Total de Projetos" },
                  { val: running, label: "Em Produção" },
                  { val: `${avgProgress}%`, label: "Progresso Médio" },
                  { val: types || 0, label: "Tipos Distintos" },
                ].map((s, i) => (
                  <div className="stat-card" key={i}>
                    <div className="stat-val">{s.val}</div>
                    <div className="stat-label">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* FILTERS */}
              <div className="filter-bar">
                <div className="search-wrap">
                  <Icons.Search />
                  <input className="search-inp" placeholder="Buscar projeto..." value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <select className="filter-select" value={filterType} onChange={e => setFilterType(e.target.value)}>
                  <option>Todos</option>
                  {PROJECT_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
                <select className="filter-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                  {["Todos","Em Andamento","Rodando","Pausado"].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>

              {/* GRID */}
              <div className="project-grid">
                {filtered.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon"><Icons.Rocket /></div>
                    <div className="empty-title">Nenhum projeto encontrado</div>
                    <div style={{ fontSize: "0.85rem", marginTop: 8 }}>
                      {projects.length === 0 ? "Clique em \"Novo Projeto\" para começar!" : "Tente ajustar os filtros."}
                    </div>
                  </div>
                ) : filtered.map(p => {
                  const progress = calcProgress(p.checklist);
                  return (
                    <div className="project-card" key={p.id} onClick={() => openView(p)}>
                      <div className="card-top">
                        <span className="card-type-badge">{p.type}</span>
                        <div className="card-actions" onClick={e => e.stopPropagation()}>
                          <button className="card-action-btn" title="Editar" onClick={e => openEdit(p, e)}><Icons.Edit /></button>
                          <button className="card-action-btn danger" title="Excluir" onClick={e => { e.stopPropagation(); deleteProject(p.id); }}><Icons.Trash /></button>
                        </div>
                      </div>
                      <div className="card-title">{p.title}</div>
                      <div className="card-area">{p.area || "—"}</div>
                      <div className="progress-bar-wrap">
                        <div className="progress-label">
                          <span>Progresso do Checklist</span>
                          <span style={{ color: "var(--gold)", fontWeight: 700 }}>{progress}%</span>
                        </div>
                        <div className="progress-track">
                          <div className="progress-fill" style={{ width: `${progress}%` }} />
                        </div>
                      </div>
                      <div>
                        <span className={`card-status-badge ${statusClass(p.status)}`}>
                          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "currentColor", display: "inline-block" }} />
                          {p.status}
                        </span>
                      </div>
                      <div className="card-meta">
                        {p.ia && <span className="card-meta-item"><Icons.Star /> {p.ia}</span>}
                        <span className="card-meta-item" style={{ marginLeft: "auto" }}>{formatDate(p.createdAt)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {tab === "about" && <AboutPage photo={photo} />}
        </main>

        {/* MOBILE NAV */}
        <div className="mobile-nav">
          {[["dashboard","Dashboard",<Icons.Grid />],["about","Sobre",<Icons.User />]].map(([t,l,ic]) => (
            <button key={t} className={`mobile-nav-btn ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>
              {ic}{l}
            </button>
          ))}
          <button className="mobile-nav-btn" onClick={openNew} style={{ color: "var(--gold)" }}>
            <Icons.Plus />Novo
          </button>
        </div>

        {/* FOOTER */}
        <footer className="footer">
          <div>
            <span className="footer-brand">LC Consultoria de Negócios</span>
            <span style={{ marginLeft: 12 }}>© {new Date().getFullYear()} • Todos os direitos reservados</span>
          </div>
          <div style={{ display: "flex", gap: 16, color: "var(--gray)", fontSize: "0.72rem" }}>
            <span>contato@lcconsultorianegocios.com.br</span>
            <span>(21) 98482-1444</span>
          </div>
        </footer>

        {/* MODALS */}
        {(modal === "new" || modal === "edit") && current && (
          <ProjectFormModal
            project={current}
            isNew={modal === "new"}
            onClose={closeModal}
            onSave={saveProject}
            updateField={updateField}
            updateCheck={updateCheck}
          />
        )}
        {modal === "view" && current && (
          <ViewModal project={current} onClose={closeModal} onEdit={() => openEdit(current)} />
        )}

        {/* CONFIRM */}
        {confirm && (
          <div className="confirm-overlay">
            <div className="confirm-box">
              <div className="confirm-title">Excluir Projeto?</div>
              <div className="confirm-msg">{confirm.msg}</div>
              <div className="confirm-btns">
                <button className="btn btn-outline" onClick={() => setConfirm(null)}>Cancelar</button>
                <button className="btn btn-danger" onClick={confirm.onConfirm}>Excluir</button>
              </div>
            </div>
          </div>
        )}

        {/* TOAST */}
        {toast && <div className="toast">{toast}</div>}
      </div>
    </>
  );
}

// ── PROJECT FORM MODAL ─────────────────────────────────────────────────────
function ProjectFormModal({ project, isNew, onClose, onSave, updateField, updateCheck }) {
  const categories = [...new Set(CHECKLIST_TEMPLATE.map(i => i.category))];
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">{isNew ? "Novo Projeto" : "Editar Projeto"}</div>
          <button className="modal-close" onClick={onClose}><Icons.Close /></button>
        </div>
        <div className="modal-body" style={{ maxHeight: "70vh", overflowY: "auto" }}>

          {/* DETALHES GERAIS */}
          <div className="form-section">
            <div className="form-section-title">Detalhes Gerais</div>
            <div className="form-grid">
              <div className="form-group" style={{ gridColumn: "1/-1" }}>
                <label className="form-label">Título do Projeto *</label>
                <input className="form-input" value={project.title} onChange={e => updateField("title", e.target.value)} placeholder="Ex: GastroMetrics SaaS" />
              </div>
              <div className="form-group">
                <label className="form-label">Área de Atuação</label>
                <input className="form-input" value={project.area} onChange={e => updateField("area", e.target.value)} placeholder="Ex: Gastronomia, Saúde..." />
              </div>
              <div className="form-group">
                <label className="form-label">Tipo</label>
                <select className="form-select" value={project.type} onChange={e => updateField("type", e.target.value)}>
                  {PROJECT_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select className="form-select" value={project.status} onChange={e => updateField("status", e.target.value)}>
                  {["Em Andamento","Rodando","Pausado"].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Data de Início</label>
                <input type="date" className="form-input" value={project.createdAt} onChange={e => updateField("createdAt", e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">IA Utilizada (Build)</label>
                <select className="form-select" value={project.ia} onChange={e => updateField("ia", e.target.value)}>
                  <option value="">Selecione...</option>
                  {IA_OPTIONS.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Endereço do Site (URL)</label>
                <input className="form-input" value={project.url} onChange={e => updateField("url", e.target.value)} placeholder="https://..." />
              </div>
              <div className="form-group">
                <label className="form-label">Repositório</label>
                <input className="form-input" value={project.repo} onChange={e => updateField("repo", e.target.value)} placeholder="github.com/..." />
              </div>
              <div className="form-group">
                <label className="form-label">Local do Deploy</label>
                <select className="form-select" value={project.deploy} onChange={e => updateField("deploy", e.target.value)}>
                  <option value="">Selecione...</option>
                  {DEPLOY_OPTIONS.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">E-mail Utilizado</label>
                <input className="form-input" value={project.email} onChange={e => updateField("email", e.target.value)} placeholder="projeto@email.com" />
              </div>
            </div>
          </div>

          {/* PÁGINAS */}
          <div className="form-section">
            <div className="form-section-title">Páginas Presentes</div>
            <div className="form-group">
              <textarea className="form-textarea" value={project.pages} onChange={e => updateField("pages", e.target.value)}
                placeholder="Liste as páginas do projeto (ex: Home, Dashboard, Login, Sobre, Contato...)" />
            </div>
          </div>

          {/* CHECKLIST */}
          <div className="form-section">
            <div className="form-section-title">
              Lista de Verificação — {calcProgress(project.checklist)}% Completo
            </div>
            <div style={{ marginBottom: 10 }}>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${calcProgress(project.checklist)}%` }} />
              </div>
            </div>
            <div className="checklist-wrap">
              <table className="checklist-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Item</th>
                    <th>Categoria</th>
                    <th style={{ textAlign: "center" }}>S / N</th>
                    <th>Observações</th>
                  </tr>
                </thead>
                <tbody>
                  {project.checklist.map((item, idx) => (
                    <tr key={item.id}>
                      <td style={{ color: "var(--gray)", fontSize: "0.72rem" }}>{idx + 1}</td>
                      <td style={{ fontWeight: 600, color: "var(--white-2)", whiteSpace: "nowrap" }}>{item.label}</td>
                      <td><span className="cat-badge">{item.category}</span></td>
                      <td>
                        <div className="status-btns" style={{ justifyContent: "center" }}>
                          <button
                            className={`status-btn status-btn-yes ${item.status === "yes" ? "active" : ""}`}
                            onClick={() => updateCheck(idx, "status", item.status === "yes" ? null : "yes")}
                            title="Sim"
                          ><Icons.Check /></button>
                          <button
                            className={`status-btn status-btn-no ${item.status === "no" ? "active" : ""}`}
                            onClick={() => updateCheck(idx, "status", item.status === "no" ? null : "no")}
                            title="Não"
                          ><Icons.X /></button>
                        </div>
                      </td>
                      <td>
                        <input className="obs-inp" value={item.obs} onChange={e => updateCheck(idx, "obs", e.target.value)} placeholder="Adicionar nota..." />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* NOTAS */}
          <div className="form-section">
            <div className="form-section-title">Notas Adicionais</div>
            <div className="form-group">
              <textarea className="form-textarea" value={project.notes} onChange={e => updateField("notes", e.target.value)} placeholder="Observações gerais, links importantes, decisões técnicas..." style={{ minHeight: 100 }} />
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose}><Icons.Close /> Cancelar</button>
          <button className="btn btn-gold" onClick={onSave}><Icons.Save /> {isNew ? "Criar Projeto" : "Salvar Alterações"}</button>
        </div>
      </div>
    </div>
  );
}

// ── VIEW MODAL ─────────────────────────────────────────────────────────────
function ViewModal({ project, onClose, onEdit }) {
  const progress = calcProgress(project.checklist);
  const yes = project.checklist.filter(i => i.status === "yes").length;
  const no = project.checklist.filter(i => i.status === "no").length;
  const pending = project.checklist.filter(i => i.status === null).length;

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div>
            <div style={{ fontSize: "0.65rem", letterSpacing: "0.15em", color: "var(--gold)", textTransform: "uppercase", fontWeight: 700, marginBottom: 4 }}>{project.type}</div>
            <div className="modal-title">{project.title}</div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-outline" style={{ padding: "8px 14px" }} onClick={onEdit}><Icons.Edit /> Editar</button>
            <button className="modal-close" onClick={onClose}><Icons.Close /></button>
          </div>
        </div>
        <div className="modal-body" style={{ maxHeight: "75vh", overflowY: "auto" }}>

          {/* PROGRESS SUMMARY */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10, marginBottom: 24 }}>
            {[
              { val: `${progress}%`, label: "Concluído", color: "var(--gold)" },
              { val: yes, label: "Concluídos", color: "#27ae60" },
              { val: no, label: "Pendentes/Não", color: "#e74c3c" },
              { val: pending, label: "Não avaliados", color: "var(--gray)" },
            ].map((s, i) => (
              <div key={i} style={{ background: "var(--black-4)", border: "1px solid var(--border)", borderRadius: 7, padding: "12px 14px" }}>
                <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.6rem", fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.val}</div>
                <div style={{ fontSize: "0.65rem", color: "var(--gray)", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginTop: 3 }}>{s.label}</div>
              </div>
            ))}
          </div>
          <div className="progress-track" style={{ marginBottom: 24 }}>
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>

          {/* INFO GRID */}
          <div className="view-grid" style={{ marginBottom: 24 }}>
            {[
              { label: "Área", val: project.area || "—" },
              { label: "IA Utilizada", val: project.ia || "—" },
              { label: "Deploy", val: project.deploy || "—" },
              { label: "Data de Início", val: formatDate(project.createdAt) },
              { label: "Status", val: project.status },
              { label: "E-mail", val: project.email || "—" },
            ].map((f, i) => (
              <div key={i} style={{ background: "var(--black-4)", border: "1px solid var(--border)", borderRadius: 7, padding: "12px 14px" }}>
                <div className="view-label">{f.label}</div>
                <div className="view-value" style={{ fontSize: "0.85rem" }}>{f.val}</div>
              </div>
            ))}
          </div>

          {project.url && (
            <div style={{ marginBottom: 20 }}>
              <div className="view-label">URL do Projeto</div>
              <a href={project.url} target="_blank" rel="noreferrer"
                style={{ color: "var(--gold)", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: 6 }}>
                <Icons.Globe /> {project.url}
              </a>
            </div>
          )}
          {project.repo && (
            <div style={{ marginBottom: 20 }}>
              <div className="view-label">Repositório</div>
              <a href={`https://${project.repo.replace(/^https?:\/\//,"")}`} target="_blank" rel="noreferrer"
                style={{ color: "var(--gold)", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: 6 }}>
                <Icons.Github /> {project.repo}
              </a>
            </div>
          )}

          <div className="gold-divider" />

          {/* CHECKLIST VIEW */}
          <div style={{ marginBottom: 24 }}>
            <div className="form-section-title" style={{ marginBottom: 14 }}>Lista de Verificação</div>
            <div className="checklist-wrap">
              <table className="checklist-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Categoria</th>
                    <th style={{ textAlign: "center" }}>Status</th>
                    <th>Observação</th>
                  </tr>
                </thead>
                <tbody>
                  {project.checklist.map((item, idx) => (
                    <tr key={item.id}>
                      <td style={{ fontWeight: 600, fontSize: "0.82rem", color: "var(--white-2)" }}>{item.label}</td>
                      <td><span className="cat-badge">{item.category}</span></td>
                      <td style={{ textAlign: "center" }}>
                        {item.status === "yes" && <span style={{ color: "#27ae60", fontSize: "0.75rem", fontWeight: 700 }}>✓ SIM</span>}
                        {item.status === "no" && <span style={{ color: "#e74c3c", fontSize: "0.75rem", fontWeight: 700 }}>✗ NÃO</span>}
                        {item.status === null && <span style={{ color: "var(--gray)", fontSize: "0.75rem" }}>—</span>}
                      </td>
                      <td style={{ fontSize: "0.78rem", color: "var(--gray-light)" }}>{item.obs || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {project.pages && (
            <div style={{ marginBottom: 20 }}>
              <div className="view-label">Páginas do Projeto</div>
              <div style={{ fontSize: "0.85rem", color: "var(--white-2)", lineHeight: 1.7 }}>{project.pages}</div>
            </div>
          )}
          {project.notes && (
            <div>
              <div className="view-label">Notas Adicionais</div>
              <div style={{ fontSize: "0.85rem", color: "var(--white-2)", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{project.notes}</div>
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose}>Fechar</button>
          <button className="btn btn-gold" onClick={onEdit}><Icons.Edit /> Editar Projeto</button>
        </div>
      </div>
    </div>
  );
}

// ── ABOUT PAGE ─────────────────────────────────────────────────────────────
function AboutPage({ photo }) {
  return (
    <div>
      <div className="about-hero">
        <div className="about-photo-wrap">
          {photo
            ? <img src={photo} alt="Lienys Carvalho" className="about-photo" />
            : <div style={{ width: "100%", height: "100%", background: "var(--black-3)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--gold)" }}><Icons.User /></div>
          }
        </div>
        <div>
          <div className="about-name">Lienys Carvalho</div>
          <div className="about-title-role">Gerente · Auditor · Especialista em IA & Dados · Consultor de Negócios</div>
          <div className="about-bio">
            Profissional com mais de 25 anos de experiência consolidada em Gestão Operacional, Auditorias, Compliance e Projetos nas indústrias de telecomunicações e tecnologia. Atuou em empresas nacionais e multinacionais de grande porte, liderando equipes e processos distribuídos em 18 estados brasileiros.<br /><br />
            MBA em Inteligência Artificial, Estratégia de Dados e Eficiência Organizacional (FIASP), com certificações em ISO 9001, ISO 27001, ISO 27701, metodologias ágeis (Scrum e Kanban), Power BI, Python, Agentes de IA e construção de aplicações com IA — combinando expertise técnica com visão estratégica de negócios para criar soluções digitais de alto impacto.
          </div>
          <div className="about-contacts">
            <a className="contact-link" href="mailto:contato@lcconsultorianegocios.com.br"><Icons.Mail />contato@lcconsultorianegocios.com.br</a>
            <a className="contact-link" href="https://wa.me/5521984821444" target="_blank" rel="noreferrer"><Icons.Whatsapp />(21) 98482-1444</a>
            <a className="contact-link" href="https://www.linkedin.com/in/lienyscarvalho/" target="_blank" rel="noreferrer"><Icons.Linkedin />LinkedIn</a>
          </div>
        </div>
      </div>

      <div className="section-title" style={{ marginBottom: 20 }}>Competências & <span>Especialidades</span></div>
      <div className="about-skills-grid">
        {[
          { title: "Gestão & Liderança", tags: ["Gestão Operacional", "PMO", "Equipes Remotas", "18 UFs", "Liderança"] },
          { title: "Auditoria & Compliance", tags: ["ISO 9001", "ISO 27001", "ISO 27701", "LGPD", "Riscos Operacionais"] },
          { title: "IA & Dados", tags: ["Agentes de IA", "Power BI", "Python", "SQL", "Data Lake", "Power Apps"] },
          { title: "Metodologias Ágeis", tags: ["Scrum", "Kanban", "Agile Coach", "Design Thinking", "SAP ERP"] },
          { title: "Tecnologia & Build", tags: ["React", "Sites", "SaaS", "APPs", "Landing Pages", "Vercel"] },
          { title: "Formação", tags: ["MBA IA (FIASP)", "MBA Auditoria", "Pós Compliance PUC/MG", "Pós Projetos Ágeis"] },
        ].map((s, i) => (
          <div className="skill-card" key={i}>
            <div className="skill-card-title">{s.title}</div>
            {s.tags.map(t => <span className="skill-tag" key={t}>{t}</span>)}
          </div>
        ))}
      </div>

      <div className="gold-divider" />

      <div className="section-title" style={{ marginBottom: 20 }}>Experiência <span>Profissional</span></div>
      {[
        {
          company: "Serede Serviços de Rede S/A",
          period: "2012 – 2024",
          roles: [
            { title: "Gerente Corporativo de Auditorias", period: "2019–2024" },
            { title: "Coordenador Geral de Auditorias e Processos", period: "2017–2019" },
            { title: "Coordenador de Auditorias e Compliance", period: "2015–2017" },
            { title: "Coordenador de Projetos – PMO", period: "2014–2015" },
            { title: "Coordenador de T&D", period: "2012–2014" },
          ],
          highlight: "Liderança da Copa do Mundo 2014 — infraestrutura de telecom para todos os estádios envolvidos.",
        },
        {
          company: "Nokia Siemens Networks",
          period: "2008 – 2012",
          roles: [{ title: "Auditor de Qualidade", period: "2008–2012" }],
          highlight: "Criação do Projeto de Formação e Desenvolvimento de Líderes NSN e implantação do SIGQ.",
        },
      ].map((exp, i) => (
        <div key={i} style={{ background: "var(--black-3)", border: "1px solid var(--border)", borderRadius: 10, padding: "20px 24px", marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10, flexWrap: "wrap", gap: 8 }}>
            <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.2rem", fontWeight: 700, color: "var(--white)" }}>{exp.company}</div>
            <div style={{ fontSize: "0.72rem", color: "var(--gold)", fontWeight: 700, letterSpacing: "0.1em" }}>{exp.period}</div>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
            {exp.roles.map((r, j) => (
              <span key={j} style={{ padding: "3px 10px", borderRadius: 3, background: "rgba(201,168,76,0.1)", color: "var(--gold-light)", fontSize: "0.72rem", fontWeight: 600, border: "1px solid var(--border)" }}>
                {r.title} <span style={{ color: "var(--gray)", marginLeft: 4 }}>{r.period}</span>
              </span>
            ))}
          </div>
          <div style={{ fontSize: "0.82rem", color: "var(--gray-light)", lineHeight: 1.6 }}>
            ⭐ {exp.highlight}
          </div>
        </div>
      ))}

      <div className="gold-divider" />

      <div style={{ textAlign: "center", padding: "20px 0" }}>
        <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.1rem", color: "var(--gold)", marginBottom: 16 }}>
          LC Consultoria de Negócios
        </div>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <a className="contact-link" href="mailto:contato@lcconsultorianegocios.com.br"><Icons.Mail />contato@lcconsultorianegocios.com.br</a>
          <a className="contact-link" href="https://wa.me/5521984821444" target="_blank" rel="noreferrer"><Icons.Whatsapp />(21) 98482-1444</a>
          <a className="contact-link" href="https://www.linkedin.com/in/lienyscarvalho/" target="_blank" rel="noreferrer"><Icons.Linkedin />linkedin.com/in/lienyscarvalho</a>
        </div>
      </div>
    </div>
  );
}
