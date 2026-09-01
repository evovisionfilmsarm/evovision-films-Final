import { useEffect, useState } from 'react';
import { Lock, LogOut, Shield, LayoutDashboard, Film, Clapperboard, Scissors, Users, ExternalLink, TrendingUp, FileText, CircleCheck, File as FileEdit, Briefcase } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { useLanguage } from '@/lib/LanguageContext';
import { Link } from '@/lib/router';
import { fetchDashboardStats } from '@/lib/adminApi';
import { FilmsView } from '@/pages/admin/FilmsView';
import { EpisodesView } from '@/pages/admin/EpisodesView';
import { SponsorsView } from '@/pages/admin/SponsorsView';
import { LessonsView } from '@/pages/admin/LessonsView';
import { WorksView } from '@/pages/admin/WorksView';

type Stats = {
  films: number;
  episodes: number;
  lessons: number;
  sponsors: number;
  published: number;
  drafts: number;
};

const navItems = [
  { key: 'admin.dashboard', icon: LayoutDashboard, to: '/admin' },
  { key: 'admin.films', icon: Film, to: '/admin/films' },
  { key: 'admin.episodes', icon: Clapperboard, to: '/admin/episodes' },
  { key: 'admin.lessons', icon: Scissors, to: '/admin/lessons' },
  { key: 'admin.works', icon: Briefcase, to: '/admin/works' },
  { key: 'admin.sponsors', icon: Users, to: '/admin/sponsors' },
] as const;

function AdminShell({ children }: { children: React.ReactNode }) {
  const { session, signOut } = useAuth();
  const { t } = useLanguage();
  const route = useRouterSafe();

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-60 border-r border-white/5 bg-zinc-950/60 sticky top-0 h-screen">
        <div className="px-6 py-6 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <img
              src="/assets/brand/evovision_spitak_karmir.png"
              alt="EvoVision Films"
              className="h-8 w-auto object-contain"
            />
          </div>
          <p className="mt-3 text-xs uppercase tracking-widest text-white/40 font-semibold">
            {t('admin.managementTitle')}
          </p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const active =
              item.to === '/admin'
                ? route.path === '/admin'
                : route.path.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                  active
                    ? 'bg-red-600/15 text-white border border-red-600/30'
                    : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <item.icon className={`w-4 h-4 ${active ? 'text-red-400' : 'text-white/50'}`} />
                {t(item.key)}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-white/5 space-y-1">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors"
          >
            <ExternalLink className="w-4 h-4 text-white/50" />
            {t('admin.backToSite')}
          </Link>
          <button
            onClick={signOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors"
          >
            <LogOut className="w-4 h-4 text-white/50" />
            {t('admin.signOut')}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center justify-between px-4 py-4 border-b border-white/5 bg-zinc-950/60 sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <img
              src="/assets/brand/evovision_spitak_karmir.png"
              alt="EvoVision Films"
              className="h-7 w-auto object-contain"
            />
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="p-2 text-white/60 hover:text-white transition-colors"
              aria-label={t('admin.backToSite')}
            >
              <ExternalLink className="w-5 h-5" />
            </Link>
            <button
              onClick={signOut}
              className="p-2 text-white/60 hover:text-white transition-colors"
              aria-label={t('admin.signOut')}
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        <div className="lg:hidden flex gap-1 px-4 py-3 border-b border-white/5 bg-zinc-950/40 overflow-x-auto">
          {navItems.map((item) => {
            const active =
              item.to === '/admin'
                ? route.path === '/admin'
                : route.path.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs whitespace-nowrap transition-colors ${
                  active
                    ? 'bg-red-600/15 text-white'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {t(item.key)}
              </Link>
            );
          })}
        </div>

        <header className="hidden lg:flex items-center justify-between px-8 py-5 border-b border-white/5">
          <div>
            <p className="text-xs uppercase tracking-widest text-white/40 font-semibold">
              {t('admin.managementTitle')}
            </p>
            <p className="text-sm text-white/50 mt-0.5">{session?.user?.email}</p>
          </div>
          <button
            onClick={signOut}
            className="inline-flex items-center gap-2 px-4 py-2 border border-white/10 hover:border-white/20 rounded-lg text-sm text-white/70 hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4" />
            {t('admin.signOut')}
          </button>
        </header>

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">{children}</main>
      </div>
    </div>
  );
}

function useRouterSafe() {
  const [path, setPath] = useState(() =>
    typeof window !== 'undefined' ? window.location.hash.replace(/^#/, '') || '/' : '/'
  );
  useEffect(() => {
    const onChange = () =>
      setPath(window.location.hash.replace(/^#/, '') || '/');
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return { path };
}

function StatCard({
  icon: Icon,
  label,
  value,
  loading,
  accent,
}: {
  icon: typeof Film;
  label: string;
  value: number;
  loading: boolean;
  accent: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-white/10 bg-zinc-900/40 p-6 group hover:border-white/20 transition-colors">
      <div className="flex items-start justify-between mb-6">
        <div className={`w-11 h-11 rounded-lg flex items-center justify-center ${accent}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      {loading ? (
        <div className="h-9 w-16 rounded-md bg-white/5 animate-pulse" />
      ) : (
        <p className="text-3xl font-bold text-white tracking-tight tabular-nums">{value}</p>
      )}
      <p className="mt-1 text-sm text-white/50">{label}</p>
    </div>
  );
}

function DashboardView() {
  const { t } = useLanguage();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchDashboardStats().then((data) => {
      if (active) {
        setStats(data);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const cards = [
    { icon: Film, label: t('admin.totalFilms'), value: stats?.films ?? 0, accent: 'bg-red-600/15 text-red-400' },
    { icon: Clapperboard, label: t('admin.totalEpisodes'), value: stats?.episodes ?? 0, accent: 'bg-blue-600/15 text-blue-400' },
    { icon: Scissors, label: t('admin.totalLessons'), value: stats?.lessons ?? 0, accent: 'bg-green-600/15 text-green-400' },
    { icon: Users, label: t('admin.totalSponsors'), value: stats?.sponsors ?? 0, accent: 'bg-amber-600/15 text-amber-400' },
  ];

  const totalContent = (stats?.films ?? 0) + (stats?.episodes ?? 0) + (stats?.lessons ?? 0);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
          {t('admin.dashboard')}
        </h1>
        <p className="mt-2 text-sm text-white/50 max-w-2xl leading-relaxed">
          {t('admin.recentItems')}
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {cards.map((c) => (
          <StatCard
            key={c.label}
            icon={c.icon}
            label={c.label}
            value={c.value}
            loading={loading}
            accent={c.accent}
          />
        ))}
      </div>

      {/* Published vs Drafts */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        <div className="lg:col-span-2 rounded-xl border border-white/10 bg-zinc-900/40 p-6">
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp className="w-4 h-4 text-red-400" />
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
              {t('admin.publishedItems')} / {t('admin.draftItems')}
            </h2>
          </div>
          {loading ? (
            <div className="h-6 w-full rounded-md bg-white/5 animate-pulse" />
          ) : totalContent === 0 ? (
            <p className="text-sm text-white/40 py-6 text-center">{t('admin.noItems')}</p>
          ) : (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="flex items-center gap-1.5 text-white/60">
                    <CircleCheck className="w-3.5 h-3.5 text-green-400" />
                    {t('admin.publishedItems')}
                  </span>
                  <span className="text-white font-medium tabular-nums">{stats?.published ?? 0}</span>
                </div>
                <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full bg-green-500/70 rounded-full transition-all duration-500"
                    style={{
                      width: totalContent > 0 ? `${((stats?.published ?? 0) / totalContent) * 100}%` : '0%',
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="flex items-center gap-1.5 text-white/60">
                    <FileEdit className="w-3.5 h-3.5 text-amber-400" />
                    {t('admin.draftItems')}
                  </span>
                  <span className="text-white font-medium tabular-nums">{stats?.drafts ?? 0}</span>
                </div>
                <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full bg-amber-500/70 rounded-full transition-all duration-500"
                    style={{
                      width: totalContent > 0 ? `${((stats?.drafts ?? 0) / totalContent) * 100}%` : '0%',
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick links */}
        <div className="rounded-xl border border-white/10 bg-zinc-900/40 p-6">
          <div className="flex items-center gap-2 mb-5">
            <FileText className="w-4 h-4 text-red-400" />
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
              {t('admin.content')}
            </h2>
          </div>
          <div className="space-y-2">
            {navItems.slice(1).map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors group"
              >
                <item.icon className="w-4 h-4 text-white/50 group-hover:text-red-400 transition-colors" />
                {t(item.key)}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PlaceholderView({ titleKey }: { titleKey: 'admin.films' | 'admin.episodes' | 'admin.lessons' | 'admin.works' | 'admin.sponsors' }) {
  const { t } = useLanguage();
  return (
    <div>
      <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight mb-8">
        {t(titleKey)}
      </h1>
      <div className="rounded-xl border border-white/10 bg-zinc-900/30 p-12 text-center">
        <p className="text-sm text-white/40 leading-relaxed max-w-md mx-auto">
          {t('admin.noItems')}
        </p>
      </div>
    </div>
  );
}

export function AdminPage() {
  const { session, loading, isAdmin, signIn, signOut } = useAuth();
  const { t } = useLanguage();
  const route = useRouterSafe();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white/40">{t('admin.loading')}</p>
      </div>
    );
  }

  if (!session) {
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitting(true);
      setError(null);
      const { error } = await signIn(email, password);
      if (error) setError(t('admin.loginError'));
      setSubmitting(false);
    };

    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-xl bg-red-600/15 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-7 h-7 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">{t('admin.managementTitle')}</h1>
            <p className="text-sm text-white/50">{t('admin.loginPrompt')}</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs uppercase tracking-wider text-white/40 block mb-1.5">
                {t('admin.email')}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-zinc-900 border border-white/10 rounded-lg text-white text-sm focus:border-red-600/50 focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-white/40 block mb-1.5">
                {t('admin.password')}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-zinc-900 border border-white/10 rounded-lg text-white text-sm focus:border-red-600/50 focus:outline-none transition-colors"
              />
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold rounded-lg transition-colors"
            >
              {t('admin.signIn')}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <Shield className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-lg text-white/70">{t('admin.unauthorized')}</p>
          <button
            onClick={signOut}
            className="mt-6 text-sm text-white/50 hover:text-white transition-colors"
          >
            {t('admin.signOut')}
          </button>
        </div>
      </div>
    );
  }

  const seg = route.path.replace(/^\//, '').split('/').filter(Boolean);
let view: React.ReactNode;

if (seg.length <= 1) {
  view = <DashboardView />;
} else if (seg[1] === 'films') {
  view = <FilmsView />;
} else if (seg[1] === 'episodes') {
  view = <EpisodesView />;
} else if (seg[1] === 'lessons') {
  view = <LessonsView />;
} else if (seg[1] === 'works') {
  view = <WorksView />;
} else if (seg[1] === 'sponsors') {
  view = <SponsorsView />;
} else {
  view = <DashboardView />;
}

return <AdminShell>{view}</AdminShell>;
}
