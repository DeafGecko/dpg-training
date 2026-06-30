# DPG Training App

DPG Training is an educational training app built with Expo and React Native. It is designed for story-based learning where users choose a topic, select a story, and learn through visual media (slides and videos) in a guided interface.

This project is optimized for content-driven updates: most lesson changes can be made by updating JSON data and media files, without changing core UI code.

## What This Project Is Used For

- Deliver structured training lessons in a consistent flow.
- Support trainers, facilitators, and learners with visual lesson content.
- Keep lesson content easy to maintain through local assets and JSON records.
- Run across platforms (web, iOS, Android) from one codebase.

## Tech Stack

- Framework: Expo SDK 56 + React Native + Expo Router
- Language: TypeScript
- UI Styling: React Native StyleSheet
- Media Playback: expo-video
- Video Thumbnails: expo-video-thumbnails
- Data Source: local JSON file in data/Translation_camp.json
- Assets: local images and videos under assets/

## Core App Flow

1. Sidebar shows available training topics.
2. Top bar shows story icons for the selected topic.
3. Content panel displays media for the selected story.
4. User can switch between Exegesis and Video modes.
5. Right-side strip allows direct jump to any media item.

## Project Structure

- src/app/index.tsx
  Main page composition and state wiring (Sidebar + TopBar + ContentPanel).
- src/components/Sidebar.tsx
  Topic selection UI with theme switching (light, dark, high contrast).
- src/components/TopBar.tsx
  Horizontal story icon selector.
- src/components/ContentPanel.tsx
  Media rendering area (image/video), mode buttons, media strip navigation.
- data/Translation_camp.json
  Story metadata and media filename references.
- assets/media/slides, assets/media/videos
  Lesson media resources.
- assets/icons
  App logos and topic icons (light, dark, and high contrast variants).

## Prerequisites

- Node.js 18+
- npm
- Expo CLI via npx (no global install required)

## Getting Started

Install dependencies:

```bash
npm install
```

Start the app:

```bash
npm run start
```

Run on specific targets:

```bash
npm run web
npm run ios
npm run android
```

## Scripts

- npm run start
  Start Expo development server.
- npm run web
  Start app in web mode.
- npm run ios
  Start app for iOS.
- npm run android
  Start app for Android.
- npm run lint
  Run Expo lint.
- npm run reset-project
  Reset helper script for project scaffolding.

## Content Model Notes

Each story record in data/Translation_camp.json can include:

- topical_name, theme_id
- story_title, book-bible, ref
- exegesis_slides (comma-separated media filenames)
- sign_roots_videos (comma-separated video filenames)
- lexicon-color (optional lexicon resource reference)

Filenames in JSON must match keys mapped in ContentPanel media maps.

## Current Product Classification

This project is best described as:

- Educational Training Software
- EdTech Learning Application


## Contribution Tips

- Keep media filenames consistent between JSON and asset maps.
- Prefer content/data updates first before changing UI logic.
- Validate changes on web and at least one native target after media updates.
