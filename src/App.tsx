
import { useCallback, useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { Award, Check, ChevronRight, Code2, ExternalLink, FileText, Github, Globe2, GraduationCap, ImagePlus, LayoutDashboard, Linkedin, LogOut, Mail, Menu, Plus, Save, Send, Sparkles, Trash2, UserRound, X, Zap } from 'lucide-react';
import { supabase } from '@/lib/supabase';

type Template = 'classic-dark' | 'clean-light' | 'aurora-gradient';
type SectionKey = 'profile' | 'skills' | 'achievements' | 'certifications' | 'projects' | 'leadership' | 'education' | 'contact';

type PortfolioContent = {
  fullName: string;
  headline: string;
  about: string;
  email: string;
  location: string;
  photo: string;
  username: string;
  skills: string[];
  achievements: string[];
  certifications: string[];
  projects: { title: string; description: string; tech: string; link: string; image: string }[];
  leadership: string[];
  education: { school: string; degree: string; year: string }[];
  contact: { github: string; linkedin: string; website: string };
};

type PortfolioRow = {
  id: string;
  user_id: string;
  username: string;
  content: PortfolioContent;
  template: Template;
  published: boolean;
  updated_at: string;
  title?: string;
  slug?: string;
  data?: PortfolioContent;
};

const emptyContent: PortfolioContent = {
  fullName: '',
  headline: '',
  about: '',
  email: '',
  location: '',
  photo: '',
  username: '',
  skills: [],
  achievements: [],
  certifications: [],
  projects: [],
  leadership: [],
  education: [],
  contact: { github: '', linkedin: '', website: '' },
};

const starterContent: PortfolioContent = {
  ...emptyContent,
  fullName: 'Your Name',
  headline: 'Creative developer & curious builder',
  about: 'Tell the world what you care about, what you build, and where you are heading next.',
  email: 'hello@example.com',
  location: 'Mumbai, India',
  skills: ['React', 'TypeScript', 'Product Design'],
  achievements: ['Built a community project used by 500+ students'],
  certifications: ['Google UX Design Professional Certificate'],
  projects: [{
    title: 'Your signature project',
    description: 'A concise story about the problem you solved and the impact it made.',
    tech: 'React, TypeScript',
    link: '',
    image: '',
  }],
  leadership: ['Led the campus technology club for 2 years'],
  education: [{ school: 'University Name', degree: 'B.Tech in Computer Science', year: '2022 — 2026' }],
  contact: { github: 'github.com/yourname', linkedin: 'linkedin.com/in/yourname', website: '' },
};

const templates: { id: Template; name: string; kicker: string; colors: string }[] = [
  { id: 'classic-dark', name: 'Classic Dark', kicker: 'Sharp & focused', colors: 'from-slate-950 via-slate-900 to-cyan-950' },
  { id: 'clean-light', name: 'Clean Light', kicker: 'Quiet confidence', colors: 'from-stone-100 via-white to-cyan-50' },
  { id: 'aurora-gradient', name: 'Aurora Gradient', kicker: 'Bold & expressive', colors: 'from-cyan-950 via-teal-800 to-emerald-500' },
];

const readFile = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

function AuthScreen() {
  const [mode, setMode] = useState<'login' | 'register'>('register');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    setNotice('');

    if (mode === 'register' && !form.name.trim()) {
      setError('Please enter your full name.');
      setBusy(false);
      return;
    }

    try {
      const result = mode === 'register'
        ? await supabase.auth.signUp({
            email: form.email,
            password: form.password,
            options: { data: { full_name: form.name } },
          })
        : await supabase.auth.signInWithPassword({
            email: form.email,
            password: form.password,
          });

      if (result.error) {
        setError(result.error.message);
      } else if (mode === 'register' && !result.data.session) {
        setNotice('Account created. You can now log in to start building.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="auth-shell">
      <section className="auth-story">
        <div className="brand-mark"><span className="brand-orbit"><Zap size={16} /></span> MYPORTFOLIO<span className="brand-dot">.COM</span></div>
        <div className="story-copy">
          <p className="eyebrow">YOUR WORK. YOUR STORY. YOUR SPACE.</p>
          <h1>A portfolio that feels like <em>you.</em></h1>
          <p>Bring your projects, ambitions, and personality together in one polished home on the internet.</p>
          <div className="story-proof">
            <span><Check size={15} /> Live preview</span>
            <span><Check size={15} /> One-click publish</span>
            <span><Check size={15} /> Your own link</span>
          </div>
        </div>
        <div className="story-grid"><div></div><div></div><div></div></div>
      </section>

      <section className="auth-card-wrap">
        <div className="auth-card">
          <div className="mobile-brand brand-mark"><span className="brand-orbit"><Zap size={16} /></span> MYPORTFOLIO<span className="brand-dot">.COM</span></div>
          <div className="auth-tabs">
            <button type="button" className={mode === 'register' ? 'active' : ''} onClick={() => setMode('register')}>Create account</button>
            <button type="button" className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')}>Log in</button>
          </div>
          <div className="auth-heading">
            <p className="eyebrow">{mode === 'register' ? 'START BUILDING' : 'WELCOME BACK'}</p>
            <h2>{mode === 'register' ? 'Make your mark.' : 'Pick up where you left off.'}</h2>
            <p>{mode === 'register' ? 'Your future self will thank you.' : 'Your portfolio is ready when you are.'}</p>
          </div>
          <form onSubmit={submit}>
            {mode === 'register' && <label>Full name<input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Aarav Mehta" /></label>}
            <label>Email address<input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" /></label>
            <label>Password<input type="password" minLength={6} required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="At least 6 characters" /></label>
            {error && <p className="form-error">{error}</p>}
            {notice && <p className="form-notice">{notice}</p>}
            <button className="primary-button full" disabled={busy}>{busy ? 'Please wait…' : mode === 'register' ? 'Create my portfolio' : 'Enter my workspace'} <ChevronRight size={17} /></button>
          </form>
          <p className="auth-foot">By continuing, you agree to create a public-ready portfolio. You control when it goes live.</p>
        </div>
      </section>
    </main>
  );
}

function ImagePicker({ value, onChange, label = 'Upload image' }: { value: string; onChange: (value: string) => void; label?: string }) {
  const handle = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) onChange(await readFile(file));
  };

  return (
    <label className="upload-box">
      {value ? <img src={value} alt="Selected upload" /> : <ImagePlus size={20} />}
      <span>{value ? 'Change image' : label}</span>
      <input type="file" accept="image/*,.jpg,.jpeg,.png,.webp,.gif,.svg" onChange={handle} />
    </label>
  );
}

function Preview({ content, template, publicView = false }: { content: PortfolioContent; template: Template; publicView?: boolean }) {
  const dark = template !== 'clean-light';

  return (
    <div className={`portfolio-preview ${template} ${publicView ? 'public-preview' : ''}`}>
      <div className="preview-top">
        <span className="preview-brand">MYPORTFOLIO<span>.COM</span></span>
        {!publicView && <span className="preview-mode">LIVE PREVIEW</span>}
      </div>
      <div className="hero-block">
        <div className="hero-text">
          <p className="eyebrow">{content.headline || 'YOUR NEXT CHAPTER'}</p>
          <h1>{content.fullName || 'Your Name'}</h1>
          <p className="hero-about">{content.about || 'Your story starts here.'}</p>
          <div className="preview-links">
            {content.contact.github && <a href={`https://${content.contact.github}`}><Github size={15} /> GitHub</a>}
            {content.contact.linkedin && <a href={`https://${content.contact.linkedin}`}><Linkedin size={15} /> LinkedIn</a>}
            {content.email && <a href={`mailto:${content.email}`}><Mail size={15} /> Say hello</a>}
          </div>
        </div>
        {content.photo ? <img className="hero-photo" src={content.photo} alt={content.fullName} /> : <div className="hero-initials">{(content.fullName || 'YN').split(' ').map(word => word[0]).join('').slice(0, 2)}</div>}
      </div>
      <div className="preview-content">
        <div><p className="section-label">01 / ABOUT</p><p className="preview-copy">{content.about || 'Add a short introduction from the Profile section.'}</p></div>
        <div><p className="section-label">02 / TOOLKIT</p><div className="preview-pills">{content.skills.map(skill => <span key={skill}>{skill}</span>)}</div></div>
        <div className="preview-projects">
          <p className="section-label">03 / SELECTED WORK</p>
          {content.projects.map((project, index) => (
            <article className="preview-project" key={`${project.title}-${index}`}>
              {project.image && <img src={project.image} alt="" />}
              <div><span>0{index + 1}</span><h3>{project.title}</h3><p>{project.description}</p><small>{project.tech}</small></div>
              {project.link && <a href={project.link} target="_blank" rel="noreferrer" aria-label={`Open ${project.title}`}><ExternalLink size={17} /></a>}
            </article>
          ))}
        </div>
        <div className="preview-bottom"><span>{content.location || 'Everywhere'}</span><span>{content.education[0]?.degree || 'Always learning'}</span></div>
      </div>
      {dark && <div className="preview-glow" />}
    </div>
  );
}

function Editor({ portfolio, onSave, onLogout }: {
  portfolio: PortfolioRow;
  onSave: (content: PortfolioContent, template: Template, published: boolean, username: string) => Promise<void>;
  onLogout: () => Promise<void>;
}) {
  const [content, setContent] = useState(portfolio.content || starterContent);
  const [template, setTemplate] = useState<Template>(portfolio.template || 'classic-dark');
  const [published, setPublished] = useState(portfolio.published ?? false);
  const [username, setUsername] = useState(portfolio.username || portfolio.slug || '');
  const [section, setSection] = useState<SectionKey>('profile');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(true);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [toast, setToast] = useState('');

  const save = useCallback(async (announce = true, nextPublished = published) => {
    setSaving(true);
    try {
      await onSave(content, template, nextPublished, username);
      setSaved(true);
      if (announce) setToast(nextPublished ? 'Your portfolio is live.' : 'Changes saved.');
    } catch (error) {
      console.error('Save failed:', error);
      setToast('Save failed. Check the console for details.');
    } finally {
      setSaving(false);
    }
  }, [content, onSave, published, template, username]);

  useEffect(() => {
    if (saved) return;
    const timer = window.setTimeout(() => { void save(false); }, 1500);
    return () => window.clearTimeout(timer);
  }, [content, published, save, saved, template, username]);

  const update = (patch: Partial<PortfolioContent>) => {
    setContent(previous => ({ ...previous, ...patch }));
    setSaved(false);
  };

  const setArray = (key: 'skills' | 'achievements' | 'certifications' | 'leadership', value: string) => {
    update({ [key]: value.split('\n').map(item => item.trim()).filter(Boolean) } as Partial<PortfolioContent>);
  };

  const nav: { key: SectionKey; label: string; icon: typeof UserRound }[] = [
    { key: 'profile', label: 'Profile', icon: UserRound },
    { key: 'skills', label: 'Skills', icon: Code2 },
    { key: 'achievements', label: 'Achievements', icon: Award },
    { key: 'certifications', label: 'Certifications', icon: FileText },
    { key: 'projects', label: 'Projects', icon: LayoutDashboard },
    { key: 'leadership', label: 'Leadership', icon: Zap },
    { key: 'education', label: 'Education', icon: GraduationCap },
    { key: 'contact', label: 'Contact', icon: Globe2 },
  ];

  const currentLabel = nav.find(item => item.key === section)?.label;

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="menu-button" onClick={() => setMobileMenu(!mobileMenu)}><Menu size={21} /></button>
        <div className="brand-mark"><span className="brand-orbit"><Zap size={14} /></span> MYPORTFOLIO<span className="brand-dot">.COM</span></div>
        <div className="topbar-actions">
          <span className={`save-status ${saved ? 'saved' : ''}`}>{saving ? 'Saving…' : saved ? <><Check size={14} /> Saved</> : <span className="saving-dot" />}{!saving && !saved ? 'Typing…' : ''}</span>
          {published && username && <a className="ghost-button live-link" href={`/u/${username}`} target="_blank" rel="noreferrer"><ExternalLink size={16} /> View live</a>}
          <button className="ghost-button" onClick={onLogout}><LogOut size={16} /> Sign out</button>
        </div>
      </header>
      <div className="workspace">
        <aside className={`sidebar ${mobileMenu ? 'open' : ''}`}>
          <div className="side-intro"><p className="eyebrow">YOUR WORKSPACE</p><h2>Shape your story.</h2><p>Everything you need to make your work memorable.</p></div>
          <nav>{nav.map(item => { const Icon = item.icon; return <button key={item.key} className={section === item.key ? 'active' : ''} onClick={() => { setSection(item.key); setMobileMenu(false); }}><Icon size={17} />{item.label}<ChevronRight size={14} /></button>; })}</nav>
          <div className="side-bottom"><button onClick={() => setShowTemplates(true)}><Sparkles size={16} /> Change template</button><button onClick={() => void save(true)}><Save size={16} /> Save now</button></div>
        </aside>
        <main className="editor-area">
          <div className="editor-heading"><div><p className="eyebrow">EDITING / {currentLabel?.toUpperCase()}</p><h1>{currentLabel}</h1></div><div className="heading-actions"><button className="outline-button" onClick={() => setShowTemplates(true)}><Sparkles size={16} /> <span>Templates</span></button><button className="primary-button" onClick={() => { setPublished(true); setSaved(false); void save(true, true); }}><Send size={16} /> Publish</button></div></div>
          <div className="editor-grid">
            <section className="form-panel">
              {section === 'profile' && <ProfileForm content={content} update={update} setUsername={setUsername} username={username} />}
              {section === 'skills' && <TextListForm title="Your toolkit" subtitle="One skill per line. Keep it specific and honest." label="Skills" value={content.skills} onChange={value => setArray('skills', value)} placeholder={'React\nProduct strategy\nPublic speaking'} icon={<Code2 size={18} />} />}
              {section === 'achievements' && <TextListForm title="Moments worth sharing" subtitle="Small wins become a compelling story when you name them." label="Achievements" value={content.achievements} onChange={value => setArray('achievements', value)} placeholder={'Won first place at hackathon\nGrew community to 500 members'} icon={<Award size={18} />} />}
              {section === 'certifications' && <TextListForm title="Proof of your craft" subtitle="Add the courses, credentials, and certifications that matter." label="Certifications" value={content.certifications} onChange={value => setArray('certifications', value)} placeholder={'AWS Cloud Practitioner\nGoogle UX Design'} icon={<FileText size={18} />} />}
              {section === 'leadership' && <TextListForm title="How you show up" subtitle="Leadership is what you make better for other people." label="Leadership & community" value={content.leadership} onChange={value => setArray('leadership', value)} placeholder={'Led the campus technology club\nMentored 12 first-year students'} icon={<Zap size={18} />} />}
              {section === 'projects' && <ProjectsForm projects={content.projects} onChange={projects => update({ projects })} />}
              {section === 'education' && <EducationForm education={content.education} onChange={education => update({ education })} />}
              {section === 'contact' && <ContactForm content={content} update={update} />}
            </section>
            <aside className="preview-panel"><div className="preview-panel-head"><div><p className="eyebrow">THE REAL-TIME VIEW</p><h2>Preview</h2></div><span className="live-dot"><i /> LIVE</span></div><Preview content={content} template={template} /></aside>
          </div>
        </main>
      </div>
      {showTemplates && <div className="modal-backdrop" onClick={() => setShowTemplates(false)}><div className="template-modal" onClick={event => event.stopPropagation()}><button className="close-button" onClick={() => setShowTemplates(false)}><X size={18} /></button><p className="eyebrow">MAKE IT YOURS</p><h2>Pick your atmosphere.</h2><p className="modal-subtitle">Your content stays the same. Only the feeling changes.</p><div className="template-options">{templates.map(item => <button key={item.id} className={template === item.id ? 'selected' : ''} onClick={() => { setTemplate(item.id); setSaved(false); setShowTemplates(false); }}><div className={`template-swatch bg-gradient-to-br ${item.colors}`}><span /><span /><span /></div><div><strong>{item.name}</strong><small>{item.kicker}</small></div>{template === item.id && <Check size={17} />}</button>)}</div></div></div>}
      {toast && <div className="toast"><Check size={17} /> {toast}</div>}
    </div>
  );
}

function ProfileForm({ content, update, username, setUsername }: { content: PortfolioContent; update: (patch: Partial<PortfolioContent>) => void; username: string; setUsername: (value: string) => void }) {
  return <FormFrame icon={<UserRound size={18} />} title="The first impression" subtitle="Give visitors a clear, confident reason to keep scrolling.">
    <div className="form-two"><label>Full name<input value={content.fullName} onChange={e => update({ fullName: e.target.value })} placeholder="Aarav Mehta" /></label><label>Headline<input value={content.headline} onChange={e => update({ headline: e.target.value })} placeholder="Product designer & builder" /></label></div>
    <label>About you<textarea rows={5} value={content.about} onChange={e => update({ about: e.target.value })} placeholder="What do you do, and what do you care about?" /></label>
    <div className="form-two"><label>Email<input type="email" value={content.email} onChange={e => update({ email: e.target.value })} placeholder="you@example.com" /></label><label>Based in<input value={content.location} onChange={e => update({ location: e.target.value })} placeholder="Bengaluru, India" /></label></div>
    <div className="form-two"><label>Public username<span className="input-hint">myportfolio.com/u/</span><input value={username} onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))} placeholder="aarav-mehta" /></label><ImagePicker value={content.photo} onChange={photo => update({ photo })} label="Profile photo" /></div>
  </FormFrame>;
}

function FormFrame({ icon, title, subtitle, children }: { icon: React.ReactNode; title: string; subtitle: string; children: React.ReactNode }) {
  return <div className="form-content"><div className="form-title"><span className="section-icon">{icon}</span><div><h2>{title}</h2><p>{subtitle}</p></div></div>{children}</div>;
}

function TextListForm({ title, subtitle, label, value, onChange, placeholder, icon }: { title: string; subtitle: string; label: string; value: string[]; onChange: (value: string) => void; placeholder: string; icon: React.ReactNode }) {
  return <FormFrame icon={icon} title={title} subtitle={subtitle}><label>{label}<textarea rows={10} value={value.join('\n')} onChange={e => onChange(e.target.value)} placeholder={placeholder} /></label><p className="field-note">Each new line becomes a separate item on your portfolio.</p></FormFrame>;
}

function ProjectsForm({ projects, onChange }: { projects: PortfolioContent['projects']; onChange: (value: PortfolioContent['projects']) => void }) {
  const [active, setActive] = useState(0);
  const project = projects[active] || { title: '', description: '', tech: '', link: '', image: '' };
  const update = (patch: Partial<typeof project>) => {
    const next = [...projects];
    if (active >= next.length) next.push(project);
    next[active] = { ...next[active], ...patch };
    onChange(next);
  };

  return <FormFrame icon={<LayoutDashboard size={18} />} title="Show, don't just tell" subtitle="Your best work deserves more than a bullet point.">
    <div className="item-tabs">
      {projects.map((item, index) => <button key={`${item.title}-${index}`} className={index === active ? 'active' : ''} onClick={() => setActive(index)}>{String(index + 1).padStart(2, '0')} {item.title || 'Untitled'}</button>)}
      <button onClick={() => { onChange([...projects, { title: '', description: '', tech: '', link: '', image: '' }]); setActive(projects.length); }}><Plus size={14} /> Add project</button>
    </div>
    <div className="form-two"><label>Project title<input value={project.title} onChange={e => update({ title: e.target.value })} placeholder="Smart Toll Gate" /></label><label>Technology<input value={project.tech} onChange={e => update({ tech: e.target.value })} placeholder="React, Node.js, MongoDB" /></label></div>
    <label>What did you build?<textarea rows={5} value={project.description} onChange={e => update({ description: e.target.value })} placeholder="Describe the problem, your approach, and the result." /></label>
    <label>Live or GitHub link<input value={project.link} onChange={e => update({ link: e.target.value })} placeholder="https://github.com/..." /></label>
    <div className="upload-row"><ImagePicker value={project.image} onChange={image => update({ image })} label="Project cover photo" />{projects.length > 0 && <button className="delete-button" onClick={() => { onChange(projects.filter((_, index) => index !== active)); setActive(Math.max(0, active - 1)); }}><Trash2 size={16} /> Remove project</button>}</div>
  </FormFrame>;
}

function EducationForm({ education, onChange }: { education: PortfolioContent['education']; onChange: (value: PortfolioContent['education']) => void }) {
  const item = education[0] || { school: '', degree: '', year: '' };
  return <FormFrame icon={<GraduationCap size={18} />} title="Keep learning visible" subtitle="The places and people that shaped your perspective.">
    <label>Institution<input value={item.school} onChange={e => onChange([{ ...item, school: e.target.value }])} placeholder="University of Mumbai" /></label>
    <label>Degree or focus<input value={item.degree} onChange={e => onChange([{ ...item, degree: e.target.value }])} placeholder="B.E. Computer Engineering" /></label>
    <label>Years<input value={item.year} onChange={e => onChange([{ ...item, year: e.target.value }])} placeholder="2022 — 2026" /></label>
  </FormFrame>;
}

function ContactForm({ content, update }: { content: PortfolioContent; update: (patch: Partial<PortfolioContent>) => void }) {
  const change = (key: keyof PortfolioContent['contact'], value: string) => update({ contact: { ...content.contact, [key]: value } });
  return <FormFrame icon={<Globe2 size={18} />} title="Make it easy to connect" subtitle="Give the right people a path to your next conversation.">
    <label><Github size={15} /> GitHub<input value={content.contact.github} onChange={e => change('github', e.target.value)} placeholder="github.com/yourname" /></label>
    <label><Linkedin size={15} /> LinkedIn<input value={content.contact.linkedin} onChange={e => change('linkedin', e.target.value)} placeholder="linkedin.com/in/yourname" /></label>
    <label><Globe2 size={15} /> Personal website<input value={content.contact.website} onChange={e => change('website', e.target.value)} placeholder="yourwebsite.com" /></label>
  </FormFrame>;
}

function PublicPage({ username }: { username: string }) {
  const [portfolio, setPortfolio] = useState<PortfolioRow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void supabase.from('portfolios').select('*').eq('username', username).eq('published', true).maybeSingle()
      .then(({ data, error }) => {
        if (error) console.error('Public portfolio lookup failed:', error);
        setPortfolio(data ? {
          ...(data as PortfolioRow),
          content: ((data as PortfolioRow).content ?? (data as PortfolioRow).data ?? starterContent) as PortfolioContent,
        } : null);
        setLoading(false);
      });
  }, [username]);

  if (loading) return <div className="public-loading">Loading portfolio…</div>;
  if (!portfolio) return <div className="public-loading"><h2>Portfolio not found</h2><p>This link may not be published yet.</p></div>;
  return <div className="public-page"><Preview content={portfolio.content} template={portfolio.template ?? 'classic-dark'} publicView /></div>;
}

function App() {
  const publicUsername = window.location.pathname.startsWith('/u/')
    ? window.location.pathname.slice(3).split('/')[0]
    : window.location.hash.startsWith('#/u/')
      ? window.location.hash.slice(4)
      : '';

  const [session, setSession] = useState<{ user: { id: string } } | null>(null);
  const [portfolio, setPortfolio] = useState<PortfolioRow | null>(null);
  const [portfolioError, setPortfolioError] = useState('');
  const [loading, setLoading] = useState(!publicUsername);

  useEffect(() => {
    if (publicUsername) return;

    let active = true;
    const loadSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (!active) return;
      if (error) setPortfolioError(error.message);
      setSession(data.session as { user: { id: string } } | null);
      setLoading(false);
    };

    void loadSession();
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession as { user: { id: string } } | null);
      setPortfolio(null);
      setPortfolioError('');
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, [publicUsername]);

  useEffect(() => {
    if (!session || publicUsername) return;
    let cancelled = false;

    const loadPortfolio = async () => {
      setPortfolioError('');

      const { data, error } = await supabase
        .from('portfolios')
        .select('*')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (cancelled) return;

      if (error) {
        console.error('Portfolio lookup failed:', error);
        setPortfolioError(error.message);
        return;
      }

      if (data) {
        const row = data as PortfolioRow;
        setPortfolio({
          ...row,
          content: (row.content ?? row.data ?? starterContent) as PortfolioContent,
          template: row.template ?? 'classic-dark',
          published: row.published ?? false,
          username: row.username ?? row.slug ?? `creator-${session.user.id.slice(0, 8)}`,
        });
        return;
      }

      const username = `creator-${session.user.id.slice(0, 8)}`;
      const { data: created, error: createError } = await supabase
        .from('portfolios')
        .insert({
          user_id: session.user.id,
          title: starterContent.fullName || 'My Portfolio',
          slug: username,
          data: starterContent,
          content: starterContent,
          template: 'classic-dark',
          published: false,
          username,
        })
        .select('*')
        .single();

      if (cancelled) return;

      if (createError) {
        console.error('Portfolio creation failed:', createError);
        setPortfolioError(createError.message);
        return;
      }

      const row = created as PortfolioRow;
      setPortfolio({
        ...row,
        content: (row.content ?? row.data ?? starterContent) as PortfolioContent,
        template: row.template ?? 'classic-dark',
        published: row.published ?? false,
        username: row.username ?? row.slug ?? username,
      });
    };

    void loadPortfolio();
    return () => { cancelled = true; };
  }, [session, publicUsername]);

  if (publicUsername) return <PublicPage username={publicUsername} />;
  if (loading) return <div className="public-loading">Preparing your workspace…</div>;
  if (!session) return <AuthScreen />;

  if (portfolioError) {
    return <div className="public-loading"><h2>Workspace could not load</h2><p>{portfolioError}</p><button className="primary-button" onClick={() => window.location.reload()}>Try again</button></div>;
  }

  if (!portfolio) return <div className="public-loading">Creating your workspace…</div>;

  return (
    <Editor
      portfolio={portfolio}
      onSave={async (content, template, published, username) => {
        const { data, error } = await supabase.from('portfolios').update({
          user_id: session.user.id,
          content,
          data: content,
          title: content.fullName || 'My Portfolio',
          template,
          published,
          username,
          slug: username,
          updated_at: new Date().toISOString(),
        }).eq('id', portfolio.id).select('*').maybeSingle();

        if (error) {
          console.error('Portfolio save failed:', error);
          throw error;
        }

        if (data) {
          const row = data as PortfolioRow;
          setPortfolio({
            ...row,
            content: (row.content ?? row.data ?? content) as PortfolioContent,
            template: row.template ?? template,
            published: row.published ?? published,
            username: row.username ?? row.slug ?? username,
          });
        }
      }}
      onLogout={async () => {
        await supabase.auth.signOut();
        setSession(null);
        setPortfolio(null);
      }}
    />
  );
}

export default App;
