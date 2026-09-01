import { useLanguage } from '@/lib/LanguageContext';
import { Link } from '@/lib/router';

export function SectionHeader({
  label,
  title,
  to,
  cta,
}: {
  label: string;
  title: string;
  to?: string;
  cta?: string;
}) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
      <div>
        <span className="text-xs uppercase tracking-widest text-red-500 font-semibold block mb-2">
          {label}
        </span>
        <h2 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
          {title}
        </h2>
      </div>
      {to && cta && (
        <Link
          to={to}
          className="text-sm text-white/60 hover:text-white transition-colors flex items-center gap-1"
        >
          {t('common.viewAll')}
          <span className="text-red-400">→</span>
        </Link>
      )}
    </div>
  );
}
