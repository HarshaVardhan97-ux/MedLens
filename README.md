# MedLens

MedLens is a clinical workspace prototype for reviewing patient encounters in one place. It provides a focused interface for patient details, diagnostic labs, imaging and radiology, AI-assisted insights, and clinical notes.

> **Important:** MedLens currently uses mock patient data and is intended for development and demonstration. It is not a medical device and must not be used to make real clinical decisions.

## What You Can Do

- Open the clinical dashboard and review the current encounter.
- Switch between patients with the patient selector.
- Review patient demographics, vitals, conditions, allergies, and medications.
- Explore diagnostic laboratory results and imaging or radiology information.
- Review AI insights and differential suggestions.
- Read and work with clinical notes.
- Sign in with the built-in demo account or connect Supabase for real authentication.

## Getting Started

### Prerequisites

- Node.js 18 or newer
- npm

### Install and run

```bash
npm install
npm run dev
```

Vite will print the local development URL, normally `http://localhost:5173`.

To create a production build:

```bash
npm run build
npm run preview
```

## Sign In

The app automatically loads demo mode when no user is stored in the browser. You can also use the demo credentials on the sign-in screen:

```text
Email: demo@medlens.app
Password: Demo@123
```

Without Supabase configuration, other email addresses use a local development authentication fallback. This fallback does not provide real identity or account security.

## Supabase Configuration

To enable Supabase authentication, create a `.env.local` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Restart the development server after changing environment variables. Only the public Supabase URL and anonymous key belong in this frontend configuration. Never add a Supabase service-role key or other private secret to `.env.local`.

## Application Routes

| Route | Purpose |
| --- | --- |
| `/login` | Sign in |
| `/signup` | Create an account |
| `/dashboard` | Encounter overview |
| `/patient` | Patient details |
| `/diagnostic-labs` | Laboratory results |
| `/imaging-radiology` | Imaging and radiology |
| `/ai-insights` | AI insights and differential |
| `/clinical-notes` | Clinical notes |

All clinical workspace routes are protected and redirect to `/login` when no user is available.

## Project Structure

```text
src/
	components/    Shared layout, navigation, and modal components
	context/       Authentication and patient state
	data/          Mock patient records
	lib/           Supabase client setup
	pages/         Route-level screens
	router/        React Router configuration
	services/      Authentication, patient, and AI service logic
	types/         Shared TypeScript types
```

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Type-check and build the production bundle |
| `npm run preview` | Preview the production build locally |

## Technology

- React 18 and TypeScript
- Vite
- React Router
- Tailwind CSS
- Supabase Auth
- Lucide React icons