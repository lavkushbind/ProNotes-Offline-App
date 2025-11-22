# ProNotes - Offline Secure Notes App

ProNotes is a secure, offline-first React Native application built with Expo. It features biometric authentication, multi-user support, rich media notes, and a modern Pinterest-style grid layout.

**📲 Download the APK:** [Click Here to Download ProNotes](https://github.com/lavkushbind/ProNotes-Offline-App/releases)

## 📱 Features

1.  **Authentication (Offline):**
    *   Sign Up & Login logic stored locally.
    *   **Biometric Support:** Login using Fingerprint/FaceID without entering a password.
    *   **Seamless Account Switching:** Switch users instantly without re-entering credentials.
    
2.  **Notes Management:**
    *   Create, Edit, and Delete notes.
    *   **Pinterest Grid Layout:** Notes displayed in a staggered 2-column masonry layout.
    *   **Search & Sort:** Real-time search by title or body text.
    *   **Date & Greeting:** Dynamic greetings (Good Morning/Evening) and date stamps on notes.

3.  **Rich Media & Customization:**
    *   **Image Support:** Add images from the gallery to notes.
    *   **Full-Screen Viewer:** Tap images to view them in full-screen mode with zoom capabilities.
    *   **Color Tags:** Color-code notes (Red, Blue, Dark, White, etc.) for better organization.

4.  **UI/UX:**
    *   Dark Mode first design.
    *   Smooth animations and intuitive navigation.

## 🛠 Setup Instructions

To run this project locally on your machine:

1.  **Prerequisites:**
    *   Node.js installed.
    *   Expo Go app installed on your Android device.

2.  **Clone the Repository:**
    ```bash
    git clone https://github.com/lavkushbind/ProNotes-Offline-App.git
    cd ProNotes-Offline-App
    ```

3.  **Install Dependencies:**
    ```bash
    npm install
    ```

4.  **Start the App:**
    ```bash
    npx expo start
    ```
    *   Scan the QR code appearing in the terminal using the Expo Go app.

## 📚 Libraries Used

*   **Core:** `react`, `react-native`, `expo`
*   **Navigation:** `@react-navigation/native`, `@react-navigation/native-stack`
*   **Storage:** `@react-native-async-storage/async-storage` (For offline data persistence)
*   **Media:** `expo-image-picker` (For selecting images)
*   **Security:** `expo-local-authentication` (For Biometric/Fingerprint login)
*   **Icons:** `@expo/vector-icons` (Ionicons)
*   **System:** `expo-constants`, `react-native-safe-area-context`

## ⚠️ Known Issues / Limitations

1.  **Offline Only:** Data is stored locally on the device. Uninstalling the app clears the data.
2.  **Biometrics:** Requires a device with fingerprint/face sensor functionality.
3.  **Image Caching:** Images are linked via URI; deleting the original photo from the gallery might break the image in the note.

---
Developed by Lavkush Bind
