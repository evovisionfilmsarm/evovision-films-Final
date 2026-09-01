import { useEffect } from 'react';
import { LanguageProvider, useLanguage } from '@/lib/LanguageContext';
import { AuthProvider } from '@/lib/AuthContext';
import { useRouter } from '@/lib/router';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { HomePage } from '@/pages/HomePage';
import { ProgramListPage } from '@/pages/ProgramListPage';
import { AcademyPage } from '@/pages/AcademyPage';
import { WorksPage } from '@/pages/workspage';
import { ContentDetailPage } from '@/pages/ContentDetailPage';
import { AboutPage } from '@/pages/AboutPage';
import { ContactPage } from '@/pages/ContactPage';
import { AdminPage } from '@/pages/AdminPage';
import { PartnersPage } from '@/pages/PartnersPage';
import { sampleImages } from '@/lib/sampleData';

function DocumentMeta() {
  const { lang } = useLanguage();

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return null;
}

function Routes() {
  const route = useRouter();
  const { t } = useLanguage();
  const segs = route.segments;

  useEffect(() => {
    document.title = 'EvoVision Films';
  }, []);

  const isAdmin = segs[0] === 'admin';

  if (isAdmin) {
    return <AdminPage />;
  }

  let page: React.ReactNode;
  let title = 'EvoVision Films';

  if (segs.length === 0) {
    page = <HomePage />;
    title = 'EvoVision Films';

  } else if (segs[0] === 'kinomas' && segs.length === 1) {
    page = (
      <ProgramListPage
        programSlug="kinomas"
        title={t('kinomas.title')}
        subtitle={t('kinomas.subtitle')}
        heroImage={sampleImages.reel}
      />
    );
    title = `${t('kinomas.title')} — EvoVision Films`;

  } else if (segs[0] === 'kadrich-durs' && segs.length === 1) {
    page = (
      <ProgramListPage
        programSlug="kadrich-durs"
        title={t('kadrich.title')}
        subtitle={t('kadrich.subtitle')}
        heroImage={sampleImages.clapper}
      />
    );
    title = `${t('kadrich.title')} — EvoVision Films`;

  } else if (segs[0] === 'academy' && segs.length === 1) {
    page = <AcademyPage />;
    title = `${t('academy.title')} — EvoVision Films`;

  } else if (segs[0] === 'works' && segs.length === 1) {
    page = <WorksPage />;
    title = `${t('nav.works')} — EvoVision Films`;

  } else if (
    (
      segs[0] === 'kinomas' ||
      segs[0] === 'kadrich-durs' ||
      segs[0] === 'academy' ||
      segs[0] === 'works'
    ) &&
    segs.length === 2
  ) {
    page = <ContentDetailPage slug={segs[1]} />;
    title = 'EvoVision Films';

  } else if (segs[0] === 'partners' && segs.length === 1) {
    page = <PartnersPage />;
    title = `${t('partners.title')} — EvoVision Films`;

  } else if (segs[0] === 'about') {
    page = <AboutPage />;
    title = `${t('about.title')} — EvoVision Films`;

  } else if (segs[0] === 'contact') {
    page = <ContactPage />;
    title = `${t('contact.title')} — EvoVision Films`;

  } else {
    page = <HomePage />;
  }

  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header />

      <main className="flex-1">
        {page}
      </main>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <DocumentMeta />
        <Routes />
      </AuthProvider>
    </LanguageProvider>
  );
}