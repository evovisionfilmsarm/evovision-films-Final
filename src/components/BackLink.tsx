import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { Link } from '@/lib/router';

export function BackLink({ to, label }: { to: string; label: string }) {
  const { t } = useLanguage();
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors mb-8"
    >
      <ArrowLeft className="w-4 h-4" />
      {t('common.backTo')} {label}
    </Link>
  );
}
