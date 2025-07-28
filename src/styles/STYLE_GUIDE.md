# Sober Living App Style Guide

## Visual Design System

### Color Palette

#### Primary Colors
- **Blue-600 to Indigo-600**: Primary gradient for CTAs and key elements
- **Blue-700 to Indigo-700**: Hover state for primary gradient
- **Blue-100 to Indigo-100**: Light gradient for icon backgrounds
- **Blue-200/50**: Shadow color for primary elements

#### Background Colors
- **Gray-50**: Light background sections
- **White**: Primary background
- **Gradient backgrounds**: `from-blue-50 via-indigo-50 to-purple-50` for hero sections

#### Animated Background Blobs
- Purple-400: `w-96 h-96` with `animate-blob`
- Yellow-400: `w-96 h-96` with `animate-blob animation-delay-2000`
- Pink-400: `w-96 h-96` with `animate-blob animation-delay-4000`
- Blue-300: `w-80 h-80` with `animate-blob animation-delay-1000`

### Component Patterns

#### Hero Sections
```css
/* Container */
.hero-section {
  @apply relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-20 lg:py-28 overflow-hidden;
}

/* Animated background blobs */
.hero-blobs {
  @apply absolute inset-0 opacity-15;
}

/* Hero icon with glow */
.hero-icon-wrapper {
  /* Primary glow */
  .glow-primary {
    @apply absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur-3xl opacity-40 animate-pulse;
  }
  /* Secondary glow */
  .glow-secondary {
    @apply absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl blur-2xl opacity-30 animate-pulse animation-delay-1000;
  }
  /* Icon container */
  .icon-container {
    @apply relative w-28 h-28 bg-white rounded-3xl shadow-xl flex items-center justify-center border border-gray-100;
  }
}
```

#### Feature Cards
```css
/* Feature card container */
.feature-card {
  @apply group bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg shadow-blue-100/30 hover:shadow-2xl hover:shadow-blue-200/40 transition-all duration-300 p-8 border border-gray-100 hover:border-blue-200 relative overflow-hidden;
}

/* Feature icon box */
.feature-icon-box {
  @apply w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-125 transition-transform duration-300 p-3 shadow-lg shadow-blue-200/50;
}

/* Feature icon image */
.feature-icon {
  @apply w-full h-full object-contain;
}
```

#### Buttons
```css
/* Primary button */
.btn-primary {
  @apply group inline-flex items-center px-8 py-4 text-lg font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5;
}

/* Secondary button */
.btn-secondary {
  @apply group inline-flex items-center px-8 py-4 text-lg font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200 shadow-md hover:shadow-lg border border-gray-200;
}

/* Button arrows */
.btn-arrow-white {
  @apply ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform filter brightness-0 invert;
}

.btn-arrow-dark {
  @apply ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform;
}
```

### Animation Patterns

#### Blob Animation
```css
@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  25% { transform: translate(60px, -80px) scale(1.2); }
  50% { transform: translate(-40px, -30px) scale(0.8); }
  75% { transform: translate(-60px, 60px) scale(1.1); }
  100% { transform: translate(0px, 0px) scale(1); }
}

.animate-blob {
  animation: blob 5s infinite;
}
```

#### Hover Effects
- **Scale transformations**: `group-hover:scale-125` for icons
- **Translation**: `hover:-translate-y-0.5` for buttons, `hover:-translate-y-1` for cards
- **Shadow transitions**: Regular → Enhanced on hover with color tinting

### Layout Patterns

#### Section Spacing
- Hero sections: `py-20 lg:py-28`
- Content sections: `py-20`
- Container: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`

#### Grid Systems
- Feature grids: `grid grid-cols-1 lg:grid-cols-2 gap-8`
- Benefit grids: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`

### Typography
- Hero titles: `text-4xl lg:text-6xl font-bold`
- Section titles: `text-4xl lg:text-5xl font-bold`
- Feature titles: `text-2xl font-semibold`
- Body text: `text-lg text-gray-600 leading-relaxed`

### Global Utilities

#### Gradient Text
```css
.gradient-text {
  @apply bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent;
}
```

#### Animation Delays
```css
.animation-delay-1000 { animation-delay: 1s; }
.animation-delay-2000 { animation-delay: 2s; }
.animation-delay-4000 { animation-delay: 4s; }
```