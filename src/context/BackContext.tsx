import { useCallback } from "react";
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

interface AppContextType {
  triggerBackAction: boolean;
  onBackButtonClick: () => void;
  onNewButtonClickHandled: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [triggerBackAction, setTriggerBackAction] = useState(false);

  const onBackButtonClick = useCallback(() => {
    setTriggerBackAction(true);
  }, []);

  const onNewButtonClickHandled = () => {
    setTriggerBackAction(false);
  };

  return (
    <AppContext.Provider value={{ triggerBackAction, onBackButtonClick, onNewButtonClickHandled }}>
      {children}
    </AppContext.Provider>
  );
};

