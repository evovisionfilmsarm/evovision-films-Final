import type { ContentItem, Sponsor } from './types';

const heroImage = 'https://images.pexels.com/photos/23384400/pexels-photo-23384400.jpeg?auto=compress&cs=tinysrgb&w=1600';
const camImage = 'https://images.pexels.com/photos/13812458/pexels-photo-13812458.jpeg?auto=compress&cs=tinysrgb&w=1600';
const editorImage = 'https://images.pexels.com/photos/8100058/pexels-photo-8100058.jpeg?auto=compress&cs=tinysrgb&w=1600';
const reelImage = 'https://images.pexels.com/photos/34084909/pexels-photo-34084909.jpeg?auto=compress&cs=tinysrgb&w=1600';
const projectorImage = 'https://images.pexels.com/photos/34085954/pexels-photo-34085954.jpeg?auto=compress&cs=tinysrgb&w=1600';
const clapperImage = 'https://images.pexels.com/photos/1117132/pexels-photo-1117132.jpeg?auto=compress&cs=tinysrgb&w=1600';

const poster1 = 'https://images.pexels.com/photos/29263907/pexels-photo-29263907.jpeg?auto=compress&cs=tinysrgb&w=800';
const poster2 = 'https://images.pexels.com/photos/7991108/pexels-photo-7991108.jpeg?auto=compress&cs=tinysrgb&w=800';
const poster3 = 'https://images.pexels.com/photos/4882165/pexels-photo-4882165.jpeg?auto=compress&cs=tinysrgb&w=800';
const poster4 = 'https://images.pexels.com/photos/7991488/pexels-photo-7991488.jpeg?auto=compress&cs=tinysrgb&w=800';
const poster5 = 'https://images.pexels.com/photos/22624365/pexels-photo-22624365.jpeg?auto=compress&cs=tinysrgb&w=800';
const poster6 = 'https://images.pexels.com/photos/34261761/pexels-photo-34261761.jpeg?auto=compress&cs=tinysrgb&w=800';

export const sampleImages = {
  hero: heroImage,
  camera: camImage,
  editor: editorImage,
  reel: reelImage,
  projector: projectorImage,
  clapper: clapperImage,
};

export const sponsors: Sponsor[] = [
  {
    id: 's1',
    name: 'Cinema House',
    logo: undefined,
    banner: projectorImage,
    link: 'https://example.com',
    message: '',
    translations: {
      hy: { label: 'Գործընկեր', message: 'Cinema House-ը աջակցում է կինոարվեստի տարածմանը։' },
      ru: { label: 'Партнёр', message: 'Cinema House поддерживает развитие киноискусства.' },
      en: { label: 'Partner', message: 'Cinema House supports the spread of cinematic art.' },
    },
  },
];

export const sampleContent: ContentItem[] = [
  {
    id: 'c1',
    slug: 'the-red-room',
    type: 'movie',
    programSlug: 'kinomas',
    coverImage: poster1,
    trailerUrl: undefined,
    telegramLink: 'https://t.me/evovisionfilms',
    year: 2024,
    genre: 'Drama / Thriller',
    duration: '1h 58m',
    isPremium: false,
    isPublished: true,
    featured: true,
    publishedAt: '2024-09-15',
    sponsorId: 's1',
    translations: {
      hy: {
        title: 'Կարմիր սենյակը',
        synopsis: 'Խորհրդավոր սենյակ, որտեղ իրականությունը և երևակայությունը միախառնվում են։',
        description: 'EvoVision Films-ի ակնարկը՝ ֆիլմի մասին, որը հարցականի տակ է դնում հիշողության բնույթը։',
        seoTitle: 'Կարմիր սենյակը — KinoMas — EvoVision Films',
        seoDescription: 'Խորհրդավոր դրամա իրականության և երևակայության սահմաններին։',
      },
      ru: {
        title: 'Красная комната',
        synopsis: 'Таинственная комната, где реальность и воображение переплетаются.',
        description: 'Обзор EvoVision Films о фильме, ставящем под вопрос природу памяти.',
        seoTitle: 'Красная комната — KinoMas — EvoVision Films',
        seoDescription: 'Загадочная драма на границе реальности и воображения.',
      },
      en: {
        title: 'The Red Room',
        synopsis: 'A mysterious room where reality and imagination intertwine.',
        description: 'An EvoVision Films review of a film that questions the nature of memory.',
        seoTitle: 'The Red Room — KinoMas — EvoVision Films',
        seoDescription: 'A mysterious drama on the border of reality and imagination.',
      },
    },
  },
  {
    id: 'c2',
    slug: 'empty-seats',
    type: 'movie',
    programSlug: 'kinomas',
    coverImage: poster2,
    telegramLink: 'https://t.me/evovisionfilms',
    year: 2023,
    genre: 'Mystery',
    duration: '2h 12m',
    isPremium: false,
    isPublished: true,
    featured: true,
    publishedAt: '2024-08-20',
    translations: {
      hy: {
        title: 'Դատարկ նստատեղեր',
        synopsis: 'Մի կինոթատրոն, որը պատմություններ է պահում յուրաքանչյուր նստատեղի մեջ։',
        description: 'EvoVision Films-ի քննադատական ակնարկը մի ֆիլմի մասին, որը հանգիստ է և հզոր։',
        seoTitle: 'Դատարկ նստատեղեր — KinoMas — EvoVision Films',
        seoDescription: 'Խորհրդավոր ֆիլմ լռության և հիշողության մասին։',
      },
      ru: {
        title: 'Пустые места',
        synopsis: 'Кинотеатр, хранящий истории в каждом зрительском месте.',
        description: 'Критический обзор EvoVision Films о тихом, но мощном фильме.',
        seoTitle: 'Пустые места — KinoMas — EvoVision Films',
        seoDescription: 'Загадочный фильм о тишине и памяти.',
      },
      en: {
        title: 'Empty Seats',
        synopsis: 'A cinema that keeps stories in every seat.',
        description: 'An EvoVision Films critical review of a quiet but powerful film.',
        seoTitle: 'Empty Seats — KinoMas — EvoVision Films',
        seoDescription: 'A mysterious film about silence and memory.',
      },
    },
  },
  {
    id: 'c3',
    slug: 'behind-the-lens',
    type: 'episode',
    programSlug: 'kadrich-durs',
    categorySlug: 'directors',
    coverImage: poster3,
    trailerUrl: undefined,
    isPremium: false,
    isPublished: true,
    featured: true,
    publishedAt: '2024-09-01',
    translations: {
      hy: {
        title: 'Ոսպնյակի հետևում',
        synopsis: 'Ռեժիսորի աշխատանքը՝ վիդեոյի մեջ ներկայացված։',
        description: 'Մի դրվագ այն մասին, թե ինչպես է ռեժիսորը կառուցում տեսողական պատմությունը։',
        seoTitle: 'Ոսպնյակի հետևում — Կադրից դուրս — EvoVision Films',
        seoDescription: 'Ռեժիսորական արվեստի ուսումնասիրություն։',
      },
      ru: {
        title: 'За объективом',
        synopsis: 'Работа режиссёра, представленная на видео.',
        description: 'Эпизод о том, как режиссёр строит визуальную историю.',
        seoTitle: 'За объективом — Кадрич Дурс — EvoVision Films',
        seoDescription: 'Изучение режиссёрского искусства.',
      },
      en: {
        title: 'Behind the Lens',
        synopsis: 'The director\'s work, presented on video.',
        description: 'An episode about how a director builds a visual story.',
        seoTitle: 'Behind the Lens — Kadrich Durs — EvoVision Films',
        seoDescription: 'A study of the art of directing.',
      },
    },
  },
  {
    id: 'c4',
    slug: 'the-cut-that-changed-everything',
    type: 'episode',
    programSlug: 'kadrich-durs',
    categorySlug: 'editors',
    coverImage: editorImage,
    isPremium: false,
    isPublished: true,
    featured: false,
    publishedAt: '2024-07-10',
    translations: {
      hy: {
        title: 'Մոնտաժը, որը փոխեց ամեն ինչ',
        synopsis: 'Ինչպես մեկ մոնտաժային որոշումը կարող է վերափոխել ֆիլմը։',
        description: 'Մոնտաժողների մասին դրվագ՝ կենտրոնացած արվեստի վրայ։',
        seoTitle: 'Մոնտաժը, որը փոխեց ամեն ինչ — Կադրից դուրս',
        seoDescription: 'Մոնտաժային արվեստի ուսումնասիրություն։',
      },
      ru: {
        title: 'Монтаж, изменивший всё',
        synopsis: 'Как одно монтажное решение может преобразить фильм.',
        description: 'Эпизод о монтажёрах, сосредоточенный на искусстве.',
        seoTitle: 'Монтаж, изменивший всё — Кадрич Дурс',
        seoDescription: 'Изучение монтажного искусства.',
      },
      en: {
        title: 'The Cut That Changed Everything',
        synopsis: 'How a single editing decision can transform a film.',
        description: 'An episode about editors, focused on the craft.',
        seoTitle: 'The Cut That Changed Everything — Kadrich Durs',
        seoDescription: 'A study of the editing craft.',
      },
    },
  },
  {
    id: 'c5',
    slug: 'intro-to-color-grading',
    type: 'lesson',
    programSlug: 'academy',
    categorySlug: 'beginner',
    coverImage: 'https://images.pexels.com/photos/30229850/pexels-photo-30229850.jpeg?auto=compress&cs=tinysrgb&w=800',
    isPremium: false,
    isPublished: true,
    featured: false,
    difficulty: 'beginner',
    publishedAt: '2024-09-05',
    translations: {
      hy: {
        title: 'Գունային գրեդինգի ներածություն',
        synopsis: 'Գույնի հիմունքները և ինչպես այն ստեղծում է տրամադրություն։',
        description: 'Սկսնակների համար դաս՝ գունային գրեդինգի աշխարհ մուտք գործելու համար։',
        seoTitle: 'Գունային գրեդինգի ներածություն — Ակադեմիա — EvoVision Films',
        seoDescription: 'Գունային գրեդինգի հիմունքները սկսնակների համար։',
      },
      ru: {
        title: 'Введение в цветокоррекцию',
        synopsis: 'Основы цвета и как он создаёт настроение.',
        description: 'Урок для новичков по входу в мир цветокоррекции.',
        seoTitle: 'Введение в цветокоррекцию — Академия — EvoVision Films',
        seoDescription: 'Основы цветокоррекции для новичков.',
      },
      en: {
        title: 'Intro to Color Grading',
        synopsis: 'The fundamentals of color and how it creates mood.',
        description: 'A beginner lesson to enter the world of color grading.',
        seoTitle: 'Intro to Color Grading — Academy — EvoVision Films',
        seoDescription: 'The fundamentals of color grading for beginners.',
      },
    },
  },
  {
    id: 'c6',
    slug: 'advanced-transitions',
    type: 'lesson',
    programSlug: 'academy',
    categorySlug: 'advanced',
    coverImage: 'https://images.pexels.com/photos/8102676/pexels-photo-8102676.jpeg?auto=compress&cs=tinysrgb&w=800',
    isPremium: true,
    isPublished: true,
    featured: false,
    difficulty: 'advanced',
    publishedAt: '2025-01-01',
    translations: {
      hy: {
        title: 'Առաջադեմ անցումներ',
        synopsis: 'Պրոֆեսիոնալ անցումներ և տեխնիկական մոտեցումներ։',
        description: 'Պրեմիում դաս — շուտով հասանելի կլինի։',
        seoTitle: 'Առաջադեմ անցումներ — Ակադեմիա — EvoVision Films',
        seoDescription: 'Պրոֆեսիոնալ մոնտաժային անցումներ։',
      },
      ru: {
        title: 'Продвинутые переходы',
        synopsis: 'Профессиональные переходы и технические подходы.',
        description: 'Премиум-урок — скоро будет доступен.',
        seoTitle: 'Продвинутые переходы — Академия — EvoVision Films',
        seoDescription: 'Профессиональные монтажные переходы.',
      },
      en: {
        title: 'Advanced Transitions',
        synopsis: 'Professional transitions and technical approaches.',
        description: 'Premium lesson — coming soon.',
        seoTitle: 'Advanced Transitions — Academy — EvoVision Films',
        seoDescription: 'Professional editing transitions.',
      },
    },
  },
  {
    id: 'c7',
    slug: 'the-silent-frame',
    type: 'movie',
    programSlug: 'kinomas',
    coverImage: poster4,
    telegramLink: 'https://t.me/evovisionfilms',
    year: 2022,
    genre: 'Drama',
    duration: '1h 42m',
    isPremium: false,
    isPublished: true,
    featured: false,
    publishedAt: '2024-06-01',
    translations: {
      hy: {
        title: 'Լուռ կադրը',
        synopsis: 'Մի ֆիլմ, որը խոսում է լռությամբ։',
        description: 'EvoVision Films-ի ակնարկը մինիմալիստական կինոյի մասին։',
        seoTitle: 'Լուռ կադրը — KinoMas — EvoVision Films',
        seoDescription: 'Մինիմալիստական դրամա լռության մասին։',
      },
      ru: {
        title: 'Тихий кадр',
        synopsis: 'Фильм, говорящий молчанием.',
        description: 'Обзор EvoVision Films о минималистичном кино.',
        seoTitle: 'Тихий кадр — KinoMas — EvoVision Films',
        seoDescription: 'Минималистичная драма о молчании.',
      },
      en: {
        title: 'The Silent Frame',
        synopsis: 'A film that speaks through silence.',
        description: 'An EvoVision Films review of minimalist cinema.',
        seoTitle: 'The Silent Frame — KinoMas — EvoVision Films',
        seoDescription: 'A minimalist drama about silence.',
      },
    },
  },
  {
    id: 'c8',
    slug: 'light-as-a-character',
    type: 'episode',
    programSlug: 'kadrich-durs',
    categorySlug: 'cinematographers',
    coverImage: 'https://images.pexels.com/photos/8147706/pexels-photo-8147706.jpeg?auto=compress&cs=tinysrgb&w=800',
    isPremium: false,
    isPublished: true,
    featured: false,
    publishedAt: '2024-05-20',
    translations: {
      hy: {
        title: 'Լույսը որպես կերպար',
        synopsis: 'Ինչպես է կինոօպերատորը լույսը դարձնում պատմող։',
        description: 'Կինոօպերատորական արվեստի մասին դրվագ։',
        seoTitle: 'Լույսը որպես կերպար — Կադրից դուրս',
        seoDescription: 'Կինոօպերատորական լուսավորության արվեստ։',
      },
      ru: {
        title: 'Свет как персонаж',
        synopsis: 'Как кинооператор делает свет рассказчиком.',
        description: 'Эпизод об операторском искусстве.',
        seoTitle: 'Свет как персонаж — Кадрич Дурс',
        seoDescription: 'Искусство операторского освещения.',
      },
      en: {
        title: 'Light as a Character',
        synopsis: 'How a cinematographer turns light into a narrator.',
        description: 'An episode about the art of cinematography.',
        seoTitle: 'Light as a Character — Kadrich Durs',
        seoDescription: 'The art of cinematographic lighting.',
      },
    },
  },
];

export const kadrichCategories = [
  { slug: 'directors', key: 'kadrich.categoryDirectors' as const },
  { slug: 'screenwriters', key: 'kadrich.categoryScreenwriters' as const },
  { slug: 'cinematographers', key: 'kadrich.categoryCinematographers' as const },
  { slug: 'editors', key: 'kadrich.categoryEditors' as const },
  { slug: 'actors', key: 'kadrich.categoryActors' as const },
  { slug: 'production', key: 'kadrich.categoryProduction' as const },
  { slug: 'techniques', key: 'kadrich.categoryTechniques' as const },
];

export const academyCategories = [
  { slug: 'beginner', key: 'academy.beginner' as const },
  { slug: 'intermediate', key: 'academy.intermediate' as const },
  { slug: 'advanced', key: 'academy.advanced' as const },
  { slug: 'techniques', key: 'academy.techniques' as const },
  { slug: 'software', key: 'academy.software' as const },
  { slug: 'exercises', key: 'academy.exercises' as const },
];

export function getContentBySlug(slug: string): ContentItem | undefined {
  return sampleContent.find((c) => c.slug === slug);
}

export function getContentByProgram(programSlug: string): ContentItem[] {
  return sampleContent.filter((c) => c.programSlug === programSlug && c.isPublished);
}

export function getFeaturedContent(): ContentItem[] {
  return sampleContent.filter((c) => c.featured && c.isPublished);
}

export function getRelatedContent(item: ContentItem, limit = 3): ContentItem[] {
  return sampleContent
    .filter((c) => c.id !== item.id && c.programSlug === item.programSlug && c.isPublished)
    .slice(0, limit);
}

export function getSponsorById(id?: string): Sponsor | undefined {
  if (!id) return undefined;
  return sponsors.find((s) => s.id === id);
}
