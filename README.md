# **The Noor Jar**

The Noor Jar is a personalized Quranic verse app designed to provide spiritual guidance and inspiration tailored to your mood. Whether you're feeling happy, sad, or seeking protection, the app offers a Quranic verse that aligns with your emotions.

## **Features**

- **Mood-Based Verse Selection**: Choose from moods like Happy, Sad, Thankful, and more to get a Quranic verse tailored to your feelings.
- **Beautiful Verse Display**: Verses are displayed on elegant cards with mood-specific colors.
- **Random Verse Refresh**: Click the refresh button to view a new random verse within the same mood.
- **Share as Image**: Convert verse cards into shareable images for platforms like Instagram and Facebook.
- **Offline Support**: Access stored verses locally via IndexedDB for seamless offline usage.

---

## **Getting Started**

### Prerequisites

- **Node.js** (v16+ recommended)
- **npm** or **yarn**

---

### Installation

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/your-username/the-noor-jar.git
   cd the-noor-jar
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the Development Server**:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:3000`.

---

## **Project Structure**

```
src/
├── assets/               # Images and icons
│   ├── icons/            # Favicon, logo, and other icons
│   ├── images/           # Backgrounds, preview images
├── components/           # Reusable React components
│   ├── VerseCard.tsx     # Card for displaying Quranic verses
├── pages/                # Application pages
│   ├── VersesPage.tsx    # Page for displaying verses by mood
├── data/                 # Static data
│   ├── moods.ts          # Moods and their associated properties
├── db/                   # Dexie.js configuration
├── App.tsx               # Main application component
├── main.tsx              # Application entry point
```

---

## **Usage**

### Adding New Verses

- Verses are stored in `Dexie.js` (IndexedDB). You can populate the database with new verses by modifying the initial dataset or through app functionality.

### Sharing Verse as Image

- When you click the **Share as Image** button, the app converts the current verse into a PNG image using the `html-to-image` library and allows you to share it using the Web Share API.

---

## **Tech Stack**

- **Frontend**: React + TypeScript
- **Styling**: Tailwind CSS
- **Local Storage**: Dexie.js (IndexedDB wrapper)
- **Image Generation**: `html-to-image`
- **Sharing**: Web Share API
- **Icons**: `lucide-react`

---

## **Contributing**

This is a solo project, but feedback and suggestions are always welcome. Feel free to reach out or fork the repository to make your own improvements!

---

## **License**

This project is licensed under the [MIT License](LICENSE).

---

## **About Me**

Hi, I’m **Himu Nazmul**, a full-stack developer passionate about creating meaningful applications like **The Noor Jar**. To learn more about me and my work:

- **Portfolio**: [https://himunazmul.vercel.app/](https://himunazmul.vercel.app/)
