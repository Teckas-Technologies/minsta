import { constants } from "@/constants";
import DataProvider from "./data";
import { AppProvider } from "./app";

import { ReplicateProvider } from "./replicate";
import { BackProvider } from "@/context/BackContext";
import { GridProvider } from "@/context/GridContext";
import { DarkModeProvider } from "@/context/DarkModeContext";
import { WalletProvider } from "./WalletProvider";

export const isDev = process.env.NEXT_PUBLIC_ENV === "dev";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <WalletProvider>
      <BackProvider>
        <GridProvider>
          <DarkModeProvider>
            <ReplicateProvider>
              <AppProvider>
                <DataProvider>{children}</DataProvider>
              </AppProvider>
            </ReplicateProvider>
          </DarkModeProvider>
        </GridProvider>
      </BackProvider>
    </WalletProvider>
  );
};

export default Providers;
