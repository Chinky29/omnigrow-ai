import { gemini, isAIEnabled } from "./gemini.ts";

export interface FarmData {
  crop: string;
  rainfall: number;
  soilType: string;
  investment: number;
  temperature: number;
}

export interface SimulationResult {
  risk: number;
  profit: number;
  outcome: string;
  factors: { label: string; impact: number }[];
  actions: string[];
  breakeven: string;
  cropComparison: { name: string; profit: number; risk: number }[];
}

const cropBaseYield: Record<string, number> = {
  Wheat: 25000, Rice: 22000, Corn: 20000, Sugarcane: 45000, Cotton: 30000, Soybean: 18000,
};

const soilMultiplier: Record<string, number> = {
  Alluvial: 1.15, "Black Cotton": 1.1, "Red Laterite": 0.9, "Sandy Loam": 0.95, Clay: 0.85,
};

export function simulate(data: FarmData): SimulationResult {
  const baseYield = cropBaseYield[data.crop] || 20000;
  const soilMult = soilMultiplier[data.soilType] || 1;

  // Rainfall impact: optimal around 50-70
  const rainfallDev = Math.abs(data.rainfall - 60) / 60;
  const rainfallImpact = Math.round((1 - rainfallDev) * 30 - 15);

  // Soil impact
  const soilImpact = Math.round((soilMult - 1) * 100);

  // Temperature: optimal 20-32
  const tempDev = data.temperature < 20 ? (20 - data.temperature) / 20 : data.temperature > 32 ? (data.temperature - 32) / 20 : 0;
  const tempImpact = Math.round(-tempDev * 25);

  // Investment impact
  const invRatio = data.investment / baseYield;
  const investmentImpact = Math.round((Math.min(invRatio, 1.5) - 0.7) * 30);

  // Calculate risk (0-100)
  const rawRisk = 50 - rainfallImpact - soilImpact - tempImpact - investmentImpact * 0.5;
  const risk = Math.max(5, Math.min(95, Math.round(rawRisk)));

  // Calculate profit
  const yieldMult = 1 + (rainfallImpact + soilImpact + tempImpact + investmentImpact) / 100;
  const revenue = baseYield * yieldMult * soilMult;
  const profit = Math.round(revenue - data.investment);

  // Outcome text
  let outcome: string;
  if (risk < 30) outcome = "Excellent conditions — strong yield expected with minimal risk. Favorable season ahead.";
  else if (risk < 50) outcome = "Good potential with manageable risks. Monitor weather and maintain current strategy.";
  else if (risk < 70) outcome = "Moderate risk with decent yield potential. Consider diversification and insurance.";
  else outcome = "High risk scenario — adverse conditions detected. Strongly consider crop insurance and alternative plans.";

  // Actions
  const actions: string[] = [];
  if (data.rainfall < 40) actions.push("Increase irrigation or install drip system");
  if (data.rainfall > 80) actions.push("Set up drainage channels to prevent waterlogging");
  if (tempImpact < -5) actions.push("Use temperature-resistant seed varieties");
  if (investmentImpact < 0) actions.push("Consider micro-loans or government subsidies");
  if (risk > 50) actions.push("Purchase crop insurance (PMFBY)");
  if (actions.length < 2) actions.push("Maintain current farming practices");
  if (risk > 40) actions.push("Diversify with companion crops for risk mitigation");

  // Breakeven
  const deficit = profit < 0 ? Math.abs(profit) : 0;
  const breakeven = profit < 0
    ? `Increase rainfall by ${Math.round(rainfallDev * 30)}% or reduce costs by ₹${deficit.toLocaleString("en-IN")} to break even.`
    : `You are ₹${profit.toLocaleString("en-IN")} above break-even. Buffer is ${Math.round((profit / data.investment) * 100)}% of investment.`;

  // Factors
  const factors = [
    { label: `Rainfall ${data.rainfall < 40 ? "low" : data.rainfall > 70 ? "heavy" : "adequate"}`, impact: rainfallImpact },
    { label: `Soil quality (${data.soilType})`, impact: soilImpact },
    { label: `Temperature ${data.temperature}°C`, impact: tempImpact },
    { label: `Investment level`, impact: investmentImpact },
  ];

  // Crop comparison
  const allCrops = ["Wheat", "Rice", "Corn"];
  const cropComparison = allCrops.map((c) => {
    const by = cropBaseYield[c] || 20000;
    const ym = 1 + (rainfallImpact + soilImpact + tempImpact) / 100;
    const rev = by * ym * soilMult;
    const p = Math.round(rev - data.investment);
    const r = Math.max(5, Math.min(95, Math.round(50 - rainfallImpact - soilImpact - tempImpact + (c === "Rice" ? -5 : c === "Corn" ? 3 : 0))));
    return { name: c, profit: p, risk: r };
  });

  return { risk, profit, outcome, factors, actions: actions.slice(0, 4), breakeven, cropComparison };
}
export async function simulateWithAI(data: FarmData, lang: "en" | "hi"): Promise<SimulationResult> {
  const localResult = simulate(data);

  if (!isAIEnabled || !gemini) {
    return localResult;
  }

  try {
    const prompt = `
You are an expert Agricultural AI Advisor (KRISHIX AI).
Based on the following farm data, provide a detailed agricultural insight report.

Farm Data:
- Crop: ${data.crop}
- Rainfall: ${data.rainfall}% (of optimal)
- Soil Type: ${data.soilType}
- Investment: ₹${data.investment.toLocaleString("en-IN")}
- Temperature: ${data.temperature}°C

Initial Calculations:
- Risk Level: ${localResult.risk}%
- Expected Profit: ₹${localResult.profit.toLocaleString("en-IN")}

Respond in ${lang === "hi" ? "Hindi" : "English"}.
Return ONLY a valid JSON object with these exact keys:
{
  "risk": number between 5 and 95,
  "outcome": "detailed paragraph about future outcome and crop prospects",
  "actions": ["action1", "action2", "action3", "action4"],
  "breakeven": "concise sentence about profitability",
  "factors": [
    { "label": "short label", "impact": number between -30 and 30 },
    { "label": "short label", "impact": number },
    { "label": "short label", "impact": number },
    { "label": "short label", "impact": number }
  ],
  "cropComparison": [
    { "name": "Wheat", "profit": number, "risk": number },
    { "name": "Rice", "profit": number, "risk": number },
    { "name": "Corn", "profit": number, "risk": number }
  ]
}
Return ONLY the JSON. No explanation, no markdown, no backticks.
    `;

    const response = await gemini.generateContent(prompt);
    const text = response.response.text();

    // Strip any accidental markdown backticks
    const clean = text.replace(/```json|```/g, "").trim();
    const aiContent = JSON.parse(clean);

    return {
      ...localResult,
      risk: typeof aiContent.risk === "number" ? aiContent.risk : localResult.risk,
      outcome: aiContent.outcome || localResult.outcome,
      actions: aiContent.actions || localResult.actions,
      breakeven: aiContent.breakeven || localResult.breakeven,
      factors: aiContent.factors || localResult.factors,
      cropComparison: aiContent.cropComparison || localResult.cropComparison,
    };
  } catch (error) {
    console.error("Gemini Error:", error);
    return localResult; // graceful fallback to local simulation
  }
}



