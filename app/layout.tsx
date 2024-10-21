import localFont from "next/font/local";
import "./globals.css";

const pretendard = localFont({
  src: "../public/assets/fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard",
});

const defaultUrl = process.env.NEXT_PUBLIC_SITE_URL
  ? `https://${process.env.NEXT_PUBLIC_SITE_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "d-lab",
  description: "Digital Labs",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={pretendard.variable}>
      <body className={pretendard.className}>{children}</body>
    </html>
  );
}
