# ORBIT Frontend

A production-level frontend for ORBIT - A real-time digital orbit where creators, communities, and conversations move around you.

## Features

- 🎨 **Modern Design System** - Custom space/orbit themed UI with purple, cyan, and pink gradients
- 🌌 **Animated Background** - Continuously moving orbit rings and particles
- ⚡ **Performance Optimized** - Built with Vite, React 19, and Framer Motion
- 📱 **Responsive** - Mobile-first design that works on all devices
- 🎭 **Smooth Animations** - Production-ready animations and transitions

## Tech Stack

- **React 19** - Latest React with modern features
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **Tailwind CSS v4** - Utility-first CSS framework
- **Framer Motion** - Production-ready motion library
- **Lucide React** - Beautiful icon library

## Getting Started

### Install Dependencies

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   └── landing/
│   │       ├── Header.tsx
│   │       ├── OrbitBackground.tsx
│   │       ├── HeroSection.tsx
│   │       ├── FeaturesSection.tsx
│   │       └── CTASection.tsx
│   ├── pages/
│   │   └── Landing.tsx
│   ├── styles/
│   ├── lib/
│   └── main.tsx
├── index.html
└── package.json
```

## Design System

### Colors

- **Primary Purple**: `#8b5cf6`
- **Cyan Accent**: `#06b6d4`
- **Pink Accent**: `#ec4899`
- **Dark Background**: `#0a0a0f`

### Typography

- **Heading Font**: Space Grotesk
- **Body Font**: Inter

## License

MIT

