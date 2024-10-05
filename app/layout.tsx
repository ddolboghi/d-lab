import localFont from "next/font/local";
import "./globals.css";

const pretendard = localFont({
  src: "../public/assets/fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard",
});

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "라이언킹",
  description: "This is lion king.",
};

export default function RootLayout({
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
