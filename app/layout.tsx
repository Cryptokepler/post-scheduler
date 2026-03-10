import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PostScheduler - Programador de Instagram",
  description: "Programa y publica tus posts de Instagram automáticamente",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-gray-50 min-h-screen">{children}</body>
    </html>
  );
}
