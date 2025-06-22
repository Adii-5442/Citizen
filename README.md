<div align="center">
  <img src="https://raw.githubusercontent.com/adityasingh-AS/citizen/main/src/assets/logo-ss.png" alt="Citizen App Logo" width="150"/>
  <h1>Citizen</h1>
  <p><b>Voice Your Local Concerns. Drive Real Change.</b></p>
  <p>
    <a href="#-key-features">Features</a> •
    <a href="#-tech-stack">Tech Stack</a> •
    <a href="#-getting-started">Getting Started</a> •
    <a href="#-project-structure">Structure</a> •
    <a href="#-contributing">Contributing</a>
  </p>
</div>

---

**Citizen** is a mobile platform that empowers individuals to report, discuss, and resolve local issues. From potholes to public safety, Citizen provides a space for community members to voice their concerns, rally support, and automatically escalate important issues to local authorities.

## ✨ Key Features

- **🗣️ Voice Concerns Anonymously**: Post "rants" about local issues without revealing your identity.
- **👍 Upvote & Amplify**: Support the issues you care about. The more upvotes a rant gets, the more visibility it receives.
- **💬 Community Discussion**: Comment on rants to share insights, provide updates, or collaborate on solutions.
- **📈 Reputation System**: Earn points and build your influence by posting, commenting, and contributing positively to the community.
- **🤖 Automated Escalation**: When a rant reaches a critical threshold of upvotes, a formal complaint is automatically generated and sent to the relevant local authorities.
- **👤 User Profiles**: Follow other users, track their contributions, and see the impact they're making.
- **🏆 Achievements**: Unlock badges and achievements for being an active and responsible citizen.
- **🔔 Activity Feed & Notifications**: Stay updated on the issues and users you follow.

## 📱 Screenshots

| Onboarding | Login | Home Feed |
| :---: | :---: | :---: |
| <img src="httpsprevioustoolcall" alt="Onboarding Screen" width="250"/> | <img src="httpsprevioustoolcall" alt="Login Screen" width="250"/> | <img src="httpsprevioustoolcall" alt="Home Feed" width="250"/> |

| Post a Rant | Profile | Activity |
| :---: | :---: | :---: |
| <img src="httpsprevioustoolcall" alt="Post Rant Screen" width="250"/> | <img src="httpsprevioustoolcall" alt="Profile Screen" width="250"/> | <img src="httpsprevioustoolcall" alt="Activity Screen" width="250"/> |


## 🛠️ Tech Stack

| Category | Technology |
| --- | --- |
| **Frontend** | React Native, TypeScript, React Navigation, Axios, React Native Dotenv |
| **Backend** | Node.js, Express, MongoDB, Mongoose, TypeScript, JWT |
| **Styling** | Custom Stylesheets with a simple Theme System |
| **Linting** | ESLint, Prettier |


## 🚀 Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [MongoDB](https://www.mongodb.com/try/download/community)
- [Watchman](https://facebook.github.io/watchman/docs/install/) (for macOS)
- [Xcode](https://developer.apple.com/xcode/) (for iOS) or [Android Studio](https://developer.android.com/studio) (for Android)

### 1. Backend Setup (`citizen-be`)

```bash
# 1. Navigate to the backend directory
cd citizen-be

# 2. Install dependencies
npm install

# 3. Create a .env file in the root of the /citizen-be directory
#    and add the following environment variables:
#    MONGO_URI=your_mongodb_connection_string
#    JWT_SECRET=your_jwt_secret
#    PORT=5050

# 4. Start the backend server
npm start
```

### 2. Frontend Setup (`Citizen`)

```bash
# 1. Navigate to the frontend directory
cd Citizen

# 2. Install dependencies
npm install

# 3. Create a .env file in the root of the /Citizen directory
#    and add the backend API URL:
#
#    For Android Emulator:
#    API_URL=http://10.0.2.2:5050
#
#    For iOS Simulator:
#    API_URL=http://localhost:5050

# 4. For iOS, install CocoaPods dependencies
cd ios && pod install && cd ..

# 5. Start the Metro bundler (with cache reset)
npm start -- --reset-cache

# 6. In a new terminal, build and run the app
# For Android:
npm run android

# For iOS:
npm run ios
```

## 📂 Project Structure

The project is organized into two main parts: `Citizen` (the React Native frontend) and `citizen-be` (the backend).

<details>
<summary><b>Frontend (`Citizen/src`)</b></summary>

```
/src
├── assets/          # Images and static files
├── components/      # Reusable UI components
├── navigators/      # Navigation logic and stack setup
├── screens/         # All app screens
├── services/        # API service layer (Axios)
├── types/           # TypeScript type definitions
└── utils/           # Utility functions and theme config
```
</details>

<details>
<summary><b>Backend (`citizen-be/src`)</b></summary>

```
/src
├── config/          # Database configuration
├── controllers/     # Route handlers and business logic
├── middleware/      # Custom middleware (e.g., auth)
├── models/          # Mongoose schemas and models
├── routes/          # API route definitions
└── types/           # TypeScript type definitions
```
</details>

## 🤝 Contributing

Contributions are welcome! If you'd like to contribute, please fork the repository and use a feature branch. Pull requests are warmly welcome.

1.  **Fork** the repository.
2.  Create your feature branch (`git checkout -b feature/your-feature`).
3.  **Commit** your changes (`git commit -m 'Add some feature'`).
4.  **Push** to the branch (`git push origin feature/your-feature`).
5.  Open a **Pull Request**.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
