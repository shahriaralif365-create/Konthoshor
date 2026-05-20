# Bangla Voice Typing - Premium Voice-to-Text Web Application

A high-end, modern one-page web application that enables Bengali language voice-to-text conversion with a minimalist, SaaS-like aesthetic inspired by Linear and Vercel.

## ✨ Features

- **🎤 Bengali Voice Recognition**: Real-time speech-to-text conversion optimized for bn-BD (Bengali-Bangladesh)
- **🎨 Glassmorphism Design**: Modern, premium UI with glassmorphism effects and mesh gradients
- **⚡ Real-time Ripple Animation**: Visual feedback with sonar/ripple animations when listening
- **💾 Persistent Storage**: localStorage integration to preserve text across browser sessions
- **📱 Fully Responsive**: Native mobile app-like experience on all devices
- **🎬 Framer Motion Animations**: Smooth, professional transitions and interactions
- **📊 Character & Word Count**: Real-time statistics for your transcribed text
- **📋 Copy to Clipboard**: One-click copy functionality
- **⬇️ Download Support**: Export transcribed text as .txt file
- **🧹 Clear Text**: Quick text clearing with one click
- **♿ Accessibility**: Full keyboard navigation and semantic HTML
- **🌙 Dark Mode with Mesh Gradients**: Eye-friendly, modern dark theme

## 🛠️ Tech Stack

- **Next.js 14**: React framework with App Router and Server Components
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Production-ready animation library
- **Lucide React**: Beautiful, customizable SVG icons
- **Web Speech API**: Browser-native speech recognition
- **Hind Siliguri Font**: Premium Bengali typography

## 📚 Project Structure

```
.
├── app/
│   ├── layout.tsx          # Root layout with theme setup
│   ├── globals.css         # Global styles and CSS utilities
│   ├── page.tsx            # Home page
├── components/
│   ├── VoiceTyper.tsx      # Main component orchestrator
│   ├── Header.tsx          # Header with logo
│   ├── StatusIndicator.tsx # Status badge (Ready/Listening/Not-Supported)
│   ├── MicButton.tsx       # Microphone button with ripple animation
│   ├── TextDisplay.tsx     # Textarea with auto-scroll
│   └── ControlBar.tsx      # Control buttons and statistics
├── hooks/
│   ├── useSpeechRecognition.ts # Web Speech API hook
│   └── useTextStorage.ts       # localStorage persistence hook
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
├── next.config.js
└── README.md
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js 18+ and npm/yarn/pnpm
- Modern browser with Web Speech API support (Chrome, Edge, Safari)

### Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

2. **Run development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

3. **Build for production**:
   ```bash
   npm run build
   npm start
   ```

## 💡 Usage Guide

1. **Start Recording**: Click the large microphone button to begin voice recognition
2. **Stop Recording**: Click the stop button or wait for natural pause
3. **View Transcription**: Bengali text will appear in real-time in the textarea
4. **Copy Text**: Use the copy button to copy all text to clipboard
5. **Download**: Export your transcribed text as a .txt file
6. **Clear**: Remove all text with the clear button
7. **Check Stats**: Monitor character and word count in real-time

## 🎨 Design Features

### Glassmorphism Effect
- Transparent backgrounds with blur effects
- Subtle border colors for definition
- Shadow effects for depth

### Responsive Design
- Mobile-first approach
- Optimized layouts for all screen sizes
- Touch-friendly button sizes

### Animations
- Smooth fade-in transitions
- Ripple effect during listening
- Pulse animations for status indicators
- Hover and tap feedback

### Color Palette
- **Dark Mode**: slate-950 to slate-900 base
- **Accent Colors**: Blue (primary), Purple, Pink, Green, Red
- **Gradients**: Mesh gradients and radial color blends

## 🔧 Configuration

### Web Speech API Language
To change the language, modify the `bn-BD` parameter in [components/VoiceTyper.tsx](components/VoiceTyper.tsx):

```typescript
const { text: recognizedText, status, startListening, stopListening } = useSpeechRecognition('bn-BD');
```

Available language codes: `en-US`, `hi-IN`, `bn-BD`, etc.

### localStorage Key
Change the storage key in [components/VoiceTyper.tsx](components/VoiceTyper.tsx):

```typescript
const { text, setText, clearText } = useTextStorage('your-custom-key');
```

## 📱 Browser Support

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome | ✅ Full | Best experience |
| Edge | ✅ Full | Chromium-based |
| Safari | ✅ Full | iOS 14.5+ |
| Firefox | ⚠️ Limited | Requires flag |
| Opera | ✅ Full | Chromium-based |

## 🔐 Privacy

- All speech recognition and text processing happens **in-browser**
- No data is sent to external servers
- Text is stored only in browser's localStorage
- Users can clear all data anytime

## 🚀 Deployment

### Deploy on Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Deploy on Netlify

```bash
npm run build
# Upload the `.next` folder and public files
```

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 📦 Environment Variables

Create a `.env.local` file if needed (currently no required env vars):

```env
# Optional: Analytics or tracking
NEXT_PUBLIC_GA_ID=
```

## 🐛 Troubleshooting

### Microphone Permission Denied
- Check browser permissions for microphone access
- Click the lock icon in the address bar and allow microphone

### Text Not Being Recognized
- Ensure you're using a supported browser
- Check microphone is working properly
- Try speaking clearly and in Bengali

### localStorage Not Working
- Check if private/incognito mode is enabled
- Verify browser allows localStorage
- Check available disk space

## 🎯 Future Enhancements

- [ ] Multi-language support with UI switcher
- [ ] Real-time translation
- [ ] Text formatting options (bold, italic, etc.)
- [ ] Undo/Redo functionality
- [ ] Sharing transcriptions
- [ ] Dark/Light mode toggle
- [ ] Keyboard shortcuts
- [ ] Voice command support
- [ ] OCR capability
- [ ] Cloud sync (optional)

## 📄 License

MIT License - Feel free to use this project for personal and commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues and feature requests, please create an issue in the GitHub repository.

---

Built with ❤️ using Next.js, Tailwind CSS, and the Web Speech API.
