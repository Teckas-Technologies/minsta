"use client";
import Header from "@/components/header";
import "./globals.css";
import "@near-wallet-selector/modal-ui/styles.css";
import { Inter } from "next/font/google";
import Footer from "@/components/footer";
import Providers from "@/providers/providers";
import Navigation from "@/components/navigation";
import Modal from "@/components/modal";
import MintingClosed from "@/components/MintingClosed";
import { DarkModeProvider } from "@/context/DarkModeContext";
import { GridProvider } from "@/context/GridContext";
import { BackProvider } from "@/context/BackContext";
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"/>
      </head>
      <body
        className={`${inter.className} flex min-h-screen flex-col items-center justify-between overflow-x-hidden`}
      >
        <div className="flex flex-col min-h-screen relative bg-mainBg w-screen">
          <BackProvider>
            <GridProvider>
              <DarkModeProvider>
                <Providers>
                  <Navigation>
                    <Header />
                    <Footer />
                  </Navigation>
                  <MintingClosed />
                  {children}
                  <Modal></Modal>
                </Providers>
              </DarkModeProvider>
            </GridProvider>
          </BackProvider>
        </div>
      </body>
    </html>
  );
}
