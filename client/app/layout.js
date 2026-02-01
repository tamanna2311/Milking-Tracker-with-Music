import "./globals.css";

export const metadata = {
  title: "Milking Tracker",
  description: "Track milking sessions with calming music."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
