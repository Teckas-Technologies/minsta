import { createContext, useContext, useState, ReactNode } from "react";

type BackContextType = {
    back: boolean;
    toggleBack: (v: boolean) => void;
};

const BackContext = createContext<BackContextType | undefined>(undefined);

export const BackProvider = ({ children }: { children: ReactNode }) => {
  const [back, setBack] = useState(false);

  const toggleBack = (value: boolean) => {
    setBack(value);
  };

  return (
    <BackContext.Provider value={{ back, toggleBack }}>
      {children}
    </BackContext.Provider>
  );
};

export const useBack = (): BackContextType => {
    const context = useContext(BackContext);
    if (context === undefined) {
      throw new Error('useBack must be used within a BackProvider');
    }
    return context;
  };
