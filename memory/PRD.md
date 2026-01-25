# BreatheEasy - Panic Attack & Anxiety Support App

## Original Problem Statement
Build a panic attack & anxiety support app with a light green, calming UI focused on immediate panic relief, guided grounding, and structured learning courses, with Stripe subscriptions enabled for monetization.

## Architecture
- **Frontend**: React 19 + Tailwind CSS + Framer Motion + Zustand
- **Backend**: FastAPI + MongoDB (Motor async driver)
- **Payments**: Stripe Checkout (test mode)
- **Auth**: JWT (Email/Password) + Emergent Google OAuth + Guest Mode
- **PWA**: Service worker + manifest.json for offline support

## User Personas
1. **Panic Attack Sufferer**: Needs immediate help during a panic attack
2. **Anxiety Manager**: Wants to learn techniques to manage daily anxiety
3. **Prevention Seeker**: Looking to understand and prevent future attacks

## Core Requirements
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

## What's Been Implemented (2026-01-25)

### Backend
- User authentication (register, login, session management)
- Google OAuth integration via Emergent Auth
- Course/module/lesson endpoints with progress tracking
- Panic session recording
- User settings CRUD
- Stripe checkout and webhook handling
- Subscription status management

### Frontend
- Home page with panic button, daily tip, quick actions
- Help Now entry screen with calming message
- Complete Emergency flow (5 steps)
- Animated breathing circle with timer
- Courses listing with progress
- Course detail with modules/lessons
- Tools page with presets and tool cards
- Profile with settings toggles
- Login/Register with Google OAuth
- Subscription page with plans
- Bottom navigation (5 tabs)
- PWA manifest and service worker

## Prioritized Backlog

### P0 (Critical) - DONE
- [x] Emergency panic flow
- [x] Breathing exercises
- [x] Authentication
- [x] Course structure

### P1 (High Priority)
- [ ] Real audio files for calming sounds
- [ ] Voice guidance recordings
- [ ] Lesson content for all modules
- [ ] Progress tracking analytics

### P2 (Medium Priority)
- [ ] Night panic mode with dark-safe colors
- [ ] Thought defusion exercises
- [ ] Personalized insights dashboard
- [ ] Push notifications for reminders

### P3 (Low Priority)
- [ ] Social sharing of progress
- [ ] Community support features
- [ ] Multiple language support
- [ ] Apple/Google Pay integration

## Next Tasks
1. Add real calming audio files (rain, ocean, white noise)
2. Complete lesson content for all courses
3. Add voice guidance audio recordings
4. Implement progress analytics dashboard
5. Test Stripe with live keys before production

## Technical Notes
- Emergency flow works offline via service worker caching
- All API routes prefixed with /api
- MongoDB _id excluded from all responses
- JWT tokens expire after 7 days
- Guest users can use emergency flow without auth
