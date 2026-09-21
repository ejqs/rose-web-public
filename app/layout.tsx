import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rose",
  description: "Recursive Opinionated Search Engine — news globe by country sentiment.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>
        <header>
          <p>
            <Link href="/">Rose</Link>
          </p>
        </header>
        {children}
      </body>
    </html>
  );
}
