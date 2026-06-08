/**
 * Single source of truth for project identity, contact details and social links.
 * Used by metadata, the footer, headers and documentation.
 */
export const SITE = {
  name: 'Dental Management System',
  shortName: 'DMS',
  tagline: 'Modern clinic management for dental practices',
  description:
    'A secure, open-source dental clinic management system to manage patient records, staff and payroll — built with Next.js, TypeScript and MySQL.',
  author: 'Aashish Bharti',
  email: 'aashish@marketdoctorsonline.com',
  repo: 'https://github.com/aashishbharti04/dental-management-system',
  social: {
    github: 'https://github.com/aashishbharti04',
    linkedin: 'https://in.linkedin.com/in/aashana1012',
    youtube: 'https://www.youtube.com/@CodeWithAsur',
    instagram: 'https://www.instagram.com/asurwave1012?igsh=ZDBlY2NtczJ5cmMw',
  },
} as const;
