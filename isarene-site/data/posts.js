// Blog posts. Titles, dates, categories and intros come from the live site.
// The article bodies below are draft copy: replace with the published text from isarene.com before launch.
const U = 'https://isarene.com/wp-content/uploads/2026/07/';
const posts = [
  {
    slug: 'how-to-choose-the-right-home-care-services-in-massachusetts',
    title: 'How to Choose the Right Home Care Services in Massachusetts',
    category: 'Home Care Guides', date: '2026-07-21', read: 5,
    image: U + 'asian-nurse-or-doctor-who-work-as-homecare-support-staff-help-senior-woman-exercise.jpg',
    excerpt: 'As our loved ones age, many families face the difficult decision of finding the right care. While nursing homes are…',
    body: [
      ['p', 'As our loved ones age, many families face the difficult decision of finding the right care. While nursing homes are one option, many people prefer to stay in the home they know. Home care can make that possible.'],
      ['h3', 'Start with the daily needs'],
      ['p', 'List the tasks where help is needed: bathing and dressing, meals, medication reminders, housekeeping, getting to appointments. This tells you whether a few hours a week is enough or whether you need 24-hour or live-in care.'],
      ['h3', 'Check that the agency is registered'],
      ['p', 'Ask whether the agency is registered in Massachusetts, how it screens and trains caregivers, and how it handles a caregiver who is sick or unavailable.'],
      ['quote', 'Ask who you can call at 2 a.m. If the answer is a real person, that is a good sign.'],
      ['h3', 'Meet the care team'],
      ['p', 'A good agency will assess your loved one’s needs, build a care plan with you, and match a caregiver whose personality fits. Take time to meet the caregiver and ask how updates will be shared with the family.'],
      ['h3', 'Look for flexibility'],
      ['p', 'Needs change. Choose an agency that can add hours, adjust schedules and offer related services such as transportation without starting over.']
    ]
  },
  {
    slug: 'signs-your-loved-one-may-need-home-care-services',
    title: 'Signs Your Loved One May Need Home Care Services',
    category: 'Senior Care Tips', date: '2026-07-21', read: 4,
    image: U + 'assisting-senior-people-female-caregiver-holding-elderly-woman-s-hands-indoors-e1714026604203.jpg',
    excerpt: 'Many seniors wish to remain independent for as long as possible. However, there are times when a little extra help…',
    body: [
      ['p', 'Many seniors wish to remain independent for as long as possible. However, there are times when a little extra help makes daily life safer and more comfortable.'],
      ['h3', 'Changes in the home'],
      ['p', 'Piles of laundry, unopened mail, spoiled food in the fridge or a neglected house can signal that daily tasks have become hard to manage.'],
      ['h3', 'Changes in personal care'],
      ['p', 'Skipping baths, wearing the same clothes or noticeable weight loss are common signs that someone may need support with personal care and meals.'],
      ['h3', 'Safety concerns'],
      ['p', 'Falls, missed medications, getting lost or leaving the stove on are reasons to talk about additional support.'],
      ['quote', 'Asking for help is not giving up independence. It is often how independence is kept.'],
      ['h3', 'Loneliness'],
      ['p', 'Withdrawing from friends, losing interest in hobbies or seeming low can mean your loved one would benefit from regular companionship.']
    ]
  },
  {
    slug: 'why-more-massachusetts-families-are-choosing-in-home-senior-care',
    title: 'Why More Massachusetts Families Are Choosing In-Home Senior Care',
    category: 'In-Home Senior Care', date: '2026-07-17', read: 4,
    image: U + 'caregiver-nurse-take-care-a-senior-patient-nurse-helping-senior-man.jpg',
    excerpt: 'Home care has become one of the fastest-growing care options for seniors, allowing older adults to age comfortably in familiar…',
    body: [
      ['p', 'Home care has become one of the fastest-growing care options for seniors, allowing older adults to age comfortably in familiar surroundings.'],
      ['h3', 'Comfort and familiarity'],
      ['p', 'Staying at home means keeping routines, neighbors, pets and belongings close. For many people that is the biggest benefit.'],
      ['h3', 'One-on-one attention'],
      ['p', 'In-home caregivers focus on one person at a time, so care can follow your loved one’s schedule and preferences.'],
      ['h3', 'Support for the whole family'],
      ['p', 'Respite care and flexible schedules give family caregivers time to rest, work and be family again, rather than only caregivers.'],
      ['quote', 'Good care keeps a person at the centre of their own life.'],
      ['h3', 'Everything under one roof'],
      ['p', 'When home care, staffing and transportation come from one agency, families have a single team to call.']
    ]
  }
];
if (process.env.LOCAL_IMAGES === 'true') posts.forEach((p) => { p.image = '/img/' + p.image.split('/').pop(); });
module.exports = posts;
