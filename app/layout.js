import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PlayerProvider } from "@/components/PlayerContext";
import Player from "@/components/Player";

export const metadata = {
  title: { default: "Islamic Center — Al-Qur'an, Doa & Wirid", template: "%s · Islamic Center" },
  description:
    "Islamic Center: bacaan Al-Qur'an lengkap dengan teks Arab bertajwid, terjemahan Indonesia, dan audio qari pilihan. Plus doa, wirid, dan maulid.",
  applicationName: "Islamic Center",
};

export const viewport = { width: "device-width", initialScale: 1, themeColor: "#04060a" };

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <PlayerProvider>
          <Header />
          <main style={{ minHeight: "100vh", paddingTop: 110, paddingBottom: 140 }}>{children}</main>
          <Footer />
          <Player />
        </PlayerProvider>
      </body>
    </html>
  );
}
