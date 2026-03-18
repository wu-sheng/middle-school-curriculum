import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { loadCurriculum } from "@/lib/loadYaml";
import { I18nProvider } from "@/lib/i18n";
import { ProgressProvider } from "@/lib/progressContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Xinbloom - 欣欣绽放的学习花园",
  description: "为初中生打造的理科自学平台",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Xinbloom",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const curriculum = loadCurriculum();
  const sidebarData = curriculum.subjects.map((s) => ({
    id: s.id,
    name: s.name,
    nameEn: s.nameEn,
    icon: s.icon,
    grades: s.grades.map((g) => ({
      id: g.id,
      name: g.name,
      nameEn: g.nameEn,
      semesters: g.semesters.map((sem) => ({
        id: sem.id,
        name: sem.name,
        nameEn: sem.nameEn,
        chapters: sem.chapters.map((ch) => ({
          id: ch.id,
          number: ch.number,
          name: ch.name,
          nameEn: ch.nameEn,
          hasContent: ch.hasContent,
        })),
      })),
    })),
  }));

  return (
    <html lang="zh-CN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <I18nProvider>
          <ProgressProvider>
            <Sidebar subjects={sidebarData} />
            <main className="lg:ml-64 min-h-screen">
              {children}
            </main>
          </ProgressProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
