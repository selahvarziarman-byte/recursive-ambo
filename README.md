# Platonic Engine

A browser-based 3D app scaffold for recursive ambo-dissection.

## Stack

- Vite
- React
- TypeScript
- Three.js
- React Three Fiber
- Zustand
- Tailwind CSS

## Current Milestone

This repository contains a working minimal prototype scaffold:

- Tetrahedron seed registry entry
- 3D workspace with orbit controls
- One `Apply Ambo` button
- Rectified/ambo shape generation from the current shape
- Stable generated midpoint vertex IDs
- Clickable vertices in the 3D workspace
- User-editable vertex data packets
- Shape genealogy and history stored in local app state
- Clear geometry/domain interfaces for future recursive operations

## Setup

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Exact Local Commands

Run these from the repository root:

```bash
cd "C:\Users\arman\OneDrive\Documents\Platonic Engine"
npm install
npm run dev
```

In a second terminal, run the production build check:

```bash
cd "C:\Users\arman\OneDrive\Documents\Platonic Engine"
npm run build
```

## Notes

Dependency installation and runtime execution were not attempted in the handoff environment because no package manager was available there and the handoff request explicitly asked not to continue install/execution attempts.
