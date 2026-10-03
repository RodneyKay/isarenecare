// Central place for all Isarene business details, images and navigation.
// Images currently point at the client's live site; download them into /public/img for production.
const U = 'https://isarene.com/wp-content/uploads/';
const site = {
  name: 'Isarene Home Care Services',
  short: 'Isarene',
  tagline: 'Care that moves with you',
  url: process.env.SITE_URL || 'https://isarene.com',
  phonePrimary: { display: '(978) 303-5318', tel: '+19783035318' },
  phoneSecondary: { display: '(781) 215-3184', tel: '+17812153184' },
  email: 'Info@isarene.com',
  address: '258 Salem Rd, Suite 8, Billerica, MA 01862',
  hours: 'Available 24/7 for home care services',
  social: {
    instagram: 'https://www.instagram.com/p/DalcPogxKSz/',
    youtube: 'https://www.youtube.com/@IsareneHomeCareServices'
  },
  img: {
    logo: U + '2026/07/Untitled-2-03.png',
    favicon: U + '2026/07/cropped-Untitled-2-03-270x270.png',
    og: U + '2026/09/unnamed-5.jpg',
    video: U + '2026/07/ISARENE-LOGO-REVEAL.mp4',
    hero: U + '2026/09/unnamed-5.jpg',
    about1: U + '2026/08/20260828173254_10-PHOTO-2026-08-27-21-58-33-1024x682.jpg',
    about2: U + '2026/07/health-insurance-service-young-asian-caregiver-nurse-examine-senior-man-or-woman-patient-at-home.jpg',
    homecare: U + '2026/07/gallery-ayaa-image-3.jpg',
    staffing: U + '2026/07/asasssss-1024x683.png',
    transport: U + '2026/07/asass-1024x683.png',
    cta: U + '2026/08/20260828173254_11-PHOTO-2026-08-27-21-57-45.jpg'
  },
  nav: [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Services', href: '/services', children: [
      { label: 'Home Care', href: '/services/home-care' },
      { label: 'Staffing Solutions', href: '/services/staffing-solutions' },
      { label: 'Transportation', href: '/services/transportation' }
    ]},
    { label: 'Blog', href: '/blogs' },
    { label: 'Careers', href: '/employment' },
    { label: 'Contact', href: '/contact' }
  ],
  services: {
    'home-care': {
      slug: 'home-care', title: 'Home Care & Personal Support', short: 'Home Care', icon: 'bi-house-heart-fill',
      lead: 'Personalized, non-medical care that helps your loved one stay safe, comfortable and independent in the place they call home.',
      imgKey: 'homecare',
      items: [
        ['Personal care', 'Bathing, dressing and grooming with dignity and respect.'],
        ['24-hour & live-in care', 'Round-the-clock support, from a few hours a week to full live-in care.'],
        ['Meal preparation', 'Nutritious meals prepared to your loved one’s tastes and routines.'],
        ['Medication reminders', 'Timely reminders so routines stay on track.'],
        ['Companionship', 'Friendly conversation, activities and company every day.'],
        ['Light housekeeping & laundry', 'A tidy, comfortable home without the extra effort.']
      ],
      who: ['Seniors who want to remain independent at home', 'Families who need respite from caregiving', 'People recovering after a hospital stay or illness']
    },
    'staffing-solutions': {
      slug: 'staffing-solutions', title: 'Healthcare Staffing', short: 'Staffing Solutions', icon: 'bi-people-fill',
      lead: 'We connect healthcare facilities and families with qualified, dependable professionals so patient care never has a gap.',
      imgKey: 'staffing',
      items: [
        ['Facility staffing', 'CNAs and HHAs for facilities that need reliable coverage.'],
        ['Private duty caregivers', 'One-on-one caregivers matched to individual needs.'],
        ['Dementia & recovery care', 'Caregivers trained for memory care and post-recovery support.'],
        ['Family respite care', 'Short-term relief so family caregivers can rest.']
      ],
      who: ['Nursing and assisted-living facilities', 'Families arranging private duty care', 'Households needing short-term respite']
    },
    'transportation': {
      slug: 'transportation', title: 'Transportation', short: 'Transportation', icon: 'bi-truck-front-fill',
      lead: 'Safe, courteous rides to appointments, errands and the places that matter, with wheelchair-accessible vans and trained drivers.',
      imgKey: 'transport',
      items: [
        ['Doctor & dialysis rides', 'On-time rides to doctors, dialysis, therapy and hospitals.'],
        ['Wheelchair-accessible vans', 'Accessible vehicles and trained, courteous drivers.'],
        ['Prescription & grocery errands', 'Pharmacy, groceries and banking handled for you.'],
        ['Community outings', 'Church, family visits and senior centers.']
      ],
      who: ['Seniors who no longer drive', 'Patients who need regular medical rides', 'Anyone who needs an accessible vehicle']
    }
  },
  testimonials: [
    { quote: 'Isarene Home Care Services provided outstanding care for my father. Their caregivers were compassionate, dependable, and treated him like family. We always felt informed and supported throughout his care.', name: 'Linda K.', place: 'Lowell, MA' },
    { quote: 'Finding reliable home care was overwhelming until we found Isarene. Their team created a personalized care plan that met my mother’s needs perfectly. The caregivers are professional, friendly, and truly care about their clients.', name: 'Michael R.', place: 'Andover, MA' },
    { quote: 'Our family couldn’t be happier with the care we’ve received. The caregivers are always punctual, respectful, and attentive. Knowing my loved one is in safe hands gives us complete peace of mind.', name: 'Sarah M.', place: 'North Andover, MA' }
  ]
};

// LOCAL_IMAGES=true serves the files saved by `npm run fetch-images` instead of isarene.com
if (process.env.LOCAL_IMAGES === 'true') {
  const local = (u) => '/img/' + decodeURIComponent(u.split('/').pop());
  Object.keys(site.img).forEach((k) => { site.img[k] = local(site.img[k]); });
}
module.exports = site;
