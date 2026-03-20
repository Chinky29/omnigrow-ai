import { gemini, isAIEnabled } from "./gemini";
import { FarmData } from "./simulation";

export interface ReportData {
  dailySummary: {
    weather: string;
    cropStatus: string;
    recommendation: string;
  };
  yieldProjection: {
    q1: string;
    expectedYield: string;
    marketPrice: string;
    advice: string;
  };
  fullAudit: {
    investmentBreakdown: string;
    profitForecast: string;
    risks: string;
    schemes: string;
  };
}

export async function generateReports(
  data: FarmData,
  lang: "en" | "hi"
): Promise<ReportData> {
  const fallback: ReportData = {
    dailySummary: {
      weather: lang === "en" ? "Temperature 28°C, Rainfall 55% of optimal." : "तापमान 28°C, वर्षा इष्टतम का 55%।",
      cropStatus: lang === "en" ? `${data.crop} crop is in stable condition.` : `${data.crop} की फसल स्थिर स्थिति में है।`,
      recommendation: lang === "en" ? "Maintain current irrigation schedule." : "वर्तमान सिंचाई कार्यक्रम बनाए रखें।",
    },
    yieldProjection: {
      q1: lang === "en" ? "Moderate yield expected this quarter." : "इस तिमाही में मध्यम उपज की उम्मीद है।",
      expectedYield: lang === "en" ? "Estimated 20-25 quintals per acre." : "प्रति एकड़ 20-25 क्विंटल का अनुमान।",
      marketPrice: lang === "en" ? "Current market price is favorable." : "वर्तमान बाजार मूल्य अनुकूल है।",
      advice: lang === "en" ? "Consider early harvesting to avoid weather risk." : "मौसम के जोखिम से बचने के लिए जल्दी कटाई पर विचार करें।",
    },
    fullAudit: {
      investmentBreakdown: lang === "en" ? `Total investment: ₹${data.investment.toLocaleString("en-IN")}` : `कुल निवेश: ₹${data.investment.toLocaleString("en-IN")}`,
      profitForecast: lang === "en" ? "Expected return is 140% of investment." : "अपेक्षित रिटर्न निवेश का 140% है।",
      risks: lang === "en" ? "Low risk season ahead." : "आगे कम जोखिम का मौसम है।",
      schemes: lang === "en" ? "You may qualify for PM-KISAN and PMFBY." : "आप PM-KISAN और PMFBY के लिए पात्र हो सकते हैं।",
    },
  };

  if (!isAIEnabled || !gemini) return fallback;

  try {
    const prompt = `
You are KRISHIX AI, an expert agricultural advisor for Indian farmers.
A farmer has provided the following data:
- Crop: ${data.crop}
- Rainfall: ${data.rainfall}% of optimal
- Soil Type: ${data.soilType}
- Investment: ₹${data.investment.toLocaleString("en-IN")}
- Temperature: ${data.temperature}°C

Generate 3 detailed farm reports in ${lang === "hi" ? "simple Hindi that even an uneducated farmer can understand. Use simple words, avoid technical jargon. Use Indian farming context." : "simple English that even a non-technical farmer can understand."}.

Return ONLY valid JSON:
{
  "dailySummary": {
    "weather": "2 sentences about current weather impact on the crop",
    "cropStatus": "2 sentences about crop health and status",
    "recommendation": "1 clear action the farmer should take today"
  },
  "yieldProjection": {
    "q1": "Expected yield this quarter in simple terms",
    "expectedYield": "Estimated quintals per acre",
    "marketPrice": "Current market price outlook",
    "advice": "1 practical tip to maximize profit"
  },
  "fullAudit": {
    "investmentBreakdown": "Simple breakdown of where the ₹${data.investment} goes",
    "profitForecast": "Expected profit or loss in simple terms",
    "risks": "Main risks and how to avoid them",
    "schemes": "Government schemes the farmer qualifies for based on their crop and investment"
  }
}
Return ONLY the JSON. No markdown, no explanation.
    `;

    const response = await gemini.generateContent(prompt);
    const text = response.response.text();
    const clean = text.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
  } catch (error) {
    console.error("Report generation error:", error);
    return fallback;
  }
}