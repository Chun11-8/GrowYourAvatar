# GrowYourAvatar 🌟

**An AI-Powered Gamified Learning Platform for Children (3 to 8 years old)**

GrowYourAvatar combines education and play to make learning fun, consistent, and rewarding for children. Learners grow a personalized virtual avatar by completing quizzes and educational games tailored to their level, while parents and teachers can customize content to match learning goals.

To encourage daily engagement, the avatar is powered by a health system. Each day a child skips learning activities, the avatar’s health decreases by one point. By completing quizzes and playing games consecutively, children earn rewards and restore health. If the avatar’s health reaches zero, it “falls asleep” and can only be revived through learning activities—reinforcing responsibility without punishment.

This design creates a meaningful feedback loop where progress, consistency, and learning directly impact the avatar’s growth, motivating children to build positive daily learning habits in a playful and engaging way.

---

## 📖 About The Project

Traditional learning apps can often feel repetitive or disconnected from a child's interests. GrowYourAvatar bridges this gap by introducing a "digital companion" that evolves based on the child's academic achievements.

**Core Concept:**
1.  **Learn**: Children complete quizzes and educational mini-games.
2.  **Earn**: Success rewards them with "Food" (Apples) and "Health" points.
3.  **Grow**: Feeding and caring for the avatar causes it to grow from a baby to an adult, unlocking new visual styles and animations.

The platform uniquely integrates **Google's Gemini AI 3** to allow for infinite content generation. Parents can simply take a picture of a textbook page or paste a topic, and the system instantly generates a tailored quiz, ensuring the material is always relevant to what the child is currently studying in school.

---

## ✨ Key Features

### 1. 🦸‍♂️ Interactive Avatar System
-   **Customization**: Kids can upload their favorite photo and generate a voxel avatar using Gemini 3
-   **Evolution Mechanic**: The avatar has three growth stages (Baby -> Kid -> Adult). Growth is triggered by accumulated XP from learning activities.
-   **Status Management**: Players must manage their avatar's Hunger and Health, teaching responsibility alongside academics.

### 2. 🧠 AI-Powered Quiz Generation
Leveraging the power of Large Language Models (LLMs), our quiz engine is versatile and limitless:
-   **Text-to-Quiz**: Enter a topic (e.g., "Photosynthesis", "Basic Addition") and get a 5-question MCQ quiz instantly.
-   **Image-to-Quiz**: Upload a photo of a worksheet or textbook page. The AI analyzes the text and creates a quiz to test comprehension.
-   **Review Mode**: Parents can review and edit AI-generated questions before the child plays, ensuring safety and accuracy.

### 3. 🎮 Educational Game Hub
A collection of 15+ mini-games targeting specific cognitive developmental milestones:

| Category | Games | Skills Targeted |
| :--- | :--- | :--- |
| **Logic & Math** | Counting, Number Order, Sudoku, Connect 3 | Numeracy, logical reasoning, strategic thinking. |
| **Memory** | Memory Cards, Simon Says, Sound Matching | Short-term memory, auditory processing. |
| **Perception** | Shape Matching, Color Sorting, Size Comparison | Visual discrimination, categorization. |
| **Patterning** | Pattern Completion, Maze Runner | Problem-solving, spatial awareness. |
| **Reflexes** | Alphabet Tap, Tic-Tac-Toe | Reaction time, letter recognition. |

---

## 🚀 User Flow: How It Works

1.  **Create Avatar**: The user starts by creating a new avatar, selecting its initial look.
2.  **Dashboard (Avatar View)**: This is the home screen where the avatar lives. Here, users can see stats (Hunger, Health, XP) and access different modules.
3.  **Earn Resources**:
    -   Click **"Play** to enter the Quizzes and complete structured learning tasks entered by the parent/teacher.
    -   User can only proceed to the game hub if he/she get more than 70% score in the quiz.
    -   User then can choose any game from the game hub to play.
    -   After playing the game, the user will get rewards based on the completion.
    -   One cycle will give the user 2 apples to feed their avatar.
4.  **Care & Grow**:
    -   Use the "Feed" button to consume Apples and restore Hunger.
    -   Use the "Sleep/Rest" button to restore Health.
    -   As XP fills up, the avatar will level up and eventually evolve to the next growth stage!


---

## ❤️ Health & Survival System (Penalty)

To teach responsibility and consistency, the system includes a survival mechanic:

1.  **Health Points (HP)**: Every avatar starts with **5 Health Bars**.
2.  **Daily Decay**: At the start of every new day, the avatar automatically loses **1 HP**.
3.  **Daily Requirement**: Users must log in and complete at least one **Quiz & Game cycle** to earn back HP.
4.  **Permadeath**: If HP drops to **0**, the **avatar dies** permanently. The user will lose their progress and must create a new avatar from scratch.

> **Tip:** Check in daily to keep your avatar alive and growing!

---

## 🛠️ Technical Architecture

This project is built as a Progressive Web App (PWA) with native mobile capabilities via Capacitor.

### Tech Stack
-   **Framework**: [React 19](https://react.dev/) with TypeScript
-   **Build Tool**: [Vite](https://vitejs.dev/) for lightning-fast development
-   **State Management**: React Hooks (Context API for global state like Avatar data)
-   **AI Service**: [Google Generative AI SDK](https://www.npmjs.com/package/@google/generative-ai) (Gemini Pro & Vision models)
-   **Routing**: React Router v6
-   **Mobile Runtime**: [Capacitor](https://capacitorjs.com/) (iOS & Android support)
-   **Styling**: Pure CSS with CSS Variables for theming

### Project Structure
```
src/
├── assets/          # Static images and icons
├── components/      # Reusable UI components (Buttons, Cards, Modals)
├── data/            # Static data files and configuration
├── hooks/           # Custom React hooks (useGameSession, useAvatar)
├── pages/           # Main application views
│   ├── games/       # Source code for all mini-games
│   ├── CreateAvatar.tsx
│   ├── AvatarView.tsx
│   └── ...
├── services/        # External API integrations (gemini.ts)
├── utils/           # Helper functions (SoundManager, storage)
└── App.tsx          # Main routing logic
```

---

## 💻 Getting Started (Developer Guide)

### Prerequisites
-   Node.js (v18+ recommended)
-   npm or yarn
-   A Google Cloud Project with the **Gemini API** enabled

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-username/grow-your-avatar.git
    cd grow-your-avatar
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Setup Environment Variables**
    Create a `.env` file in the root directory:
    ```bash
    VITE_APP_GEMINI_API_KEY=your_actual_api_key_here
    ```

4.  **Run Locally**
    ```bash
    npm run dev
    ```
    The app will open at `http://localhost:5173`.

### Building for Mobile
To run the app on an Android device/emulator:
```bash
npm run build
npx cap sync
npx cap open android
```

---

## 🤝 Contributing

We love contributions! Here's how you can help expand the platform.

### Adding a New Game
1.  Create a new component in `src/pages/games/MyNewGame.tsx`.
2.  Use the `useGameSession` hook to handle scoring and game-over logic automatically to ensure it ties into the avatar's progression.
3.  Register the new route in `src/App.tsx`.
4.  Add a generic card for it in `src/pages/GameHub.tsx`.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
