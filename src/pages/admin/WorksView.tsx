import { useEffect, useState } from 'react';
import { Briefcase, Plus, Pencil, Trash2, X, Upload, Loader as Loader2, CircleAlert as AlertCircle, CircleCheck as CheckCircle2, Star, Globe, Image as ImageIcon } from 'lucide-react';
import { useLanguage } from '../../lib/LanguageContext';
import type { ContentItem, ContentTranslation, Language } from '../../lib/types';
import {
  fetchAllContent,
  createContent,
  updateContent,
  deleteContent,
  type ContentInput,
} from '../../lib/adminApi';
import { fetchAllSponsors } from '../../lib/adminApi';
import type { Sponsor } from '../../lib/types';
import { uploadImage } from '../../lib/imageUpload';

const LANGS: Language[] = ['hy', 'ru', 'en'];
const LANG_LABELS: Record<Language, string> = { hy: 'HY', ru: 'RU', en: 'EN' };

function emptyTranslations(): Record<Language, ContentTranslation> {
  return {
    hy: { title: '', synopsis: '', description: '', seoTitle: '', seoDescription: '' },
    ru: { title: '', synopsis: '', description: '', seoTitle: '', seoDescription: '' },
    en: { title: '', synopsis: '', description: '', seoTitle: '', seoDescription: '' },
  };
}

function emptyWorkInput(): ContentInput {
  return {
    slug: '',
    type: 'movie',
    programSlug: 'works',
    categorySlug: '',
    coverImage: '',
    trailerUrl: '',
    telegramLink: '',
    year: undefined,
    genre: '',
    duration: '',
    isPremium: false,
    isPublished: false,
    featured: false,
    sponsorId: undefined,
    translations: emptyTranslations(),
  };
}

function workToInput(work: ContentItem): ContentInput {
  return {
    slug: work.slug,
    type: work.type,
    programSlug: work.programSlug,
    categorySlug: work.categorySlug,
    coverImage: work.coverImage,
    trailerUrl: work.trailerUrl ?? '',
    telegramLink: work.telegramLink ?? '',
    year: work.year,
    genre: work.genre ?? '',
    duration: work.duration ?? '',
    difficulty: work.difficulty,
    isPremium: work.isPremium,
    isPublished: work.isPublished,
    featured: work.featured,
    sponsorId: work.sponsorId,
    translations: { ...work.translations },
  };
}

type Status = 'idle' | 'saving' | 'deleting';

export function WorksView() {
  const { t, lang } = useLanguage();
  const [works, setWorks] = useState<ContentItem[]>([]);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<ContentItem | null>(null);
  const [form, setForm] = useState<ContentInput>(emptyWorkInput());
  const [activeLang, setActiveLang] = useState<Language>('hy');
  const [status, setStatus] = useState<Status>('idle');
  const [formError, setFormError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ContentItem | null>(null);
  const [uploading, setUploading] = useState(false);

  const loadWorks = async () => {
    setLoading(true);
    const all = await fetchAllContent();
    setWorks(
      all.filter(
        (c) =>
          c.programSlug === 'works' &&
          c.type === 'movie'
      )
    );
    setLoading(false);
  };

  const loadSponsors = async () => {
    const all = await fetchAllSponsors();
    setSponsors(all);
  };

  useEffect(() => {
    loadWorks();
    loadSponsors();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyWorkInput());
    setActiveLang('hy');
    setFormError(null);
    setShowForm(true);
  };

  const openEdit = (work: ContentItem) => {
    setEditing(work);
    setForm(workToInput(work));
    setActiveLang('hy');
    setFormError(null);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditing(null);
    setFormError(null);
  };

  const handleSave = async (publish: boolean) => {
    setStatus('saving');
    setFormError(null);

    const input: ContentInput = {
      ...form,
      isPublished: publish,
      type: 'movie',
      programSlug: 'works',
    };

    if (!input.slug.trim()) {
      setFormError(t('admin.required'));
      setStatus('idle');
      return;
    }
    const hasTitle = LANGS.every((l) => input.translations[l].title.trim().length > 0);
    if (!hasTitle) {
      setFormError(t('admin.translationsHint'));
      setStatus('idle');
      return;
    }

    const result = editing
      ? await updateContent(editing.id, input)
      : await createContent(input);

    if (result.error) {
      setFormError(result.error);
      setStatus('idle');
      return;
    }

    setStatus('idle');
    setShowForm(false);
    setSuccessMsg(editing ? t('admin.saved') : t('admin.saved'));
    await loadWorks();
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setStatus('deleting');
    const { error } = await deleteContent(deleteTarget.id);
    setStatus('idle');
    setDeleteTarget(null);
    if (error) {
      setFormError(error);
    } else {
      setSuccessMsg(t('admin.deleted'));
      await loadWorks();
      setTimeout(() => setSuccessMsg(null), 3000);
    }
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    const url = await uploadImage(file, 'works');
    setUploading(false);
    if (url) {
      setForm((f) => ({ ...f, coverImage: url }));
    } else {
      setFormError(t('admin.uploadError'));
    }
  };

  const setTr = (l: Language, field: keyof ContentTranslation, value: string) => {
    setForm((f) => ({
      ...f,
      translations: {
        ...f.translations,
        [l]: { ...f.translations[l], [field]: value },
      },
    }));
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
            {t('admin.works')}
          </h1>
          <p className="mt-1 text-sm text-white/50">{t('admin.totalWorks')}: {works.length}</p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          {t('admin.newWork')}
        </button>
      </div>

      {/* Success banner */}
      {successMsg && (
        <div className="mb-6 flex items-center gap-2.5 px-4 py-3 rounded-lg border border-green-600/30 bg-green-600/10 text-green-400 text-sm">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          {successMsg}
        </div>
      )}

      {/* Error banner */}
      {formError && !showForm && (
        <div className="mb-6 flex items-center gap-2.5 px-4 py-3 rounded-lg border border-red-600/30 bg-red-600/10 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {formError}
        </div>
      )}

      {/* Works table */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 rounded-xl bg-zinc-900/50 border border-white/5 animate-pulse" />
          ))}
        </div>
      ) : works.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-zinc-900/30 p-16 text-center">
          <Briefcase className="w-10 h-10 text-white/20 mx-auto mb-4" />
          <p className="text-sm text-white/40">{t('admin.noItems')}</p>
        </div>
      ) : (
        <div className="rounded-xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-zinc-900/60 border-b border-white/10">
                  <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-white/40 font-semibold">{t('admin.coverImage')}</th>
                  <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-white/40 font-semibold">{t('admin.title')}</th>
                  <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-white/40 font-semibold hidden md:table-cell">{t('admin.year')}</th>
                  <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-white/40 font-semibold hidden md:table-cell">{t('admin.genre')}</th>
                  <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-white/40 font-semibold">{t('admin.status')}</th>
                  <th className="text-right px-4 py-3 text-xs uppercase tracking-wider text-white/40 font-semibold">{t('admin.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {works.map((work) => {
                  const tr = work.translations[lang] ?? work.translations.en;
                  return (
                    <tr key={work.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3">
                        <div className="w-12 h-16 rounded-md overflow-hidden bg-zinc-950 flex-shrink-0">
                          {work.coverImage ? (
                            <img src={work.coverImage} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ImageIcon className="w-4 h-4 text-white/20" />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {work.featured && <Star className="w-3.5 h-3.5 text-red-400 fill-red-400 flex-shrink-0" />}
                          <span className="text-sm text-white font-medium">{tr.title}</span>
                        </div>
                        <span className="text-xs text-white/40">/{work.slug}</span>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="text-sm text-white/60">{work.year ?? '—'}</span>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="text-sm text-white/60">{work.genre ?? '—'}</span>
                      </td>
                      <td className="px-4 py-3">
                        {work.isPublished ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-green-600/15 text-green-400">
                            {t('admin.published')}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-amber-600/15 text-amber-400">
                            {t('admin.draft')}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openEdit(work)}
                            className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-colors"
                            aria-label={t('admin.edit')}
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(work)}
                            className="p-2 rounded-lg text-white/50 hover:text-red-400 hover:bg-red-600/10 transition-colors"
                            aria-label={t('admin.delete')}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/80 backdrop-blur-sm p-4 sm:p-6">
          <div className="w-full max-w-3xl my-8 rounded-2xl border border-white/10 bg-zinc-950 shadow-2xl">
            {/* Form header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <h2 className="text-lg font-bold text-white">
                {editing ? t('admin.editWork') : t('admin.newWork')}
              </h2>
              <button
                onClick={closeForm}
                className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form body */}
            <div className="px-6 py-5 space-y-6 max-h-[calc(100vh-12rem)] overflow-y-auto">
              {formError && (
                <div className="flex items-center gap-2.5 px-4 py-3 rounded-lg border border-red-600/30 bg-red-600/10 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {formError}
                </div>
              )}

              {/* General fields */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs uppercase tracking-wider text-white/40 block mb-1.5">
                      {t('admin.slug')} *
                    </label>
                    <input
                      type="text"
                      value={form.slug}
                      onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                      placeholder="the-red-room"
                      className="w-full px-3.5 py-2.5 bg-zinc-900 border border-white/10 rounded-lg text-white text-sm focus:border-red-600/50 focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-wider text-white/40 block mb-1.5">
                      {t('admin.year')}
                    </label>
                    <input
                      type="number"
                      value={form.year ?? ''}
                      onChange={(e) => setForm((f) => ({ ...f, year: e.target.value ? Number(e.target.value) : undefined }))}
                      className="w-full px-3.5 py-2.5 bg-zinc-900 border border-white/10 rounded-lg text-white text-sm focus:border-red-600/50 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wider text-white/40 block mb-1.5">
                    {t('admin.type')}
                  </label>
                  <input
                    type="text"
                    value={form.categorySlug ?? ''}
                    onChange={(e) => setForm((f) => ({ ...f, categorySlug: e.target.value }))}
                    placeholder="category-slug"
                    className="w-full px-3.5 py-2.5 bg-zinc-900 border border-white/10 rounded-lg text-white text-sm focus:border-red-600/50 focus:outline-none transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs uppercase tracking-wider text-white/40 block mb-1.5">
                      {t('admin.genre')}
                    </label>
                    <input
                      type="text"
                      value={form.genre ?? ''}
                      onChange={(e) => setForm((f) => ({ ...f, genre: e.target.value }))}
                      className="w-full px-3.5 py-2.5 bg-zinc-900 border border-white/10 rounded-lg text-white text-sm focus:border-red-600/50 focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-wider text-white/40 block mb-1.5">
                      {t('admin.duration')}
                    </label>
                    <input
                      type="text"
                      value={form.duration ?? ''}
                      onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))}
                      placeholder="1h 58m"
                      className="w-full px-3.5 py-2.5 bg-zinc-900 border border-white/10 rounded-lg text-white text-sm focus:border-red-600/50 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

               <div>
  <label className="text-xs uppercase tracking-wider text-white/40 block mb-1.5">
    {t('admin.trailerUrl')}
  </label>
  <input
    type="url"
    value={form.trailerUrl ?? ''}
    onChange={(e) => setForm((f) => ({ ...f, trailerUrl: e.target.value }))}
    placeholder="https://www.youtube.com/shorts/..."
    className="w-full px-3.5 py-2.5 bg-zinc-900 border border-white/10 rounded-lg text-white text-sm focus:border-red-600/50 focus:outline-none transition-colors"
  />
</div>

                <div>
                  <label className="text-xs uppercase tracking-wider text-white/40 block mb-1.5">
                    {t('admin.telegramLink')}
                  </label>
                  <input
                    type="url"
                    value={form.telegramLink ?? ''}
                    onChange={(e) => setForm((f) => ({ ...f, telegramLink: e.target.value }))}
                    placeholder="https://t.me/..."
                    className="w-full px-3.5 py-2.5 bg-zinc-900 border border-white/10 rounded-lg text-white text-sm focus:border-red-600/50 focus:outline-none transition-colors"
                  />
                </div>

                {/* Cover image upload */}
                <div>
                  <label className="text-xs uppercase tracking-wider text-white/40 block mb-1.5">
                    {t('admin.coverImage')}
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-28 rounded-lg overflow-hidden bg-zinc-900 border border-white/10 flex-shrink-0">
                      {form.coverImage ? (
                        <img src={form.coverImage} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="w-5 h-5 text-white/20" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <label className="inline-flex items-center gap-2 px-4 py-2 border border-white/10 hover:border-white/20 rounded-lg text-sm text-white/70 hover:text-white cursor-pointer transition-colors">
                        {uploading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            {t('admin.uploading')}
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4" />
                            {t('admin.uploadImage')}
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleUpload(file);
                          }}
                        />
                      </label>
                      <input
                        type="url"
                        value={form.coverImage}
                        onChange={(e) => setForm((f) => ({ ...f, coverImage: e.target.value }))}
                        placeholder="https://..."
                        className="w-full px-3.5 py-2.5 bg-zinc-900 border border-white/10 rounded-lg text-white text-sm focus:border-red-600/50 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Sponsor select */}
                <div>
                  <label className="text-xs uppercase tracking-wider text-white/40 block mb-1.5">
                    {t('admin.sponsor')}
                  </label>
                  <select
                    value={form.sponsorId ?? ''}
                    onChange={(e) => setForm((f) => ({ ...f, sponsorId: e.target.value || undefined }))}
                    className="w-full px-3.5 py-2.5 bg-zinc-900 border border-white/10 rounded-lg text-white text-sm focus:border-red-600/50 focus:outline-none transition-colors"
                  >
                    <option value="">{t('admin.noSponsor')}</option>
                    {sponsors.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                {/* Toggles */}
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.featured}
                      onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
                      className="w-4 h-4 rounded border-white/20 bg-zinc-900 text-red-600 focus:ring-red-600/50"
                    />
                    <span className="text-sm text-white/70 flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 text-red-400" />
                      {t('admin.featured')}
                    </span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isPremium}
                      onChange={(e) => setForm((f) => ({ ...f, isPremium: e.target.checked }))}
                      className="w-4 h-4 rounded border-white/20 bg-zinc-900 text-red-600 focus:ring-red-600/50"
                    />
                    <span className="text-sm text-white/70">{t('admin.premium')}</span>
                  </label>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-white/10" />

              {/* Translations */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Globe className="w-4 h-4 text-red-400" />
                  <h3 className="text-sm font-semibold text-white">{t('admin.translations')}</h3>
                </div>
                <p className="text-xs text-white/40 mb-4">{t('admin.translationsHint')}</p>

                {/* Lang tabs */}
                <div className="flex gap-1 mb-4">
                  {LANGS.map((l) => (
                    <button
                      key={l}
                      onClick={() => setActiveLang(l)}
                      className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
                        activeLang === l
                          ? 'bg-red-600/15 text-white border border-red-600/30'
                          : 'text-white/50 hover:text-white border border-transparent'
                      }`}
                    >
                      {LANG_LABELS[l]}
                    </button>
                  ))}
                </div>

                {/* Active lang fields */}
                <div className="space-y-4">
                  <div>
                    <label className="text-xs uppercase tracking-wider text-white/40 block mb-1.5">
                      {t('admin.title')} *
                    </label>
                    <input
                      type="text"
                      value={form.translations[activeLang].title}
                      onChange={(e) => setTr(activeLang, 'title', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-zinc-900 border border-white/10 rounded-lg text-white text-sm focus:border-red-600/50 focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-wider text-white/40 block mb-1.5">
                      {t('admin.synopsis')}
                    </label>
                    <textarea
                      value={form.translations[activeLang].synopsis}
                      onChange={(e) => setTr(activeLang, 'synopsis', e.target.value)}
                      rows={2}
                      className="w-full px-3.5 py-2.5 bg-zinc-900 border border-white/10 rounded-lg text-white text-sm focus:border-red-600/50 focus:outline-none transition-colors resize-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-wider text-white/40 block mb-1.5">
                      {t('admin.description')}
                    </label>
                    <textarea
                      value={form.translations[activeLang].description}
                      onChange={(e) => setTr(activeLang, 'description', e.target.value)}
                      rows={3}
                      className="w-full px-3.5 py-2.5 bg-zinc-900 border border-white/10 rounded-lg text-white text-sm focus:border-red-600/50 focus:outline-none transition-colors resize-none"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs uppercase tracking-wider text-white/40 block mb-1.5">
                        {t('admin.seoTitle')}
                      </label>
                      <input
                        type="text"
                        value={form.translations[activeLang].seoTitle}
                        onChange={(e) => setTr(activeLang, 'seoTitle', e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-zinc-900 border border-white/10 rounded-lg text-white text-sm focus:border-red-600/50 focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-xs uppercase tracking-wider text-white/40 block mb-1.5">
                        {t('admin.seoDescription')}
                      </label>
                      <input
                        type="text"
                        value={form.translations[activeLang].seoDescription}
                        onChange={(e) => setTr(activeLang, 'seoDescription', e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-zinc-900 border border-white/10 rounded-lg text-white text-sm focus:border-red-600/50 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form footer */}
            <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-white/10">
              <button
                onClick={closeForm}
                className="px-4 py-2.5 text-sm text-white/60 hover:text-white transition-colors"
              >
                {t('admin.cancel')}
              </button>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleSave(false)}
                  disabled={status === 'saving'}
                  className="inline-flex items-center gap-2 px-4 py-2.5 border border-white/10 hover:border-white/20 rounded-lg text-sm text-white/80 hover:text-white transition-colors disabled:opacity-50"
                >
                  {status === 'saving' ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {t('admin.saveDraft')}
                </button>
                <button
                  onClick={() => handleSave(true)}
                  disabled={status === 'saving'}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 rounded-lg text-sm text-white font-semibold transition-colors disabled:opacity-50"
                >
                  {status === 'saving' ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {editing ? t('admin.save') : t('admin.publish')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-zinc-950 shadow-2xl p-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-11 h-11 rounded-lg bg-red-600/15 flex items-center justify-center flex-shrink-0">
                <Trash2 className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white mb-1">{t('admin.delete')}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{t('admin.confirmDelete')}</p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={status === 'deleting'}
                className="px-4 py-2.5 text-sm text-white/60 hover:text-white transition-colors"
              >
                {t('admin.cancel')}
              </button>
              <button
                onClick={handleDelete}
                disabled={status === 'deleting'}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 rounded-lg text-sm text-white font-semibold transition-colors disabled:opacity-50"
              >
                {status === 'deleting' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                {t('admin.delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default WorksView;
