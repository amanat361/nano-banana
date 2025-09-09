# 🍌 Nano Banana

A fun web app that uses Google's Gemini AI to add virtual companions to your photos! Upload an image, choose your preferences, and let AI generate a boyfriend or girlfriend alongside you.

## ✨ Features

- 📸 **Image Upload**: Simple drag-and-drop or click-to-upload interface
- 👫 **Companion Selection**: Add a boyfriend or girlfriend to your photos
- 🎛️ **Advanced Options**: Customize age, style, and setting with emoji-rich buttons
- 📝 **Prompt Editing**: Preview and manually edit the AI prompt
- 📱 **Mobile-Friendly**: Responsive design that works great on all devices
- ⏳ **Queue System**: Built-in rate limiting with real-time queue status
- 🚀 **Fast Performance**: Built with Bun for lightning-fast development and production

## 🎨 Customization Options

### Basic Options
- 👨 **Boyfriend** or 👩 **Girlfriend**

### Advanced Options (Toggle to Show)
- **Age**: 🧒 Young | 🧑 Adult | 👴 Old
- **Style**: 👕 Casual | 👔 Formal | 🏃 Athletic  
- **Setting**: 🏖️ Beach | ☕ Cafe | 🌳 Park

## 🚦 Queue System

The app includes a global queue system to manage API usage

## 🚀 Quick Start

### Prerequisites
- [Bun](https://bun.sh/) installed on your system
- Google Gemini API key

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/amanat361/nano-banana.git
   cd nano-banana
   ```

2. **Install dependencies**:
   ```bash
   bun install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
   
   Optionally, add a Discord webhook URL for logging (uploads and generations will be sent to Discord):
   ```
   DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/your_webhook_url_here
   ```

4. **Start the development server**:
   ```bash
   bun dev
   ```

5. **Open your browser** to `http://localhost:3000`

### Production Build

```bash
bun run build
bun start
```