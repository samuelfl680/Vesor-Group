export type MarketQuote = {
  symbol: string;
  name: string;
  price: number;
  currency: string;
  change: number | null;
  changePct: number | null;
  updatedAt: string;
  source: string;
  isDelayed: boolean;
  isDemo: boolean;
};

type MarketProvider = {
  name: string;
  getQuotes: () => Promise<MarketQuote[]>;
};

const WATCHLIST = [
  { symbol: "NVDA", name: "NVIDIA" },
  { symbol: "TSLA", name: "Tesla" },
  { symbol: "MSFT", name: "Microsoft" },
];

const DEMO_QUOTES: MarketQuote[] = [
  {
    symbol: "NVDA",
    name: "NVIDIA",
    price: 187.52,
    currency: "USD",
    change: 2.31,
    changePct: 1.25,
    updatedAt: "Datos de demostración",
    source: "Demo",
    isDelayed: true,
    isDemo: true,
  },
  {
    symbol: "TSLA",
    name: "Tesla",
    price: 382.72,
    currency: "USD",
    change: -4.18,
    changePct: -1.08,
    updatedAt: "Datos de demostración",
    source: "Demo",
    isDelayed: true,
    isDemo: true,
  },
  {
    symbol: "MSFT",
    name: "Microsoft",
    price: 513.49,
    currency: "USD",
    change: 1.84,
    changePct: 0.36,
    updatedAt: "Datos de demostración",
    source: "Demo",
    isDelayed: true,
    isDemo: true,
  },
];

const demoProvider: MarketProvider = {
  name: "demo",
  async getQuotes() {
    return DEMO_QUOTES;
  },
};

const alphaVantageProvider: MarketProvider = {
  name: "alpha-vantage",
  async getQuotes() {
    const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
    if (!apiKey) return demoProvider.getQuotes();

    const results = await Promise.allSettled(
      WATCHLIST.map(async ({ symbol, name }) => {
        const url = new URL("https://www.alphavantage.co/query");
        url.searchParams.set("function", "GLOBAL_QUOTE");
        url.searchParams.set("symbol", symbol);
        url.searchParams.set("apikey", apiKey);

        const response = await fetch(url, { next: { revalidate: 300 } });
        if (!response.ok) throw new Error(`Alpha Vantage respondió ${response.status}`);

        const payload = (await response.json()) as {
          [key: string]: unknown;
          "Global Quote"?: Record<string, string>;
        };
        const quote = payload["Global Quote"];
        if (!quote?.["05. price"] || payload.Note || payload.Information) {
          throw new Error("No hay una cotización disponible en Alpha Vantage");
        }

        return {
          symbol,
          name,
          price: Number(quote["05. price"]),
          currency: "USD",
          change: Number(quote["09. change"]),
          changePct: Number.parseFloat(quote["10. change percent"]?.replace("%", "") || "0"),
          updatedAt: `Último día de mercado: ${quote["07. latest trading day"] || "no disponible"}`,
          source: "Alpha Vantage",
          isDelayed: true,
          isDemo: false,
        } satisfies MarketQuote;
      })
    );

    return results.flatMap((result) => (result.status === "fulfilled" ? [result.value] : []));
  },
};

const providers: Record<string, MarketProvider> = {
  demo: demoProvider,
  "alpha-vantage": alphaVantageProvider,
};

export async function getMarketQuotes() {
  const requestedProvider = process.env.MARKET_DATA_PROVIDER || (process.env.ALPHA_VANTAGE_API_KEY ? "alpha-vantage" : "demo");
  const provider = providers[requestedProvider] || demoProvider;
  const quotes = await provider.getQuotes();

  return {
    provider: provider.name,
    quotes,
    isDemo: quotes.every((quote) => quote.isDemo),
    warning: requestedProvider !== provider.name ? "Proveedor no configurado; mostrando datos de demostración." : null,
  };
}
