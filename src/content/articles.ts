import { slugify } from '@/lib/slug'

export type Author = {
  /** Full name shown on cards and the article page. */
  name: string
  /** Photo of the author. Local path (e.g. /images/authors/asha.jpg) or an external URL. Optional—initials are shown if omitted. */
  picture?: string
  /** Short role/label, e.g. "UTD – CS" or "Student Contributor". */
  role?: string
  /** One or two sentences about the author, shown at the end of the article. */
  bio?: string
}

export type Article = {
  /** URL slug. If omitted it is generated from the title. */
  slug?: string
  title: string
  /** Short teaser shown on the list page. */
  excerpt: string
  author: Author
  /** Hero/cover image. Local path or external URL. Optional—a gradient is shown if omitted. */
  coverImage?: string
  /** ISO date string, e.g. "2026-02-14". */
  date: string
  /** Optional reading time label, e.g. "5 min read". Auto-estimated if omitted. */
  readTime?: string
  tags?: string[]
  /**
   * Article body. Supports a light markdown subset:
   *   ## Heading            -> section heading
   *   ### Smaller heading
   *   > quote               -> blockquote (great for verses)
   *   - list item           -> bullet list
   *   ---                   -> divider
   *   blank line            -> new paragraph
   */
  content: string
}

/**
 * Add new articles to this list. The newest (by date) appears first automatically.
 * Just give the title, author, and body—everything else has sensible defaults.
 */
const rawArticles: Article[] = [
  {
    title: 'If God Is Transcendental, Why Does He Laugh, Love, Cry, and Act Like Us?',
    excerpt:
      'Kṛṣṇa appears not out of need but out of mercy—so we can hear His qualities, remember His pastimes, and reawaken our forgotten love for Him.',
    author: {
      name: 'Jaya Dev Krsna Das',
      role: 'Community Contributor',
      // Sample placeholder photo—swap for a real one later, e.g. '/images/authors/jaya-dev-krsna-das.jpg'
      picture: '/images/authors/sample-avatar.svg',
    },
    coverImage: '/images/blog/transcendental-cover.png',
    date: '2026-08-12',
    tags: ['Bhagavad-gita', 'Philosophy', 'Kṛṣṇa'],
    content: `God does not come to the material world because He is forced to come, nor does He take a material body like an ordinary human being. He remains completely spiritual and transcendental. When Kṛṣṇa appears in this world, He comes by His own will and through His own spiritual potency. Therefore, although He may look and behave like a human being, His body, activities, emotions, and relationships are never material.

## He comes for our sake, not His own

Someone may ask,

> If God is all-powerful, why does He need to come personally? Could He not accomplish everything without coming?

Certainly, He can. God can protect the devotees, destroy evil, and maintain the universe simply by His will. He does not need to come for His own sake. He comes for our sake.

## Reviving a forgotten relationship

The purpose of human life is not merely to accept that God exists, but to revive our forgotten personal relationship with Him. A relationship cannot develop simply by knowing that someone exists. We become attracted to a person when we hear about their qualities, character, activities, affection, and dealings with others.

Therefore, out of His causeless mercy, Kṛṣṇa personally appears and reveals His beautiful qualities and pastimes. He becomes the loving child of Mother Yaśodā, the dear friend of the cowherd boys, the beloved of the residents of Vṛndāvana, the protector of His devotees, and the compassionate guide of Arjuna. By hearing about these dealings, our hearts gradually become attracted to Him. By remembering Him, serving Him, and chanting His names, our forgotten relationship with Him begins to awaken.

## Our emotions are reflections of His

In this material world, we experience emotions such as love, friendship, parental affection, service, compassion, separation, and even loving disagreement. These emotions do not originate independently in the material world. Everything that exists here has its original and pure reality in the spiritual world. The material emotions we experience are temporary, imperfect, and often mixed with selfishness, but their original forms exist eternally and purely in relation to Kṛṣṇa.

For example, parental affection exists perfectly in Mother Yaśodā's love for Kṛṣṇa. Friendship exists perfectly in the relationship between Kṛṣṇa and the cowherd boys. The mood of service exists perfectly in Kṛṣṇa's devotees, and conjugal love exists in its highest and purest form in the residents of Vṛndāvana. When Kṛṣṇa comes, He reveals these spiritual relationships in a way that we can hear about, remember, and gradually become attracted to.

Kṛṣṇa's emotions should therefore not be misunderstood as ordinary human emotions. Rather, our emotions are only limited reflections of the complete and unlimited emotions that eternally exist in Him. We do not imagine God according to human experience; instead, our ability to love, feel friendship, show affection, and enter relationships exists because these qualities originally exist in the Supreme Person.

## His appearance is an act of mercy

Kṛṣṇa comes not because He needs anything from this world, but because we need the opportunity to know Him personally. He makes the invisible spiritual reality visible to us. He allows us to hear His words, understand His qualities, remember His pastimes, and become attracted to His personality.

Thus, His appearance is an act of extraordinary mercy. Through His pastimes, He invites us to redirect the same natural tendency to love away from temporary material relationships and toward our eternal relationship with Him. By hearing about Kṛṣṇa from genuine scriptures and devotees, remembering Him, chanting His names, and rendering devotional service, the heart becomes purified, and our dormant love for Him gradually awakens.`,
  },
  {
    title: 'Finding Stillness in a Restless World',
    excerpt:
      'How a few minutes of mantra meditation between classes can quiet the noise and bring you back to yourself.',
    author: {
      name: 'Asha Rao',
      role: 'UTD – Neuroscience',
      bio: 'Asha is a third-year student who discovered mantra meditation during finals week and never looked back.',
    },
    coverImage: '/images/events/what-is-knowledge.jpg',
    date: '2026-02-14',
    tags: ['Meditation', 'Student Life', 'Mindfulness'],
    content: `We live inside a constant hum. Notifications, deadlines, the low static of the next thing we should be doing. Somewhere underneath all of it is a quieter version of ourselves that we rarely get to meet.

## The practice is simpler than you think

You do not need an hour, a cushion, or a mountain retreat. You need a few honest minutes and a sound to rest your attention on.

> Chant, and be happy.

Start with the breath. Let it slow on its own. Then let a mantra carry the mind gently, the way a current carries a leaf—no force, no grabbing.

### What actually changes

Nothing dramatic on the first day. But over a couple of weeks you begin to notice the gap between a feeling and your reaction to it. That gap is freedom.

- You sleep a little easier
- You interrupt people a little less
- The small frustrations lose their grip

The world stays restless. You just stop being pulled under by every wave.`,
  },
]

/** All articles, newest first, with slug and readTime guaranteed. */
export const articles: Array<Required<Pick<Article, 'slug' | 'readTime'>> & Article> = rawArticles
  .map((a) => ({
    ...a,
    slug: a.slug ?? slugify(a.title),
    readTime: a.readTime ?? estimateReadTime(a.content),
  }))
  .sort((a, b) => +new Date(b.date) - +new Date(a.date))

export function getAllArticles() {
  return articles
}

export function getArticleBySlug(slug: string) {
  return articles.find((a) => a.slug === slug)
}

function estimateReadTime(content: string) {
  const words = content.trim().split(/\s+/).length
  const minutes = Math.max(1, Math.round(words / 200))
  return `${minutes} min read`
}
