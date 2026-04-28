import type { Metadata } from "next";
import "./globals.css";
import AuthShell from "./_components/auth-shell";

export const metadata: Metadata = {
  title: "LexAnchor — Legal Intelligence",
  description:
    "Senior-attorney-grade contract review in 60 seconds. Every clause analyzed, every risk flagged, every term in plain English. Information only — not legal advice."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-bg text-text">
        <AuthShell />
        <div className="flex-1 md:pl-[var(--sidebar-w,52px)] transition-[padding] duration-150">
          {children}
        </div>
      </body>
    </html>
  );
}
