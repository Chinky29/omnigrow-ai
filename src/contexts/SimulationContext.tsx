import { createContext, useContext, useState, ReactNode } from "react";
import { SimulationResult, FarmData, simulate } from "@/lib/simulation";

interface SimulationContextType {
  result: SimulationResult;
  farmData: FarmData;
  setResult: (r: SimulationResult) => void;
  setFarmData: (d: FarmData) => void;
}

const defaultFarmData: FarmData = {
  crop: "Wheat", rainfall: 55, soilType: "Alluvial",
  investment: 15000, temperature: 28,
};

const SimulationContext = createContext<SimulationContextType | null>(null);

export const SimulationProvider = ({ children }: { children: ReactNode }) => {
  const [farmData, setFarmData] = useState<FarmData>(defaultFarmData);
  const [result, setResult] = useState<SimulationResult>(simulate(defaultFarmData));

  return (
    <SimulationContext.Provider value={{ result, farmData, setResult, setFarmData }}>
      {children}
    </SimulationContext.Provider>
  );
};

export const useSimulation = () => {
  const ctx = useContext(SimulationContext);
  if (!ctx) throw new Error("useSimulation must be used inside SimulationProvider");
  return ctx;
};