-- CreateTable
CREATE TABLE "public"."Article" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "coverImage" TEXT,
    "coverFit" TEXT NOT NULL DEFAULT 'contain',
    "authorName" TEXT NOT NULL,
    "authorPicture" TEXT,
    "authorRole" TEXT,
    "authorBio" TEXT,
    "tags" TEXT[],
    "date" TIMESTAMP(3) NOT NULL,
    "readTime" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Article_slug_key" ON "public"."Article"("slug");

-- CreateIndex
CREATE INDEX "Article_date_idx" ON "public"."Article"("date");

-- Seed the existing article so it is preserved after moving to the database.
INSERT INTO "public"."Article" (
    "id", "slug", "title", "excerpt", "content", "coverImage", "coverFit",
    "authorName", "authorPicture", "authorRole", "authorBio", "tags", "date",
    "readTime", "published", "createdAt", "updatedAt"
) VALUES (
    'seed_transcendental_0001',
    'if-god-is-transcendental-why-does-he-laugh-love-cry-and-act-like-us',
    $md$If God Is Transcendental, Why Does He Laugh, Love, Cry, and Act Like Us?$md$,
    $md$Kṛṣṇa appears not out of need but out of mercy—so we can hear His qualities, remember His pastimes, and reawaken our forgotten love for Him.$md$,
    $md$God does not come to the material world because He is forced to come, nor does He take a material body like an ordinary human being. He remains completely spiritual and transcendental. When Kṛṣṇa appears in this world, He comes by His own will and through His own spiritual potency. Therefore, although He may look and behave like a human being, His body, activities, emotions, and relationships are never material.

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

Thus, His appearance is an act of extraordinary mercy. Through His pastimes, He invites us to redirect the same natural tendency to love away from temporary material relationships and toward our eternal relationship with Him. By hearing about Kṛṣṇa from genuine scriptures and devotees, remembering Him, chanting His names, and rendering devotional service, the heart becomes purified, and our dormant love for Him gradually awakens.$md$,
    '/images/blog/transcendental-cover.png',
    'contain',
    'Jaya Dev Krsna Das',
    '/images/authors/sample-avatar.svg',
    'Community Contributor',
    NULL,
    ARRAY['Bhagavad-gita', 'Philosophy', 'Kṛṣṇa'],
    '2026-08-12 00:00:00',
    NULL,
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);
