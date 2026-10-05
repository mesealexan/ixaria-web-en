export const site = {
  registration: {
    taxId: '43799883',
    companyNumber: 'J2021000791354',
    countryName: 'Romania',
  },
  name: 'Ixaria',
  url: 'https://ixaria.eu',
  language: 'en',
  locale: 'en_US',
  themeColor: '#090959',
  tagline: 'The conversion engine for the furniture industry.',
  bookingUrl: 'https://calendly.com/alex-ixaria/ixaria-strategy-session',
  company: {
    '@type': 'Organization',
    '@id': 'https://ixaria.eu/#organization',
    name: 'Ixaria',
    legalName: 'VIRTUALCONFIG S.R.L.',
    url: 'https://ixaria.eu',
    logo: {
      '@type': 'ImageObject',
      url: 'https://ixaria.eu/logo-light.svg',
    },
    description:
      'Ixaria helps small and medium furniture manufacturers sell more online through product page optimization, 3D configuration, AI-assisted product explanations, and behavior-driven continuous improvement.',
    foundingDate: '2021',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Str. Surorile Martir Caceu, Nr. 9',
      addressLocality: 'Timisoara',
      addressRegion: 'Timis',
      addressCountry: 'RO',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'office@ixaria.ro',
      contactType: 'customer service',
    },
    sameAs: [
      'https://www.linkedin.com/company/ixaria/',
      'https://www.facebook.com/ixaria.ro',
      'https://www.instagram.com/ixaria.ro/',
      'https://www.youtube.com/@alex.mesesan',
    ],
    founder: [
      {
        '@type': 'Person',
        name: 'Alexandru Mesesan',
        jobTitle: 'Co-founder',
        sameAs: 'https://www.linkedin.com/in/alexandru-mesesan/',
      },
      {
        '@type': 'Person',
        name: 'Victor Iancu',
        jobTitle: 'Co-founder',
        sameAs: 'https://www.linkedin.com/in/victoriancu/',
      },
      {
        '@type': 'Person',
        name: 'Eduard Badea',
        jobTitle: 'Co-founder',
        sameAs: 'https://www.linkedin.com/in/eduard-badea/',
      },
    ],
    knowsAbout: [
      'furniture ecommerce',
      'product page optimization',
      '3D product configurators',
      'furniture webshop conversion',
      'customer behavior analytics',
      'furniture manufacturer digital transformation',
    ],
  },
  social: [
    {
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/company/ixaria/',
      icon: '<svg viewBox="0 0 24 24" fill="currentColor">\n                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"></path>\n                <circle cx="4" cy="4" r="2"></circle>\n              </svg>',
    },
    {
      label: 'YouTube',
      href: 'https://www.youtube.com/@alex.mesesan',
      icon: '<svg viewBox="0 0 24 24" fill="currentColor">\n                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"></path>\n                <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#090959"></polygon>\n              </svg>',
    },
    {
      label: 'Instagram',
      href: 'https://www.instagram.com/ixaria.ro/',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">\n                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>\n                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>\n                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>\n              </svg>',
    },
    {
      label: 'Facebook',
      href: 'https://www.facebook.com/ixaria.ro',
      icon: '<svg viewBox="0 0 24 24" fill="currentColor">\n                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>\n              </svg>',
    },
  ],
  navigation: [
    {
      label: 'How it works',
      href: '/#how-it-works',
    },
    {
      label: 'Features',
      href: '/#features',
    },
    {
      label: 'About us',
      href: '/#about',
    },
  ],
  websiteLinks: [
    {
      label: 'Why Ixaria',
      href: '/#before-after',
    },
    {
      label: 'How it works',
      href: '/#how-it-works',
    },
    {
      label: 'Features',
      href: '/#features',
    },
    {
      label: 'Careers',
      href: '/cofounder.html',
    },
    {
      label: 'Book a call',
      href: 'https://calendly.com/alex-ixaria/ixaria-strategy-session',
      external: true,
    },
  ],
  legalLinks: [
    {
      label: 'Privacy Policy',
      href: '/privacy-policy.html',
    },
    {
      label: 'Terms',
      href: '/terms.html',
    },
    {
      label: 'Cookie Policy',
      href: '/cookie-policy.html',
    },
  ],
} as const;
