import "~/styles/globals.css";
import { Inter } from "next/font/google";
import { TRPCReactProvider } from "~/trpc/react";
import { Providers } from "./components/providers";
import NavbarWrapper from "./components/NavbarWrapper";
import { PrefetchQueriesWrapper } from "./hooks/usePrefetchQueries";
import Footer from "./components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Song Of The Day",
  description: "Guess today's song",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable}`}>
        <Providers>
          <TRPCReactProvider>
            {/* <PrefetchQueriesWrapper> */}
              {/* <NavbarWrapper /> */}
            {/* </PrefetchQueriesWrapper> */}
            <main className="">{children}</main>
            <Footer />
          </TRPCReactProvider>
        </Providers>
      </body>
    </html>
  );
}
