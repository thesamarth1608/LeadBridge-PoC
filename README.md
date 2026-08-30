# LeadBridge 🚀

Real-time **Meta Lead Ads → React Native** integration using Webhooks, Graph API, Node.js, and Socket.IO.


## 📱 Live Lead on Android Emulator

![Live Emulator](./Live%20Emulator.png)

## How It Works

```text
┌──────────────────┐
│  Meta Lead Form  │
│   User submits   │
│      a lead      │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│   Meta Webhook   │
│ Lead notification│
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Node.js / Express│
│     Backend      │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│   Meta Graph API │
│  Lead details    │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│     Socket.IO    │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  React Native    │
│       App        │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Android Emulator │
│   📱 Live Lead   │
└──────────────────┘
```

## Project Structure

```text
LeadBridge/
├── backend/
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── android/
│   ├── src/
│   ├── App.js
│   └── package.json
│
└── README.md
```

## Tech Stack

**Frontend:** React Native
**Backend:** Node.js, Express.js, Socket.IO
**Meta:** Lead Ads, Webhooks, Graph API
**Tools:** Android Studio, Android Emulator, Ngrok, Git & GitHub
