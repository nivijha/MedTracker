// src/app/layout.jsx
import "./globals.css";

export const metadata = {
  title: "MedTracker",
  description: "Track and manage medical records easily",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
