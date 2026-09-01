import { useEffect, useState } from 'react';
import {
  AlertCircle,
  Check,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  Upload,
  X,
} from 'lucide-react';

import { useLanguage } from '@/lib/LanguageContext';

import {
  fetchAllContent,
  createContent,
  updateContent,
  deleteContent,
  type ContentInput,
} from '@/lib/adminApi';

import type {
  ContentItem,
  ContentTranslation,
  Language,
} from '@/lib/types';

import { uploadImage } from '@/lib/imageUpload';

const LANGS: Language[] = ['hy', 'ru', 'en'];

function emptyTranslations(): Record<Language, ContentTranslation> {
  return {
    hy: {
      title: '',
      synopsis: '',
      description: '',
      seoTitle: '',
      seoDescription: '',
    },
    ru: {
      title: '',
      synopsis: '',
      description: '',
      seoTitle: '',
      seoDescription: '',
    },
    en: {
      title: '',
      synopsis: '',
      description: '',
      seoTitle: '',
      seoDescription: '',
    },
  };
}

function emptyLessonInput(): ContentInput {
  return {
    slug: '',
    type: 'lesson',
    programSlug: 'academy',
    categorySlug: '',
    coverImage: '',
    trailerUrl: '',
    telegramLink: '',
    year: undefined,
    genre: '',
    duration: '',
    difficulty: 'beginner',
    isPremium: false,
    isPublished: false,
    featured: false,
    sponsorId: undefined,
    translations: emptyTranslations(),
  };
}

function lessonToInput(lesson: ContentItem): ContentInput {
  return {
    slug: lesson.slug,
    type: 'lesson',
    programSlug: 'academy',
    categorySlug: lesson.categorySlug ?? '',
    coverImage: lesson.coverImage,
    trailerUrl: lesson.trailerUrl ?? '',
    telegramLink: lesson.telegramLink ?? '',
    year: lesson.year,
    genre: lesson.genre ?? '',
    duration: lesson.duration ?? '',
    difficulty: lesson.difficulty ?? 'beginner',
    isPremium: lesson.isPremium,
    isPublished: lesson.isPublished,
    featured: lesson.featured,
    sponsorId: lesson.sponsorId,
    translations: { ...lesson.translations },
  };
}

type Status = 'idle' | 'saving' | 'deleting';

export function LessonsView() {
  const { t } = useLanguage();

  const [lessons, setLessons] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<ContentItem | null>(null);

  const [form, setForm] = useState<ContentInput>(emptyLessonInput());
  const [activeLang, setActiveLang] = useState<Language>('hy');

  const [status, setStatus] = useState<Status>('idle');
  const [uploading, setUploading] = useState(false);

  const [formError, setFormError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ContentItem | null>(null);

  const loadLessons = async () => {
    setLoading(true);

    const all = await fetchAllContent();

    setLessons(
      all
        .filter((item) => item.type === 'lesson' && item.programSlug === 'academy')
        .sort((a, b) => {
          const aDate = a.publishedAt || '';
          const bDate = b.publishedAt || '';
          return bDate.localeCompare(aDate);
        })
    );

    setLoading(false);
  };

  useEffect(() => {
    loadLessons();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyLessonInput());
    setActiveLang('hy');
    setFormError(null);
    setShowForm(true);
  };

  const openEdit = (lesson: ContentItem) => {
    setEditing(lesson);
    setForm(lessonToInput(lesson));
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
      type: 'lesson',
      programSlug: 'academy',
      isPublished: publish,
    };

    if (!input.slug.trim()) {
      setFormError(t('admin.required'));
      setStatus('idle');
      return;
    }

    const hasTitle = LANGS.every(
      (lang) => input.translations[lang].title.trim().length > 0
    );

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
    setEditing(null);

    setSuccessMsg(t('admin.saved'));

    await loadLessons();

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
      return;
    }

    setSuccessMsg(t('admin.deleted'));

    await loadLessons();

    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    setFormError(null);

    const url = await uploadImage(file, 'academy');

    setUploading(false);

    if (url) {
      setForm((current) => ({
        ...current,
        coverImage: url,
      }));
    } else {
      setFormError(t('admin.uploadError'));
    }
  };

  const setTr = (
    language: Language,
    field: keyof ContentTranslation,
    value: string
  ) => {
    setForm((current) => ({
      ...current,
      translations: {
        ...current.translations,
        [language]: {
          ...current.translations[language],
          [field]: value,
        },
      },
    }));
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
            {t('admin.lessons')}
          </h1>

          <p className="mt-1 text-sm text-white/40">
            {lessons.length} {t('admin.totalLessons')}
          </p>
        </div>

        <button
          onClick={openCreate}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 rounded-lg text-sm text-white font-semibold transition-colors"
        >
          <Plus className="w-4 h-4" />
          {t('admin.newLesson')}
        </button>
      </div>

      {/* Success */}
      {successMsg && (
        <div className="mb-6 flex items-center gap-2.5 px-4 py-3 rounded-lg border border-green-600/30 bg-green-600/10 text-green-400 text-sm">
          <Check className="w-4 h-4" />
          {successMsg}
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-6 h-6 text-red-500 animate-spin" />
        </div>
      ) : lessons.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-zinc-900/30 p-12 text-center">
          <p className="text-sm text-white/40 mb-5">
            {t('admin.noItems')}
          </p>

          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 rounded-lg text-sm text-white font-semibold transition-colors"
          >
            <Plus className="w-4 h-4" />
            {t('admin.newLesson')}
          </button>
        </div>
      ) : (
        <div className="rounded-xl border border-white/10 bg-zinc-950/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 text-left">
                  <th className="px-4 py-3 text-xs uppercase tracking-wider text-white/40">
                    {t('admin.name')}
                  </th>

                  <th className="px-4 py-3 text-xs uppercase tracking-wider text-white/40 hidden md:table-cell">
                    {t('admin.difficulty')}
                  </th>

                  <th className="px-4 py-3 text-xs uppercase tracking-wider text-white/40">
                    {t('admin.status')}
                  </th>

                  <th className="px-4 py-3 text-xs uppercase tracking-wider text-white/40 text-right">
                    {t('admin.actions')}
                  </th>
                </tr>
              </thead>

              <tbody>
                {lessons.map((lesson) => {
                  const title =
                    lesson.translations.hy?.title ||
                    lesson.translations.en?.title ||
                    lesson.slug;

                  return (
                    <tr
                      key={lesson.id}
                      className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]"
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          {lesson.coverImage ? (
                            <img
                              src={lesson.coverImage}
                              alt={title}
                              className="w-12 h-16 rounded-md object-cover bg-zinc-900"
                            />
                          ) : (
                            <div className="w-12 h-16 rounded-md bg-zinc-900 border border-white/10 flex items-center justify-center">
                              <Upload className="w-4 h-4 text-white/20" />
                            </div>
                          )}

                          <div>
                            <p className="text-sm font-medium text-white">
                              {title}
                            </p>

                            <p className="text-xs text-white/30 mt-1">
                              {lesson.slug}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4 hidden md:table-cell">
                        <span className="text-sm text-white/60">
                          {lesson.difficulty
                            ? t(`academy.${lesson.difficulty}` as never)
                            : '—'}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        {lesson.isPublished ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-green-600/15 text-green-400">
                            {t('admin.published')}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-amber-600/15 text-amber-400">
                            {t('admin.draft')}
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openEdit(lesson)}
                            className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-colors"
                            aria-label={t('admin.edit')}
                          >
                            <Pencil className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => setDeleteTarget(lesson)}
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
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <h2 className="text-lg font-bold text-white">
                {editing ? t('admin.editLesson') : t('admin.newLesson')}
              </h2>

              <button
                onClick={closeForm}
                className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-6 max-h-[calc(100vh-12rem)] overflow-y-auto">
              {formError && (
                <div className="flex items-center gap-2.5 px-4 py-3 rounded-lg border border-red-600/30 bg-red-600/10 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {formError}
                </div>
              )}

              {/* Basic */}
              <div className="space-y-4">
                <div>
                  <label className="text-xs uppercase tracking-wider text-white/40 block mb-1.5">
                    {t('admin.slug')} *
                  </label>

                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) =>
                      setForm((current) => ({
                        ...current,
                        slug: e.target.value,
                      }))
                    }
                    placeholder="montage-basics-01"
                    className="w-full px-3.5 py-2.5 bg-zinc-900 border border-white/10 rounded-lg text-white text-sm focus:border-red-600/50 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs uppercase tracking-wider text-white/40 block mb-1.5">
                      {t('admin.duration')}
                    </label>

                    <input
                      type="text"
                      value={form.duration ?? ''}
                      onChange={(e) =>
                        setForm((current) => ({
                          ...current,
                          duration: e.target.value,
                        }))
                      }
                      placeholder="12:30"
                      className="w-full px-3.5 py-2.5 bg-zinc-900 border border-white/10 rounded-lg text-white text-sm focus:border-red-600/50 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs uppercase tracking-wider text-white/40 block mb-1.5">
                      {t('admin.difficulty')}
                    </label>

                    <select
                      value={form.difficulty ?? 'beginner'}
                      onChange={(e) =>
                        setForm((current) => ({
                          ...current,
                          difficulty: e.target.value as ContentInput['difficulty'],
                        }))
                      }
                      className="w-full px-3.5 py-2.5 bg-zinc-900 border border-white/10 rounded-lg text-white text-sm focus:border-red-600/50 focus:outline-none"
                    >
                      <option value="beginner">
                        {t('academy.beginner')}
                      </option>
                      <option value="intermediate">
                        {t('academy.intermediate')}
                      </option>
                      <option value="advanced">
                        {t('academy.advanced')}
                      </option>
                    </select>
                  </div>
                </div>

                {/* Cover upload */}
                <div>
                  <label className="text-xs uppercase tracking-wider text-white/40 block mb-1.5">
                    {t('admin.coverImage')}
                  </label>

                  <div className="flex flex-col sm:flex-row gap-4">
                    {form.coverImage && (
                      <img
                        src={form.coverImage}
                        alt=""
                        className="w-24 h-32 rounded-lg object-cover border border-white/10"
                      />
                    )}

                    <label className="flex-1 min-h-32 rounded-lg border border-dashed border-white/15 bg-white/[0.02] hover:bg-white/[0.04] cursor-pointer flex flex-col items-center justify-center text-center transition-colors">
                      {uploading ? (
                        <Loader2 className="w-6 h-6 text-red-500 animate-spin mb-2" />
                      ) : (
                        <Upload className="w-6 h-6 text-white/30 mb-2" />
                      )}

                      <span className="text-sm text-white/60">
                        {uploading
                          ? t('admin.uploading')
                          : t('admin.uploadImage')}
                      </span>

                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={uploading}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleUpload(file);
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Languages */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  {LANGS.map((language) => (
                    <button
                      key={language}
                      onClick={() => setActiveLang(language)}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                        activeLang === language
                          ? 'bg-red-600 text-white'
                          : 'bg-white/5 text-white/50 hover:text-white'
                      }`}
                    >
                      {language.toUpperCase()}
                    </button>
                  ))}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs uppercase tracking-wider text-white/40 block mb-1.5">
                      {t('admin.name')} *
                    </label>

                    <input
                      type="text"
                      value={form.translations[activeLang].title}
                      onChange={(e) =>
                        setTr(activeLang, 'title', e.target.value)
                      }
                      className="w-full px-3.5 py-2.5 bg-zinc-900 border border-white/10 rounded-lg text-white text-sm focus:border-red-600/50 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs uppercase tracking-wider text-white/40 block mb-1.5">
                      {t('admin.synopsis')}
                    </label>

                    <textarea
                      rows={3}
                      value={form.translations[activeLang].synopsis}
                      onChange={(e) =>
                        setTr(activeLang, 'synopsis', e.target.value)
                      }
                      className="w-full px-3.5 py-2.5 bg-zinc-900 border border-white/10 rounded-lg text-white text-sm focus:border-red-600/50 focus:outline-none resize-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs uppercase tracking-wider text-white/40 block mb-1.5">
                      {t('admin.description')}
                    </label>

                    <textarea
                      rows={6}
                      value={form.translations[activeLang].description}
                      onChange={(e) =>
                        setTr(activeLang, 'description', e.target.value)
                      }
                      className="w-full px-3.5 py-2.5 bg-zinc-900 border border-white/10 rounded-lg text-white text-sm focus:border-red-600/50 focus:outline-none resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Video / Telegram */}
              <div className="space-y-4">
                <div>
                  <label className="text-xs uppercase tracking-wider text-white/40 block mb-1.5">
                    Video / Telegram URL
                  </label>

                  <input
                    type="url"
                    value={form.telegramLink ?? ''}
                    onChange={(e) =>
                      setForm((current) => ({
                        ...current,
                        telegramLink: e.target.value,
                      }))
                    }
                    placeholder="https://..."
                    className="w-full px-3.5 py-2.5 bg-zinc-900 border border-white/10 rounded-lg text-white text-sm focus:border-red-600/50 focus:outline-none"
                  />
                </div>

                <div className="flex flex-wrap gap-5">
                  <label className="flex items-center gap-2 text-sm text-white/70 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isPremium}
                      onChange={(e) =>
                        setForm((current) => ({
                          ...current,
                          isPremium: e.target.checked,
                        }))
                      }
                      className="accent-red-600"
                    />
                    {t('admin.premium')}
                  </label>

                  <label className="flex items-center gap-2 text-sm text-white/70 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.featured}
                      onChange={(e) =>
                        setForm((current) => ({
                          ...current,
                          featured: e.target.checked,
                        }))
                      }
                      className="accent-red-600"
                    />
                    {t('admin.featured')}
                  </label>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/10">
              <button
                onClick={closeForm}
                disabled={status === 'saving'}
                className="px-4 py-2.5 text-sm text-white/60 hover:text-white transition-colors"
              >
                {t('admin.cancel')}
              </button>

              <button
                onClick={() => handleSave(false)}
                disabled={status === 'saving'}
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-white/10 hover:border-white/20 rounded-lg text-sm text-white/80 transition-colors disabled:opacity-50"
              >
                {status === 'saving' && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
                {t('admin.saveDraft')}
              </button>

              <button
                onClick={() => handleSave(true)}
                disabled={status === 'saving'}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 rounded-lg text-sm text-white font-semibold transition-colors disabled:opacity-50"
              >
                {status === 'saving' && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
                {editing ? t('admin.save') : t('admin.publish')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-zinc-950 shadow-2xl p-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-11 h-11 rounded-lg bg-red-600/15 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-400" />
              </div>

              <div>
                <h3 className="text-base font-semibold text-white mb-1">
                  {t('admin.delete')}
                </h3>

                <p className="text-sm text-white/50 leading-relaxed">
                  {t('admin.confirmDelete')}
                </p>
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
                {status === 'deleting' ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}

                {t('admin.delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}