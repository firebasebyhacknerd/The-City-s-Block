// Firebase config — reads from NEXT_PUBLIC_FIREBASE_* env vars.
// Fallback values are used for local development only.
export const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY            ?? "AIzaSyAllGK5uOvp5bYlPTdWNDTICoRp1hsHMo4",
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN        ?? "studio-7725075373-2b27f.firebaseapp.com",
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID         ?? "studio-7725075373-2b27f",
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET     ?? "studio-7725075373-2b27f.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "14124896913",
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID             ?? "1:14124896913:web:a7bbff3c2a79d8312a2530",
  measurementId:     process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID     ?? "",
};
