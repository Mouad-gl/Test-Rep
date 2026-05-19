const categoryColors = {
  Conference: { from: '#061a10', to: '#030d07', accent: '#6ee7b7', button: '#059669', glow: 'rgba(110,231,183,0.18)' },
  Summit:     { from: '#060e1f', to: '#030810', accent: '#93c5fd', button: '#3b82f6', glow: 'rgba(147,197,253,0.18)' },
  Hackathon:  { from: '#10071a', to: '#080310', accent: '#c084fc', button: '#9333ea', glow: 'rgba(192,132,252,0.18)' },
  Workshop:   { from: '#1a0f00', to: '#0f0800', accent: '#fbbf24', button: '#d97706', glow: 'rgba(251,191,36,0.18)' },
  Meetup:     { from: '#001414', to: '#000a0a', accent: '#2dd4bf', button: '#0d9488', glow: 'rgba(45,212,191,0.18)' },
}

const defaultColor = { from: '#061a10', to: '#030d07', accent: '#6ee7b7', button: '#059669', glow: 'rgba(110,231,183,0.18)' }

export function colorForCategory(cat) {
  return categoryColors[cat] ?? defaultColor
}

export const fallbackEvents = [
  {
    id: 1,
    title: 'Coding Conf 2025',
    category: 'Conference',
    date: 'Jan 31, 2025',
    time: '9:00 AM – 6:00 PM',
    location: 'Austin Convention Center, Austin, TX',
    description: 'Join thousands of developers for a day of keynotes, workshops, and networking at the biggest coding conference of 2025.',
    price: 'Free',
    tags: ['Web Dev', 'AI', 'Networking', 'Open Source'],
    color: categoryColors.Conference,
  },
  {
    id: 2,
    title: 'AI & ML Summit',
    category: 'Summit',
    date: 'Feb 15, 2025',
    time: '10:00 AM – 5:00 PM',
    location: 'MIT Media Lab, Cambridge, MA',
    description: 'Explore the latest breakthroughs in artificial intelligence and machine learning.',
    price: '$49',
    tags: ['AI', 'Machine Learning', 'Research', 'Python'],
    color: categoryColors.Summit,
  },
  {
    id: 3,
    title: 'Open Source Day',
    category: 'Hackathon',
    date: 'Mar 8, 2025',
    time: '8:00 AM – 8:00 PM',
    location: 'GitHub HQ, San Francisco, CA',
    description: 'Twelve hours of open source contributions, collaboration, and community.',
    price: 'Free',
    tags: ['Open Source', 'Collaboration', 'Community', 'Git'],
    color: categoryColors.Hackathon,
  },
  {
    id: 4,
    title: 'Frontend Fiesta',
    category: 'Workshop',
    date: 'Mar 22, 2025',
    time: '2:00 PM – 8:00 PM',
    location: 'Vercel HQ, San Francisco, CA',
    description: 'A focused half-day workshop covering React 19, Next.js 15, animations, and web performance.',
    price: '$25',
    tags: ['React', 'Next.js', 'CSS', 'Performance'],
    color: categoryColors.Workshop,
  },
  {
    id: 5,
    title: 'DevOps Connect',
    category: 'Meetup',
    date: 'Apr 5, 2025',
    time: '6:00 PM – 9:00 PM',
    location: 'AWS Loft, New York, NY',
    description: 'Monthly meetup for DevOps engineers. GitOps, Kubernetes best practices, and CI/CD pipelines.',
    price: 'Free',
    tags: ['DevOps', 'Cloud', 'Kubernetes', 'CI/CD'],
    color: categoryColors.Meetup,
  },
  {
    id: 6,
    title: 'Security Summit 2025',
    category: 'Summit',
    date: 'Apr 19, 2025',
    time: '9:00 AM – 5:00 PM',
    location: 'Las Vegas Convention Center, NV',
    description: 'Deep dives into cybersecurity, penetration testing, and zero-trust architectures.',
    price: '$79',
    tags: ['Security', 'CTF', 'Pentesting', 'Zero Trust'],
    color: { from: '#1a0505', to: '#0d0303', accent: '#f87171', button: '#dc2626', glow: 'rgba(248,113,113,0.18)' },
  },
]

export const categories = ['All', 'Conference', 'Summit', 'Hackathon', 'Workshop', 'Meetup']
