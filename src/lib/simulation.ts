export type AnalysisMode = "automatico" | "personalizado";
export type Sensitivity = "baja" | "media" | "alta";

export type SimulationConfig = {
  company: string;
  startDate: string;
  endDate: string;
  mode: AnalysisMode;
  level: number;
  maxNews: number;
  relationDepth: number;
  simulations: number;
  sensitivity: Sensitivity;
  includeRelations: boolean;
};

export type SimulationPoint = { risk: number; density: number };
export type Scenario = { name: string; probability: number; description: string };
export type Relation = { symbol: string; name: string; type: string; strength: number; impact: number };

export type SimulationResult = {
  company: DemoCompany;
  meanRisk: number;
  standardDeviation: number;
  confidence: "baja" | "media" | "alta";
  trend: "alcista" | "estable" | "correccion";
  analyzedNews: NewsItem[];
  relations: Relation[];
  distribution: SimulationPoint[];
  scenarios: Scenario[];
  warning: string | null;
  config: SimulationConfig;
};

type NewsItem = {
  title: string;
  date: string;
  source: string;
  impact: number;
  relevance: number;
  category: string;
};

type DemoCompany = {
  symbol: string;
  name: string;
  sector: string;
  baseRisk: number;
  baseTrend: number;
  news: NewsItem[];
  relations: Array<{ symbol: string; name: string; type: string; strength: number; risk: number }>;
};

export const DEMO_COMPANIES: DemoCompany[] = [
  {
    symbol: "NVDA",
    name: "NVIDIA",
    sector: "Semiconductores e IA",
    baseRisk: 47,
    baseTrend: 1,
    news: [
      { title: "Demanda de centros de datos sostiene el mercado de chips", date: "2026-10-08", source: "Demo Finance", impact: -5, relevance: 94, category: "demanda" },
      { title: "NVIDIA amplía acuerdos de suministro para nueva generación", date: "2026-10-05", source: "Demo Finance", impact: -3, relevance: 88, category: "estrategia" },
      { title: "Competencia intensifica inversión en aceleradores de IA", date: "2026-09-28", source: "Demo Finance", impact: 6, relevance: 79, category: "competencia" },
      { title: "Mercado evalúa concentración de clientes tecnológicos", date: "2026-09-19", source: "Demo Finance", impact: 8, relevance: 72, category: "concentración" },
      { title: "Resultados del sector superan expectativas moderadamente", date: "2026-09-12", source: "Demo Finance", impact: -4, relevance: 68, category: "resultados" },
    ],
    relations: [
      { symbol: "TSM", name: "TSMC", type: "proveedor", strength: 0.85, risk: 54 },
      { symbol: "MSFT", name: "Microsoft", type: "cliente estratégico", strength: 0.62, risk: 39 },
      { symbol: "AMD", name: "AMD", type: "competidor", strength: 0.56, risk: 58 },
    ],
  },
  {
    symbol: "TSLA",
    name: "Tesla",
    sector: "Automoción y energía",
    baseRisk: 55,
    baseTrend: -1,
    news: [
      { title: "Ventas trimestrales muestran presión en mercados clave", date: "2026-10-07", source: "Demo Finance", impact: 9, relevance: 92, category: "ventas" },
      { title: "Nueva inversión en almacenamiento energético", date: "2026-10-02", source: "Demo Finance", impact: -4, relevance: 84, category: "estrategia" },
      { title: "Fabricantes tradicionales aceleran vehículos eléctricos", date: "2026-09-25", source: "Demo Finance", impact: 6, relevance: 78, category: "competencia" },
      { title: "Cambios regulatorios afectan incentivos de movilidad", date: "2026-09-18", source: "Demo Finance", impact: 7, relevance: 75, category: "regulación" },
    ],
    relations: [
      { symbol: "NVDA", name: "NVIDIA", type: "tecnología", strength: 0.38, risk: 47 },
      { symbol: "F", name: "Ford", type: "competidor", strength: 0.51, risk: 52 },
      { symbol: "PAN", name: "Panasonic", type: "baterías", strength: 0.64, risk: 44 },
    ],
  },
  {
    symbol: "MSFT",
    name: "Microsoft",
    sector: "Software y nube",
    baseRisk: 36,
    baseTrend: 1,
    news: [
      { title: "Crecimiento de servicios cloud mantiene perspectivas positivas", date: "2026-10-06", source: "Demo Finance", impact: -7, relevance: 93, category: "resultados" },
      { title: "Inversión en infraestructura de inteligencia artificial", date: "2026-09-30", source: "Demo Finance", impact: -3, relevance: 87, category: "inversión" },
      { title: "Reguladores revisan concentración en plataformas cloud", date: "2026-09-20", source: "Demo Finance", impact: 8, relevance: 80, category: "regulación" },
      { title: "Competidores anuncian productos empresariales equivalentes", date: "2026-09-10", source: "Demo Finance", impact: 3, relevance: 66, category: "competencia" },
    ],
    relations: [
      { symbol: "NVDA", name: "NVIDIA", type: "cliente tecnológico", strength: 0.62, risk: 47 },
      { symbol: "AMZN", name: "Amazon", type: "competidor cloud", strength: 0.66, risk: 45 },
      { symbol: "ORCL", name: "Oracle", type: "competidor cloud", strength: 0.45, risk: 43 },
    ],
  },
];

export const DEFAULT_SIMULATION: SimulationConfig = {
  company: "NVDA",
  startDate: "2026-09-01",
  endDate: "2026-10-11",
  mode: "automatico",
  level: 3,
  maxNews: 15,
  relationDepth: 1,
  simulations: 250,
  sensitivity: "media",
  includeRelations: true,
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

function dateDistance(start: string, end: string) {
  return Math.max(1, Math.round((Date.parse(end) - Date.parse(start)) / 86_400_000));
}

function confidenceFor(config: SimulationConfig, newsCount: number) {
  if (newsCount < 2) return "baja" as const;
  if (config.level >= 4 && newsCount >= 4) return "alta" as const;
  return "media" as const;
}

// This is a deterministic prototype model: later, provider outputs can replace these demo signals.
export function runSimulation(config: SimulationConfig): SimulationResult {
  const company = DEMO_COMPANIES.find((item) => item.symbol === config.company) || DEMO_COMPANIES[0];
  const start = Date.parse(config.startDate);
  const end = Date.parse(config.endDate);
  const hasValidDates = Number.isFinite(start) && Number.isFinite(end) && end >= start;
  const news = hasValidDates
    ? company.news.filter((item) => Date.parse(item.date) >= start && Date.parse(item.date) <= end).slice(0, config.maxNews)
    : [];
  const relations = config.includeRelations
    ? company.relations.slice(0, Math.max(0, config.relationDepth + 2)).map((relation) => ({
        ...relation,
        impact: Math.round((relation.risk - company.baseRisk) * relation.strength * (config.relationDepth > 1 ? 0.7 : 0.45)),
      }))
    : [];

  const newsImpact = news.length
    ? news.reduce((total, item) => total + item.impact * (item.relevance / 100), 0) / Math.sqrt(news.length)
    : 0;
  const relationImpact = relations.reduce((total, relation) => total + relation.impact, 0);
  const sensitivityMultiplier = config.sensitivity === "alta" ? 1.25 : config.sensitivity === "baja" ? 0.75 : 1;
  const meanRisk = clamp(Math.round(company.baseRisk + (newsImpact + relationImpact) * sensitivityMultiplier), 5, 95);
  const standardDeviation = clamp(
    Math.round(18 - config.level * 1.8 + (news.length < 2 ? 6 : 0) + (hasValidDates ? 0 : 8)),
    4,
    28
  );
  const spread = Math.max(8, standardDeviation * 1.8);
  const distribution = Array.from({ length: 41 }, (_, index) => {
    const risk = index * 2.5;
    const density = Math.exp(-0.5 * ((risk - meanRisk) / spread) ** 2);
    return { risk, density };
  });
  const relationTrend = relations.reduce((total, relation) => total - relation.impact, 0);
  const trend = company.baseTrend + relationTrend / 30 > 0.35 ? "alcista" : company.baseTrend + relationTrend / 30 < -0.35 ? "correccion" : "estable";
  const warning = !hasValidDates
    ? "Revisa el rango de fechas antes de interpretar la simulación."
    : news.length === 0
      ? "No hay noticias relevantes de demostración en este periodo; la incertidumbre es alta."
      : news.length < 3
        ? "Hay poca evidencia en el periodo seleccionado; interpreta el resultado con cautela."
        : null;

  return {
    company,
    meanRisk,
    standardDeviation,
    confidence: confidenceFor(config, news.length),
    trend,
    analyzedNews: news,
    relations,
    distribution,
    scenarios: [
      { name: "Favorable", probability: clamp(28 - meanRisk / 8, 8, 32), description: "Noticias positivas y relaciones estables." },
      { name: "Base", probability: clamp(55, 35, 65), description: "La evidencia mantiene el comportamiento actual." },
      { name: "Adverso", probability: clamp(17 + meanRisk / 8, 12, 38), description: "Se materializan señales negativas o contagio empresarial." },
    ],
    warning,
    config: { ...config, company: company.symbol },
  };
}
