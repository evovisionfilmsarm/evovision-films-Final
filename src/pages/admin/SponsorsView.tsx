import { useEffect, useState } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Upload,
  Loader as Loader2,
  CircleAlert as AlertCircle,
  CircleCheck as CheckCircle2,
  Image as ImageIcon,
  Globe,
  ExternalLink,
  Power,
} from 'lucide-react';

import { useLanguage } from '../../lib/LanguageContext';
import type { Language, Sponsor, SponsorTranslation } from '../../lib/types';

import {
  fetchAllSponsors,
  createSponsor,
  updateSponsor,
  deleteSponsor,
  type SponsorInput,
} from '../../lib/adminApi';

import { uploadImage } from '../../lib/imageUpload';

const LANGS: Language[] = ['hy', 'ru', 'en'];

const LANG_LABELS: Record<Language, string> = {
  hy: 'HY',
  ru: 'RU',
  en: 'EN',
};

function emptyTranslations(): Record<Language, SponsorTranslation> {
  return {
    hy: { label: '', message: '' },
    ru: { label: '', message: '' },
    en: { label: '', message: '' },
  };
}

function emptySponsorInput(): SponsorInput {
  return {
    name: '',
    logo: '',
    banner: '',
    link: '',
    isActive: true,
    translations: emptyTranslations(),
  };
}

function sponsorToInput(sponsor: Sponsor): SponsorInput {
  return {
    name: sponsor.name,
    logo: sponsor.logo ?? '',
    banner: sponsor.banner ?? '',
    link: sponsor.link,
    isActive: sponsor.isActive ?? true,
    translations: {
      hy: { ...sponsor.translations.hy },
      ru: { ...sponsor.translations.ru },
      en: { ...sponsor.translations.en },
    },
  };
}

type Status = 'idle' | 'saving' | 'deleting';

export function SponsorsView() {
  const { t, lang } = useLanguage();

  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Sponsor | null>(null);

  const [form, setForm] = useState<SponsorInput>(emptySponsorInput());
  const [activeLang, setActiveLang] = useState<Language>('hy');

  const [status, setStatus] = useState<Status>('idle');
  const [formError, setFormError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<Sponsor | null>(null);

  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);

  const loadSponsors = async () => {
    setLoading(true);

    const all = await fetchAllSponsors();

    setSponsors(all);
    setLoading(false);
  };

  useEffect(() => {
    loadSponsors();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptySponsorInput());
    setActiveLang('hy');
    setFormError(null);
    setShowForm(true);
  };

  const openEdit = (sponsor: Sponsor) => {
    setEditing(sponsor);
    setForm(sponsorToInput(sponsor));
    setActiveLang('hy');
    setFormError(null);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditing(null);
    setFormError(null);
  };

  const handleSave = async () => {
    setStatus('saving');
    setFormError(null);

    if (!form.name.trim()) {
      setFormError(t('admin.required'));
      setStatus('idle');
      return;
    }

    if (!form.link.trim()) {
      setFormError(t('admin.required'));
      setStatus('idle');
      return;
    }

    const hasTranslations = LANGS.every(
      (l) =>
        form.translations[l].label.trim().length > 0 &&
        form.translations[l].message.trim().length > 0
    );

    if (!hasTranslations) {
      setFormError(t('admin.translationsHint'));
      setStatus('idle');
      return;
    }

    const result = editing
      ? await updateSponsor(editing.id, form)
      : await createSponsor(form);

    if (result.error) {
      setFormError(result.error);
      setStatus('idle');
      return;
    }

    setStatus('idle');
    setShowForm(false);
    setEditing(null);

    setSuccessMsg(t('admin.saved'));

    await loadSponsors();

    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setStatus('deleting');

    const { error } = await deleteSponsor(deleteTarget.id);

    setStatus('idle');
    setDeleteTarget(null);

    if (error) {
      setFormError(error);
    } else {
      setSuccessMsg(t('admin.deleted'));

      await loadSponsors();

      setTimeout(() => setSuccessMsg(null), 3000);
    }
  };

  const handleLogoUpload = async (file: File) => {
    setUploadingLogo(true);
    setFormError(null);

    const url = await uploadImage(file, 'sponsors');

    setUploadingLogo(false);

    if (url) {
      setForm((f) => ({
        ...f,
        logo: url,
      }));
    } else {
      setFormError(t('admin.uploadError'));
    }
  };

  const handleBannerUpload = async (file: File) => {
    setUploadingBanner(true);
    setFormError(null);

    const url = await uploadImage(file, 'sponsors');

    setUploadingBanner(false);

    if (url) {
      setForm((f) => ({
        ...f,
        banner: url,
      }));
    } else {
      setFormError(t('admin.uploadError'));
    }
  };

  const setTr = (
    l: Language,
    field: keyof SponsorTranslation,
    value: string
  ) => {
    setForm((f) => ({
      ...f,
      translations: {
        ...f.translations,
        [l]: {
          ...f.translations[l],
          [field]: value,
        },
      },
    }));
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
            {t('admin.sponsors')}
          </h1>

          <p className="mt-1 text-sm text-white/50">
            {t('admin.totalSponsors')}: {sponsors.length}
          </p>
        </div>

        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          {t('admin.newSponsor')}
        </button>
      </div>

      {/* Success */}
      {successMsg && (
        <div className="mb-6 flex items-center gap-2.5 px-4 py-3 rounded-lg border border-green-600/30 bg-green-600/10 text-green-400 text-sm">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          {successMsg}
        </div>
      )}

      {/* Error */}
      {formError && !showForm && (
        <div className="mb-6 flex items-center gap-2.5 px-4 py-3 rounded-lg border border-red-600/30 bg-red-600/10 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {formError}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-24 rounded-xl bg-zinc-900/50 border border-white/5 animate-pulse"
            />
          ))}
        </div>
      ) : sponsors.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-zinc-900/30 p-16 text-center">
          <ImageIcon className="w-10 h-10 text-white/20 mx-auto mb-4" />

          <p className="text-sm text-white/40">
            {t('admin.noItems')}
          </p>
        </div>
      ) : (
        /* Sponsors table */
        <div className="rounded-xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-zinc-900/60 border-b border-white/10">
                  <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-white/40 font-semibold">
                    {t('admin.logo')}
                  </th>

                  <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-white/40 font-semibold">
                    {t('admin.name')}
                  </th>

                  <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-white/40 font-semibold hidden md:table-cell">
                    {t('admin.link')}
                  </th>

                  <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-white/40 font-semibold">
                    {t('admin.status')}
                  </th>

                  <th className="text-right px-4 py-3 text-xs uppercase tracking-wider text-white/40 font-semibold">
                    {t('admin.actions')}
                  </th>
                </tr>
              </thead>

              <tbody>
                {sponsors.map((sponsor) => {
                  const tr =
                    sponsor.translations[lang] ??
                    sponsor.translations.en;

                  return (
                    <tr
                      key={sponsor.id}
                      className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                    >
                      {/* Logo */}
                      <td className="px-4 py-3">
                        <div className="w-14 h-14 rounded-lg overflow-hidden bg-zinc-950 border border-white/10">
                          {sponsor.logo ? (
                            <img
                              src={sponsor.logo}
                              alt={sponsor.name}
                              className="w-full h-full object-contain p-1"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ImageIcon className="w-5 h-5 text-white/20" />
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Name */}
                      <td className="px-4 py-3">
                        <div className="text-sm text-white font-medium">
                          {sponsor.name}
                        </div>

                        <div className="text-xs text-white/40 mt-1">
                          {tr.label}
                        </div>
                      </td>

                      {/* Link */}
                      <td className="px-4 py-3 hidden md:table-cell">
                        {sponsor.link ? (
                          <a
                            href={sponsor.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-sm text-red-400 hover:text-red-300"
                          >
                            {sponsor.link}
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        ) : (
                          <span className="text-white/30">—</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        {sponsor.isActive ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-green-600/15 text-green-400">
                            <Power className="w-3 h-3" />
                            {t('admin.active')}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-white/5 text-white/40">
                            <Power className="w-3 h-3" />
                            {t('admin.inactive')}
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openEdit(sponsor)}
                            className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-colors"
                            aria-label={t('admin.edit')}
                          >
                            <Pencil className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => setDeleteTarget(sponsor)}
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
                {editing
                  ? t('admin.editSponsor')
                  : t('admin.newSponsor')}
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

              {/* General */}
              <div className="space-y-4">

                {/* Name */}
                <div>
                  <label className="text-xs uppercase tracking-wider text-white/40 block mb-1.5">
                    {t('admin.name')} *
                  </label>

                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        name: e.target.value,
                      }))
                    }
                    placeholder="Sponsor name"
                    className="w-full px-3.5 py-2.5 bg-zinc-900 border border-white/10 rounded-lg text-white text-sm focus:border-red-600/50 focus:outline-none transition-colors"
                  />
                </div>

                {/* Link */}
                <div>
                  <label className="text-xs uppercase tracking-wider text-white/40 block mb-1.5">
                    {t('admin.link')} *
                  </label>

                  <input
                    type="url"
                    value={form.link}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        link: e.target.value,
                      }))
                    }
                    placeholder="https://..."
                    className="w-full px-3.5 py-2.5 bg-zinc-900 border border-white/10 rounded-lg text-white text-sm focus:border-red-600/50 focus:outline-none transition-colors"
                  />
                </div>

                {/* Logo */}
                <div>
                  <label className="text-xs uppercase tracking-wider text-white/40 block mb-1.5">
                    {t('admin.logo')}
                  </label>

                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 rounded-lg overflow-hidden bg-zinc-900 border border-white/10 flex-shrink-0">
                      {form.logo ? (
                        <img
                          src={form.logo}
                          alt=""
                          className="w-full h-full object-contain p-2"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="w-6 h-6 text-white/20" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 space-y-2">
                      <label className="inline-flex items-center gap-2 px-4 py-2 border border-white/10 hover:border-white/20 rounded-lg text-sm text-white/70 hover:text-white cursor-pointer transition-colors">
                        {uploadingLogo ? (
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
                            if (file) handleLogoUpload(file);
                          }}
                        />
                      </label>

                      <input
                        type="url"
                        value={form.logo ?? ''}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            logo: e.target.value,
                          }))
                        }
                        placeholder="https://..."
                        className="w-full px-3.5 py-2.5 bg-zinc-900 border border-white/10 rounded-lg text-white text-sm focus:border-red-600/50 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Banner */}
                <div>
                  <label className="text-xs uppercase tracking-wider text-white/40 block mb-1.5">
                    {t('admin.banner')}
                  </label>

                  <div className="space-y-3">
                    <div className="w-full aspect-video rounded-lg overflow-hidden bg-zinc-900 border border-white/10">
                      {form.banner ? (
                        <img
                          src={form.banner}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="w-7 h-7 text-white/20" />
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <label className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-white/10 hover:border-white/20 rounded-lg text-sm text-white/70 hover:text-white cursor-pointer transition-colors">
                        {uploadingBanner ? (
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
                            if (file) handleBannerUpload(file);
                          }}
                        />
                      </label>

                      <input
                        type="url"
                        value={form.banner ?? ''}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            banner: e.target.value,
                          }))
                        }
                        placeholder="https://..."
                        className="flex-1 px-3.5 py-2.5 bg-zinc-900 border border-white/10 rounded-lg text-white text-sm focus:border-red-600/50 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Active */}
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        isActive: e.target.checked,
                      }))
                    }
                    className="w-4 h-4 rounded border-white/20 bg-zinc-900 text-red-600 focus:ring-red-600/50"
                  />

                  <span className="text-sm text-white/70 flex items-center gap-1.5">
                    <Power className="w-3.5 h-3.5 text-red-400" />
                    {t('admin.active')}
                  </span>
                </label>
              </div>

              <div className="border-t border-white/10" />

              {/* Translations */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Globe className="w-4 h-4 text-red-400" />

                  <h3 className="text-sm font-semibold text-white">
                    {t('admin.translations')}
                  </h3>
                </div>

                <p className="text-xs text-white/40 mb-4">
                  {t('admin.translationsHint')}
                </p>

                {/* Language tabs */}
                <div className="flex gap-1 mb-4">
                  {LANGS.map((l) => (
                    <button
                      key={l}
                      type="button"
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

                {/* Active language */}
                <div className="space-y-4">

                  {/* Label */}
                  <div>
                    <label className="text-xs uppercase tracking-wider text-white/40 block mb-1.5">
                      {t('admin.label')} *
                    </label>

                    <input
                      type="text"
                      value={form.translations[activeLang].label}
                      onChange={(e) =>
                        setTr(
                          activeLang,
                          'label',
                          e.target.value
                        )
                      }
                      placeholder="Partner"
                      className="w-full px-3.5 py-2.5 bg-zinc-900 border border-white/10 rounded-lg text-white text-sm focus:border-red-600/50 focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="text-xs uppercase tracking-wider text-white/40 block mb-1.5">
                      {t('admin.message')} *
                    </label>

                    <textarea
                      value={form.translations[activeLang].message}
                      onChange={(e) =>
                        setTr(
                          activeLang,
                          'message',
                          e.target.value
                        )
                      }
                      rows={5}
                      placeholder="Sponsor message..."
                      className="w-full px-3.5 py-2.5 bg-zinc-900 border border-white/10 rounded-lg text-white text-sm focus:border-red-600/50 focus:outline-none transition-colors resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-white/10">
              <button
                onClick={closeForm}
                className="px-4 py-2.5 text-sm text-white/60 hover:text-white transition-colors"
              >
                {t('admin.cancel')}
              </button>

              <button
                onClick={handleSave}
                disabled={status === 'saving'}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 rounded-lg text-sm text-white font-semibold transition-colors disabled:opacity-50"
              >
                {status === 'saving' ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : null}

                {editing
                  ? t('admin.save')
                  : t('admin.save')}
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
              <div className="w-11 h-11 rounded-lg bg-red-600/15 flex items-center justify-center flex-shrink-0">
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