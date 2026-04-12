# 🚀 Quick Start Guide

## For the Impatient

### 1. Install dependencies (2 minutes)
```bash
npm install
```

### 2. Start development server (30 seconds)
```bash
npm run dev
```

### 3. Open in browser
- Visit http://localhost:3000
- Click the microphone button and speak Bengali
- See your voice transcribed in real-time

## What You Get

✅ Real-time Bengali voice recognition
✅ Auto-saving to localStorage
✅ Copy, download, and clear functions
✅ Modern glassmorphism design
✅ Smooth animations
✅ Fully responsive (mobile & desktop)
✅ Production-ready code

## First Time Setup Issues?

### "npm command not found"
- Install Node.js from https://nodejs.org/
- Restart your terminal

### "Microphone permission denied"
- Click the 🔒 lock icon in your address bar
- Set microphone to "Allow"
- Refresh the page

### "Speech recognition not working"
- Make sure you're using Chrome, Edge, or Safari
- Firefox requires enabling a flag
- Check your microphone is connected

## Next Steps

1. **Customize the theme**: Edit colors in `tailwind.config.js`
2. **Change language**: Update `bn-BD` in `components/VoiceTyper.tsx`
3. **Deploy**: Run `npm run build` then deploy to Vercel/Netlify
4. **Read full docs**: Check [README.md](README.md) and [DEVELOPMENT.md](DEVELOPMENT.md)

## Common Commands

```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Format code (add prettier as dev dependency first)
npx prettier --write .
```

## File Structure at a Glance

```
components/          → React components
  ├── VoiceTyper.tsx → Main app component
  ├── Header.tsx     → Logo & branding
  ├── MicButton.tsx  → Microphone button
  ├── TextDisplay.tsx → Text input area
  ├── StatusIndicator.tsx → Status badge
  └── ControlBar.tsx → Copy, download, clear buttons

hooks/              → Custom React hooks
  ├── useSpeechRecognition.ts → Voice API
  └── useTextStorage.ts → LocalStorage helper

app/                → Next.js pages
  ├── page.tsx      → Home page
  ├── layout.tsx    → Root layout
  └── globals.css   → Global styles
```

## Key Features to Try

🎤 **Voice Input**
- Click the blue mic button
- Speak clearly in Bengali
- Your speech appears in real-time

📋 **Copy Text**
- Click the copy icon
- Text is copied to your clipboard
- Try pasting it anywhere!

⬇️ **Download**
- Click the download icon
- Your text saves as a .txt file
- Check your Downloads folder

💾 **Auto Save**
- Refresh the page
- Your text is still there!
- Data is stored locally on your device

## Troubleshooting Quick Links

- Microphone not working? → See "Microphone permission denied" above
- Text disappearing? → Check if you're in private mode (localStorage won't work)
- Animations janky? → Try a different browser
- Can't find the mic button? → Scroll down, it's below the text area

## Need Help?

1. Check [README.md](README.md) for full documentation
2. Read [DEVELOPMENT.md](DEVELOPMENT.md) for technical details
3. Check browser console (F12) for errors
4. Verify your microphone works elsewhere first

## Ready to Deploy?

```bash
# Build first
npm run build

# Option 1: Deploy on Vercel (Easiest)
npm install -g vercel
vercel

# Option 2: Dark on Netlify
npm run build
# Then drag the .next folder to Netlify

# Option 3: Deploy on your own server
npm run build
npm start
```

---

**Enjoy building! 🎉**

For questions or issues, check the documentation files or test your microphone permission first.
