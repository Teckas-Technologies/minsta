import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type GridContextType = {
    grid: string | null;
    toggleGrid: () => void;
};

const GridContext = createContext<GridContextType | undefined>(undefined);

export const GridProvider = ({ children }: { children: ReactNode }) => {
  const [grid, setGrid] = useState<string | null>("1");

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedGrid = localStorage.getItem("grid");
      setGrid(storedGrid);
    }
  }, []);

  useEffect(() => {
    if (grid) {
      if(typeof window !== 'undefined'){
        localStorage.setItem('grid', grid);
      }
    }
  }, [grid]);

  const toggleGrid = () => {
    if(grid === "1") {
      setGrid("2")
    } else if(grid === "2") {
      setGrid("3")
    } else if(grid === "3"){
      setGrid("1")
    }
  }

  return (
    <GridContext.Provider value={{ grid, toggleGrid }}>
      {children}
    </GridContext.Provider>
  );
};

export const useGrid = (): GridContextType => {
  const context = useContext(GridContext);
  if (context === undefined) {
    throw new Error('useGrid must be used within a GridProvider');
  }
  return context;
};