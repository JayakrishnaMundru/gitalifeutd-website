-- CreateEnum
CREATE TYPE "public"."StudentStatus" AS ENUM ('UNDERGRAD', 'GRAD', 'PHD', 'ALUMNI', 'FACULTY', 'STAFF', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."DietaryPreference" AS ENUM ('VEG', 'VEGAN', 'NO_PREFERENCE', 'OTHER');

-- CreateTable
CREATE TABLE "public"."Event" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "startDateTime" TIMESTAMP(3) NOT NULL,
    "endDateTime" TIMESTAMP(3) NOT NULL,
    "location" TEXT NOT NULL,
    "tags" TEXT[],
    "speakerName" TEXT,
    "speakerBio" TEXT,
    "coverImage" TEXT,
    "gallery" TEXT[],
    "description" TEXT NOT NULL,
    "agenda" TEXT,
    "faq" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RSVP" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "studentStatus" "public"."StudentStatus" NOT NULL,
    "dietaryPreference" "public"."DietaryPreference" NOT NULL DEFAULT 'VEG',
    "notes" TEXT,
    "consent" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RSVP_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Event_slug_key" ON "public"."Event"("slug");

-- CreateIndex
CREATE INDEX "Event_startDateTime_idx" ON "public"."Event"("startDateTime");

-- CreateIndex
CREATE INDEX "RSVP_eventId_idx" ON "public"."RSVP"("eventId");

-- CreateIndex
CREATE INDEX "RSVP_email_idx" ON "public"."RSVP"("email");

-- AddForeignKey
ALTER TABLE "public"."RSVP" ADD CONSTRAINT "RSVP_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
