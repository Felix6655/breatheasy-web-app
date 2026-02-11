# BreatheEasy - Panic Attack & Anxiety Support App

## Production Status: READY ✅

## Production URLs
- **Frontend**: https://breatheeasy-4.preview.emergentagent.com
- **Backend API**: https://breatheeasy-4.preview.emergentagent.com/api

## Original Problem Statement
Build a panic attack & anxiety support app with a light green, calming UI focused on immediate panic relief, guided grounding, and structured learning courses, with Stripe subscriptions enabled for monetization.

## Architecture
- **Frontend**: React 19 + Tailwind CSS + Framer Motion + Zustand
- **Backend**: FastAPI + MongoDB (Motor async driver)
- **Payments**: Stripe Checkout (test mode ready, live mode ready)
- **Auth**: JWT (Email/Password) + Emergent Google OAuth + Guest Mode
- **PWA**: Service worker + manifest.json for offline emergency support
- **i18n**: 8 languages with RTL support

## User Personas
1. **Panic Attack Sufferer**: Needs immediate help during a panic attack
2. **Anxiety Manager**: Wants to learn techniques to manage daily anxiety
3. **Prevention Seeker**: Looking to understand and prevent future attacks

## Core Requirements (All Implemented)
- [x] Emergency panic flow (5 screens: Safety, Breathing, Grounding, Reassurance, Recovery)
- [x] Animated breathing circle with 4s inhale / 6s exhale
- [x] Breathing presets (60s Quick, 2m Steady, 5m Deep)
- [x] 5-4-3-2-1 grounding exercise
- [x] Courses system (Panic Attacks, Anxiety, Worry)
- [x] Tools section with calming exercises
- [x] Settings toggles (vibration, sound, voice guidance)
- [x] Stripe subscription (Monthly $9.99, Yearly $79.99)
- [x] Guest mode for emergency flow
- [x] Offline support for emergency mode
- [x] 8 languages (en, es, pt, fr, de, zh-Hans, ar, hi)
- [x] Arabic RTL support
- [x] PWA installable with Add to Home Screen prompt
- [x] Gentle upsell modal after panic session completion
- [x] Audio player for calming sounds

## What's Been Implemented (2026-02-11)

### SEO Implementation (Latest)
- [x] `react-helmet-async` for dynamic page meta tags
- [x] Static `sitemap.xml` with 7 URLs (/, /help-now, /tools, /courses, /panic-attack-help, /breathing-exercise, /anxiety-tools)
- [x] Static `robots.txt` allowing all crawlers
- [x] SEO landing pages with proper H1/H2 structure:
  - `/panic-attack-help` - Panic Attack Help guide
  - `/breathing-exercise` - Breathing exercises guide  
  - `/anxiety-tools` - Anxiety tools overview
- [x] Footer links on Home, Tools, Courses pages to SEO landing pages
- [x] Canonical URLs and Open Graph tags on all pages
- [x] JSON-LD structured data in index.html (WebApplication, FAQ schemas)

### Backend
- User authentication (register, login, session management)
- Google OAuth integration via Emergent Auth
- Course/module/lesson endpoints with progress tracking
- Panic session recording with offline sync
- User settings CRUD
- Stripe checkout and webhook handling (test + live mode support)
- Subscription status management with webhook events
- Health check with Stripe mode indicator

### Frontend
- Home page with panic button, daily tip, quick actions
- Help Now entry screen with calming message
- Complete Emergency flow (5 steps) with audio
- Animated breathing circle with timer
- Grounding exercise with nature images
- Reassurance step with progress ring
- Recovery step with helpful items selection
- Courses listing with progress
- Course detail with modules/lessons
- Tools page with presets and tool cards
- Profile with settings toggles and language selector
- Login/Register with Google OAuth
- Subscription page with plans
- Bottom navigation (5 tabs)
- PWA manifest and service worker
- Offline banner and graceful offline handling
- Premium upsell modal after emergency completion

### i18n Languages
1. English (en) - Default
2. Spanish (es) - Español
3. Portuguese (pt) - Português
4. French (fr) - Français
5. German (de) - Deutsch
6. Chinese Simplified (zh-Hans) - 简体中文
7. Arabic (ar) - العربية (RTL)
8. Hindi (hi) - हिन्दी

## Stripe Live Mode Switch Instructions

To switch from test to live mode, update `/app/backend/.env`:

```env
# LIVE SWITCH - Replace these values with your live keys:
STRIPE_SECRET_KEY=sk_live_YOUR_LIVE_SECRET_KEY
STRIPE_WEBHOOK_SECRET=whsec_YOUR_LIVE_WEBHOOK_SECRET
STRIPE_PRICE_MONTHLY=price_YOUR_MONTHLY_PRICE_ID
STRIPE_PRICE_YEARLY=price_YOUR_YEARLY_PRICE_ID
APP_URL=https://your-production-domain.com
API_URL=https://your-production-domain.com/api
```

### Stripe Webhook URL
Configure this URL in Stripe Dashboard → Webhooks:
`https://your-domain.com/api/webhook/stripe`

### Events to Enable
- checkout.session.completed
- customer.subscription.created
- customer.subscription.updated
- customer.subscription.deleted

## Premium Gating
- **Free**: Emergency panic flow + basic breathing tools
- **Premium**: Full courses + Night panic support + Offline access + Premium tools

Gentle paywall copy:
> "You did something brave by calming yourself. Unlock full support to feel more confident next time."

## Launch Steps (5 bullets)
1. Configure Stripe live keys in backend/.env
2. Set up Stripe webhook with production URL
3. Verify SSL/HTTPS is enabled for PWA
4. Test full checkout flow with live Stripe
5. Deploy and monitor via Stripe Dashboard

## Technical Notes
- Emergency flow works offline via service worker caching
- All API routes prefixed with /api
- MongoDB _id excluded from all responses
- JWT tokens expire after 7 days
- Guest users can use emergency flow without auth
- Audio files are placeholders (replace with real audio)
- PWA install prompt shows after 2nd visit

## Prioritized Backlog

### P0 (Critical) - DONE
- [x] Emergency panic flow
- [x] Breathing exercises
- [x] Authentication
- [x] Course structure
- [x] Stripe integration
- [x] 8 languages
- [x] PWA support
- [x] SEO implementation (sitemap, robots.txt, landing pages, meta tags)

### P1 (High Priority)
- [ ] Real audio files (rain, ocean, white noise)
- [ ] Voice guidance recordings
- [ ] Complete lesson content for all modules
- [ ] Progress analytics dashboard

### P2 (Medium Priority)
- [ ] Night panic mode with dark-safe colors
- [ ] Thought defusion exercises
- [ ] Personalized insights dashboard
- [ ] Push notifications for reminders

### P3 (Low Priority)
- [ ] Social sharing of progress
- [ ] Community support features
- [ ] Additional languages
- [ ] Apple/Google Pay integration
