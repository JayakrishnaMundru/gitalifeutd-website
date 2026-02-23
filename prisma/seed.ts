import { PrismaClient, StudentStatus, DietaryPreference } from '@prisma/client'

const prisma = new PrismaClient()

function iso(s: string) {
  return new Date(s)
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

async function main() {
  // Idempotent seed
  const existing = await prisma.event.count()
  if (existing > 0) {
    console.log(`Seed skipped: ${existing} events already exist.`)
    return
  }

  const now = new Date()
  const day = 24 * 60 * 60 * 1000

  const locations = [
    'UT Dallas – Student Union (SU) Galaxy Rooms',
    'UT Dallas – SSA Auditorium (ECSW)',
    'UT Dallas – Founders North (FN) Lounge',
    'UT Dallas – JO 3.516 (Discussion Room)',
    'Plano – Oak Point Park Pavilion',
    'Richardson – CityLine Plaza (Community Space)',
  ]

  const speakerProfiles = {
    corporate: {
      name: 'Arjun Mehta',
      bio: 'Fortune 500 product leader and long-time mentor in campus spiritual communities. Known for making timeless wisdom practical for modern work, relationships, and mental wellbeing.',
    },
    outreach: {
      name: 'Dr. Kavya Iyer',
      bio: 'University outreach pioneer who has led beginner-friendly study circles across campuses. Focuses on identity, purpose, and building joyful habits through mantra meditation.',
    },
    retreat: {
      name: 'Raghunath Das',
      bio: 'Retreat facilitator and kirtan leader. Helps newcomers experience meditation through sound, community, and simple daily practices.',
    },
  }

  const upcoming = [
    {
      title: "Meet a Monk: Facing Life’s Defining Choices",
      startDateTime: iso('2026-03-11T19:00:00-06:00'),
      endDateTime: iso('2026-03-11T20:30:00-06:00'),
      location: 'UT Dallas – Founders North (FN) 2.104',
      tags: ['Meet a Monk', 'Talk', 'Free Dinner'],
      speakerName: 'Romapada Swami',
      speakerBio:
        'Vedic monk & scholar. Fortune 500 guest speaker and university outreach pioneer; inspires study circles and community programs across campuses.',
      coverImage: '/images/events/facing-lifes-defining-choices.jpg',
      gallery: [],
      description:
        "A beginner-friendly talk on decision-making, clarity, and purpose—followed by Q&A and a free vegetarian dinner. Come as you are; no background needed.",
      agenda:
        '- Welcome\n- Talk\n- Q&A\n- Free dinner + meet new friends',
      faq:
        'Q: Is this beginner-friendly?\nA: Yes.\n\nQ: Is dinner included?\nA: Yes—free vegetarian dinner.',
    },
    {
      title: 'Meet a Monk: What is Knowledge? (Talk + Q&A)',
      startDateTime: iso('2026-11-11T19:00:00-06:00'),
      endDateTime: iso('2026-11-11T20:30:00-06:00'),
      location: 'UT Dallas – Founders North (FN) 2.104',
      tags: ['Meet a Monk', 'Talk', 'Free Dinner'],
      speakerName: 'Romapada Swami',
      speakerBio:
        'Vedic monk & scholar. Fortune 500 guest speaker and university outreach pioneer; retreat leader and mentor for young professionals.',
      coverImage: '/images/events/what-is-knowledge.jpg',
      gallery: [],
      description:
        'A vibrant campus talk exploring what real knowledge is, how to think clearly, and how to build a meaningful life—with free vegetarian dinner included.',
      agenda:
        '- Welcome\n- Talk\n- Q&A\n- Free dinner',
      faq:
        'Q: Do I need any background?\nA: No.\n\nQ: Can I come with friends?\nA: Yes—bring them!',
    },

    {
      title: 'Identity Crisis: Who Am I Really? (Beginner Talk + Q&A)',
      startDateTime: new Date(now.getTime() + 3 * day),
      endDateTime: new Date(now.getTime() + 3 * day + 90 * 60 * 1000),
      location: locations[0],
      tags: ['Beginner', 'Talk', 'Q&A'],
      speakerName: speakerProfiles.outreach.name,
      speakerBio: speakerProfiles.outreach.bio,
      coverImage: '/images/events/identity-crisis.jpg',
      gallery: [],
      description:
        'A warm, beginner-friendly session on identity, anxiety, comparison, and how timeless wisdom helps you find stable clarity—without being preachy. Includes a simple guided mantra meditation at the end.',
      agenda:
        '- Welcome + icebreaker\n- The root of identity crisis\n- Practical clarity: self beyond labels\n- Guided mantra meditation (2 minutes)\n- Q&A + snacks',
      faq:
        'Q: Do I need any background?\nA: None—just come as you are.\n\nQ: Is this religious?\nA: It is spiritual and practical—no pressure to believe anything blindly.',
    },
    {
      title: 'Bhagavad-gita Study Circle: Chapter 2 (Life, Death, and the Self)',
      startDateTime: new Date(now.getTime() + 7 * day),
      endDateTime: new Date(now.getTime() + 7 * day + 75 * 60 * 1000),
      location: locations[3],
      tags: ['Gita', 'Discussion', 'Weekly'],
      speakerName: speakerProfiles.corporate.name,
      speakerBio: speakerProfiles.corporate.bio,
      coverImage: '/images/events/gita-circle.jpg',
      gallery: [],
      description:
        'A friendly discussion-based circle. Read a few verses together, unpack the meaning, and apply it to student life, relationships, and work.',
      agenda:
        '- Verse reading\n- Small-group discussion\n- Practical takeaways\n- Optional mantra meditation',
      faq:
        'Q: Can I join even if I haven’t read before?\nA: Yes. We’ll summarize everything.',
    },
    {
      title: 'Kirtan Night: Sound Meditation + Community Dinner',
      startDateTime: new Date(now.getTime() + 10 * day),
      endDateTime: new Date(now.getTime() + 10 * day + 120 * 60 * 1000),
      location: locations[1],
      tags: ['Kirtan', 'Meditation', 'Dinner'],
      speakerName: speakerProfiles.retreat.name,
      speakerBio: speakerProfiles.retreat.bio,
      coverImage: '/images/events/kirtan-night.jpg',
      gallery: [],
      description:
        'Experience mantra meditation through music. No singing skill needed—just participate or listen. Ends with a warm vegetarian dinner.',
      agenda:
        '- Welcome\n- Kirtan (call-and-response)\n- Short reflection\n- Dinner + meet new friends',
      faq:
        'Q: What should I bring?\nA: Just yourself—comfortable clothes.',
    },
    {
      title: 'Service Saturday: Seva + Study (Beginner Friendly)',
      startDateTime: new Date(now.getTime() + 14 * day),
      endDateTime: new Date(now.getTime() + 14 * day + 150 * 60 * 1000),
      location: locations[4],
      tags: ['Service', 'Community', 'Outreach'],
      speakerName: speakerProfiles.outreach.name,
      speakerBio: speakerProfiles.outreach.bio,
      coverImage: '/images/events/service-saturday.jpg',
      gallery: [],
      description:
        'A joyful mix of community service and a short guided reflection. Great for newcomers who want to do something meaningful with good people.',
      agenda:
        '- Meet\n- Community service\n- Short reading + reflection\n- Snacks',
      faq:
        'Q: Is this only for members?\nA: Everyone is welcome.',
    },
    {
      title: 'Workshop: Habits for a Calm Mind (Mantra + Routine)',
      startDateTime: new Date(now.getTime() + 18 * day),
      endDateTime: new Date(now.getTime() + 18 * day + 90 * 60 * 1000),
      location: locations[2],
      tags: ['Workshop', 'Mental Wellbeing', 'Beginner'],
      speakerName: speakerProfiles.corporate.name,
      speakerBio: speakerProfiles.corporate.bio,
      coverImage: '/images/events/calm-mind.jpg',
      gallery: [],
      description:
        'A practical workshop on attention, habits, and simple mantra meditation you can do in 2 minutes daily. Clear, modern, and grounded in timeless wisdom.',
      agenda:
        '- Why the mind feels restless\n- Simple daily structure\n- Guided mantra meditation\n- Q&A',
      faq:
        'Q: Is this therapy?\nA: No—this is a spiritual practice workshop for self-discipline and clarity.',
    },
    {
      title: 'Retreat Info Session: Spring Weekend Getaway',
      startDateTime: new Date(now.getTime() + 24 * day),
      endDateTime: new Date(now.getTime() + 24 * day + 60 * 60 * 1000),
      location: locations[5],
      tags: ['Retreat', 'Info', 'Community'],
      speakerName: speakerProfiles.retreat.name,
      speakerBio: speakerProfiles.retreat.bio,
      coverImage: '/images/events/retreat-info.jpg',
      gallery: [],
      description:
        'Learn about our beginner-friendly spring retreat: schedule, travel, costs, and what to expect. Bring questions.',
      agenda:
        '- Overview\n- What happens at a retreat\n- Logistics\n- Q&A',
      faq:
        'Q: Do I need experience?\nA: No—retreats are designed for beginners too.',
    },
  ]

  const past = [
    {
      title: 'Welcome Night: Meet the Community + Mini Meditation',
      startDateTime: new Date(now.getTime() - 5 * day),
      endDateTime: new Date(now.getTime() - 5 * day + 90 * 60 * 1000),
      location: locations[0],
      tags: ['Community', 'Beginner'],
      speakerName: speakerProfiles.outreach.name,
      speakerBio: speakerProfiles.outreach.bio,
      coverImage: '/images/events/welcome-night.jpg',
      gallery: [],
      description:
        'A relaxed hangout to meet new friends, learn what we do, and try a short mantra meditation. Includes snacks.',
      agenda: 'Meet + greet\nShort reflection\nMantra meditation\nSnacks',
      faq: 'Q: Can I come alone?\nA: Yes—many people do.',
    },
    {
      title: 'Gita in Daily Life: Stress, Purpose, and Clarity',
      startDateTime: new Date(now.getTime() - 12 * day),
      endDateTime: new Date(now.getTime() - 12 * day + 75 * 60 * 1000),
      location: locations[1],
      tags: ['Talk', 'Gita'],
      speakerName: speakerProfiles.corporate.name,
      speakerBio: speakerProfiles.corporate.bio,
      coverImage: '/images/events/gita-daily-life.jpg',
      gallery: [],
      description:
        'A practical talk connecting student life pressure to timeless principles for clarity and steadiness.',
      agenda: 'Talk\nQ&A\nDinner',
      faq: 'Q: Is there a reading?\nA: Optional. We provide handouts.',
    },
    {
      title: 'Kirtan & Chai Night',
      startDateTime: new Date(now.getTime() - 20 * day),
      endDateTime: new Date(now.getTime() - 20 * day + 120 * 60 * 1000),
      location: locations[2],
      tags: ['Kirtan', 'Meditation'],
      speakerName: speakerProfiles.retreat.name,
      speakerBio: speakerProfiles.retreat.bio,
      coverImage: '/images/events/kirtan-chai.jpg',
      gallery: [],
      description:
        'An evening of sound meditation and warm chai. A joyful way to reset the mind.',
      agenda: 'Kirtan\nShort reflection\nChai + community time',
      faq: 'Q: Do I have to sing?\nA: Not at all.',
    },
    {
      title: 'Service + Satsang: Weekend Community Outreach',
      startDateTime: new Date(now.getTime() - 27 * day),
      endDateTime: new Date(now.getTime() - 27 * day + 180 * 60 * 1000),
      location: locations[4],
      tags: ['Service', 'Outreach'],
      speakerName: speakerProfiles.outreach.name,
      speakerBio: speakerProfiles.outreach.bio,
      coverImage: '/images/events/service-satsang.jpg',
      gallery: [],
      description:
        'A day of meaningful service followed by discussion and a vegetarian meal.',
      agenda: 'Service\nDiscussion\nMeal',
      faq: 'Q: Is transportation provided?\nA: We coordinate carpools.',
    },
    {
      title: 'Beginner Series: Meditation Through Sound (Part 1)',
      startDateTime: new Date(now.getTime() - 34 * day),
      endDateTime: new Date(now.getTime() - 34 * day + 75 * 60 * 1000),
      location: locations[3],
      tags: ['Beginner', 'Series', 'Meditation'],
      speakerName: speakerProfiles.retreat.name,
      speakerBio: speakerProfiles.retreat.bio,
      coverImage: '/images/events/beginner-series-1.jpg',
      gallery: [],
      description:
        'A gentle introduction to mantra meditation and how to start a 2-minute daily practice.',
      agenda: 'Talk\nGuided practice\nQ&A',
      faq: 'Q: Will this be awkward?\nA: No—very beginner-friendly.',
    },
    {
      title: 'Guest Talk: Purpose & Leadership (Corporate Outreach Special)',
      startDateTime: new Date(now.getTime() - 45 * day),
      endDateTime: new Date(now.getTime() - 45 * day + 90 * 60 * 1000),
      location: locations[1],
      tags: ['Guest Speaker', 'Purpose', 'Leadership'],
      speakerName: speakerProfiles.corporate.name,
      speakerBio: speakerProfiles.corporate.bio,
      coverImage: '/images/events/purpose-leadership.jpg',
      gallery: [],
      description:
        'A guest session on purpose, character, and building a life that feels meaningful—without burnout.',
      agenda: 'Talk\nQ&A\nNetworking',
      faq: 'Q: Is it only for business students?\nA: No—open to all majors.',
    },
  ]

  const all = [...upcoming, ...past].map((e) => ({
    ...e,
    slug: slugify(e.title),
  }))

  await prisma.event.createMany({ data: all })

  // Create a small sample RSVP on the first upcoming event
  const firstEvent = await prisma.event.findFirst({ orderBy: { startDateTime: 'asc' } })
  if (firstEvent) {
    await prisma.rSVP.create({
      data: {
        eventId: firstEvent.id,
        fullName: 'Sample Student',
        email: 'sample@student.utdallas.edu',
        phone: '',
        studentStatus: StudentStatus.UNDERGRAD,
        dietaryPreference: DietaryPreference.VEG,
        notes: 'Excited to join! First time.',
        consent: true,
      },
    })
  }

  console.log('Seed complete.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
