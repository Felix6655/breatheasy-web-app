import { Helmet } from 'react-helmet-async';

const BASE_URL = 'https://breatheasy-25.preview.emergentagent.com';

// Default SEO values
const defaultSEO = {
  title: 'BreatheEasy – Panic Attack Relief & Anxiety Calm Support',
  description: 'Instant breathing tools, panic attack grounding, and calm support anytime you need it.',
  image: `${BASE_URL}/og-image.png`,
  url: BASE_URL
};

// Page-specific SEO configurations
export const pageSEO = {
  home: {
    title: 'BreatheEasy – Panic Attack Relief & Anxiety Calm Support',
    description: 'Instant breathing tools, panic attack grounding, and calm support anytime you need it. Free guided breathing exercises and anxiety relief courses.',
    path: '/'
  },
  helpNow: {
    title: 'Get Calm Now – Instant Panic Attack Support | BreatheEasy',
    description: 'Feeling anxious or panicking? Start guided breathing and grounding exercises right now. Calm support in seconds.',
    path: '/help-now'
  },
  courses: {
    title: 'Anxiety & Panic Attack Courses – Learn to Manage Anxiety | BreatheEasy',
    description: 'Learn to manage panic attacks, anxiety, and worry with structured courses. Understand what happens during panic and build lasting confidence.',
    path: '/courses'
  },
  tools: {
    title: 'Calming Tools – Breathing Exercises & Grounding | BreatheEasy',
    description: 'Access breathing exercises, 5-4-3-2-1 grounding, night panic support, and calming sounds. Tools you can use anytime.',
    path: '/tools'
  },
  profile: {
    title: 'Your Profile & Settings | BreatheEasy',
    description: 'Manage your BreatheEasy settings, language preferences, and premium subscription.',
    path: '/profile'
  },
  subscription: {
    title: 'BreatheEasy Premium – Full Access to Anxiety Support | BreatheEasy',
    description: 'Unlock full courses, night panic support, offline access, and personalized insights. Support your mental health journey.',
    path: '/subscription'
  },
  panicAttackHelp: {
    title: 'Panic Attack Help – What to Do During a Panic Attack | BreatheEasy',
    description: 'Step-by-step guide for panic attacks. Learn breathing techniques, grounding exercises, and why panic is not dangerous. Calm support when you need it.',
    path: '/panic-attack-help'
  },
  breathingExercise: {
    title: 'Breathing Exercise for Anxiety – 4-7-8 & Box Breathing | BreatheEasy',
    description: 'Guided breathing exercises to calm anxiety and stop panic attacks. Learn the 4-second inhale, 6-second exhale technique that works.',
    path: '/breathing-exercise'
  },
  anxietyTools: {
    title: 'Anxiety Tools & Techniques – Grounding, Breathing, Calm | BreatheEasy',
    description: 'Free anxiety tools including 5-4-3-2-1 grounding, breathing exercises, thought defusion, and calming sounds. Instant relief techniques.',
    path: '/anxiety-tools'
  }
};

export function SEOHead({ page, customTitle, customDescription }) {
  const seo = pageSEO[page] || {};
  const title = customTitle || seo.title || defaultSEO.title;
  const description = customDescription || seo.description || defaultSEO.description;
  const url = seo.path ? `${BASE_URL}${seo.path}` : defaultSEO.url;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={defaultSEO.image} />
      
      {/* Twitter */}
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:url" content={url} />
    </Helmet>
  );
}

export default SEOHead;
