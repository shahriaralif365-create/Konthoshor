# Development Guide - Bangla Voice Typing

## Quick Start for Developers

### Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open browser
# Navigate to http://localhost:3000
```

## Project Architecture

### Component Hierarchy

```
VoiceTyper (Main orchestrator)
├── Header (Logo and branding)
├── StatusIndicator (Status badge)
├── MicButton (With ripple animation)
├── TextDisplay (Textarea with auto-scroll)
└── ControlBar (Actions and stats)
```

### Custom Hooks

#### `useSpeechRecognition(language)`
Handles Web Speech API integration for voice-to-text conversion.

**Returns:**
```typescript
{
  text: string;              // Recognized text
  status: 'ready' | 'listening' | 'processing' | 'not-supported';
  error: string | null;      // Error message if any
  startListening: () => void; // Start recognition
  stopListening: () => void;  // Stop recognition
  resetText: () => void;      // Clear text
}
```

#### `useTextStorage(storageKey, initialValue)`
Manages localStorage persistence for text data.

**Returns:**
```typescript
{
  text: string;           // Current text
  setText: (text) => void; // Update text
  clearText: () => void;  // Clear and remove from storage
  isMounted: boolean;     // Hydration check
}
```

## Styling System

### Tailwind Configuration
- Custom spacing and colors defined in `tailwind.config.js`
- Global CSS utilities in `app/globals.css`
- Tailwind directives imported in `app/globals.css`

### Custom CSS Classes

#### `.glass` - Glassmorphism Effect
```css
background: rgba(15, 23, 42, 0.5);
backdrop-filter: blur(10px);
border: 1px solid rgba(148, 163, 184, 0.1);
box-shadow: 0 8px 32px rgba(31, 38, 135, 0.2);
```

#### `.glass-subtle` - Lighter Glassmorphism
```css
background: rgba(15, 23, 42, 0.3);
backdrop-filter: blur(8px);
border: 1px solid rgba(148, 163, 184, 0.08);
```

### Custom Scrollbar
Styled using `::-webkit-scrollbar` for a premium look.

## Animation Patterns

### Using Framer Motion

```typescript
// Fade in
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.6 }}
/>

// Scale animation
<motion.div
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
/>

// Staggered children
<motion.div>
  {items.map((item) => (
    <motion.div
      key={item}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    />
  ))}
</motion.div>
```

## Web Speech API Configuration

### Supported Languages
- `en-US` - English (United States)
- `bn-BD` - Bengali (Bangladesh)
- `hi-IN` - Hindi (India)
- `ur-PK` - Urdu (Pakistan)
- And many others...

### API Methods

```typescript
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

// Configuration
recognition.continuous = true;        // Continue listening
recognition.interimResults = true;    // Get partial results
recognition.lang = 'bn-BD';          // Set language

// Events
recognition.onstart = () => {};      // Started listening
recognition.onresult = (event) => {}; // Got results
recognition.onerror = (event) => {}; // Error occurred
recognition.onend = () => {};        // Stopped listening

// Methods
recognition.start();                 // Start recognition
recognition.stop();                  // Stop recognition
recognition.abort();                 // Abort immediately
```

## localStorage Patterns

### Storing Data
```typescript
localStorage.setItem('key', 'value');
```

### Retrieving Data
```typescript
const value = localStorage.getItem('key');
```

### Removing Data
```typescript
localStorage.removeItem('key');
```

### Best Practices
1. Always check if data exists before using
2. Handle quota exceeded errors
3. Use hydration check (`isMounted`) to prevent SSR issues
4. Serialize complex objects with JSON

## Performance Optimization

### Code Splitting
Next.js automatically code-splits at the route level. For component-level splitting:

```typescript
import dynamic from 'next/dynamic';

const VoiceTyper = dynamic(() => import('@/components/VoiceTyper'), {
  ssr: false,
});
```

### Image Optimization
```typescript
import Image from 'next/image';

<Image src="/logo.svg" alt="Logo" width={48} height={48} />
```

### Bundle Analysis
```bash
npm install --save-dev @next/bundle-analyzer
# Add to next.config.js and analyze
```

## Testing

### Unit Testing (Jest)
```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
```

### Example Test
```typescript
import { render, screen } from '@testing-library/react';
import { Header } from '@/components/Header';

describe('Header', () => {
  it('renders logo text', () => {
    render(<Header />);
    expect(screen.getByText(/Bangla Voice Typing/i)).toBeInTheDocument();
  });
});
```

## Debugging

### Browser DevTools
1. Open Chrome DevTools (F12)
2. Check Network tab for API calls
3. Use Console for logging
4. Use Lighthouse for performance

### Next.js Debug Mode
```bash
NODE_OPTIONS='--inspect' npm run dev
```

### React DevTools
Install the [React DevTools browser extension](https://chrome.google.com/webstore/detail/react-developer-tools/)

## Common Issues & Solutions

### Microphone Permission Issues
- Check browser console for permission errors
- Ensure HTTPS in production (except localhost)
- Guide users to browser permission settings

### Text Not Saving to localStorage
- Check browser's storage quota
- Verify private/incognito mode isn't enabled
- Console may have quota exceeded errors

### Animations Stuttering
- Reduce animation complexity
- Use GPU acceleration (transform, opacity)
- Profile with DevTools Performance tab

### Mobile Audio Issues
- Test on real devices
- Check audio permissions
- Ensure proper HTTPS setup
- Test in different browsers

## Code Style

### Naming Conventions
- Components: PascalCase (`VoiceTyper.tsx`)
- Hooks: camelCase with `use` prefix (`useSpeechRecognition.ts`)
- Files: kebab-case for utilities, PascalCase for components
- Variables: camelCase

### Typescript Tips
```typescript
// Use interfaces for component props
interface VoiceTyperProps {
  language?: string;
  onTranscript?: (text: string) => void;
}

// Use types for unions
type Status = 'ready' | 'listening' | 'error';

// Use const assertions for literals
const config = {
  colors: ['red', 'blue'],
} as const;
```

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/add-export

# Make changes and commit
git add .
git commit -m "feat: add export to PDF"

# Push and create PR
git push origin feature/add-export
```

## Deployment Checklist

- [ ] Run `npm run build` locally and verify
- [ ] Test in production mode: `npm start`
- [ ] Check browser compatibility
- [ ] Test mobile responsiveness
- [ ] Verify microphone permissions
- [ ] Check localStorage persistence
- [ ] Run performance audit
- [ ] Set up analytics if needed
- [ ] Configure error logging
- [ ] Update privacy policy

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [Web Speech API MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [React Documentation](https://react.dev)

## Performance Metrics

### Target Metrics
- **FCP** (First Contentful Paint): < 1.5s
- **LCP** (Largest Contentful Paint): < 2.5s
- **CLS** (Cumulative Layout Shift): < 0.1
- **TTI** (Time to Interactive): < 3.8s

Monitor these with [Web Vitals](https://web.dev/vitals/).
