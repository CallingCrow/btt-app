interface CloverTaxRate {
  id: string;
  name: string;
  rate: number;
  isDefault?: boolean;
}

interface CloverTaxRateResponse {
  elements: CloverTaxRate[];
}

const CLOVER_BASE =
  process.env.CLOVER_ENV === "production"
    ? "https://api.clover.com"
    : "https://apisandbox.dev.clover.com";

export async function getCloverTaxRates(): Promise<CloverTaxRate[]> {
  const merchantId = process.env.CLOVER_MERCHANT_ID;
  const apiKey = process.env.CLOVER_API_KEY;

  if (!merchantId) {
    throw new Error("Missing CLOVER_MERCHANT_ID");
  }

  if (!apiKey) {
    throw new Error("Missing CLOVER_API_KEY");
  }

  const response = await fetch(
    `${CLOVER_BASE}/v3/merchants/${merchantId}/tax_rates`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
      },
      cache: "no-store",
    },
  );

  const text = await response.text();

  console.log("Clover tax rate status:", response.status);
  console.log("Clover tax rate response:", text);

  if (!response.ok) {
    throw new Error(`Clover tax rate error: ${text}`);
  }

  const data: CloverTaxRateResponse = JSON.parse(text);

  return data.elements ?? [];
}

export async function getDefaultCloverTaxRate(): Promise<CloverTaxRate> {
  const taxRates = await getCloverTaxRates();

  const defaultTaxRate = taxRates.find((taxRate) => taxRate.isDefault === true);

  if (!defaultTaxRate) {
    throw new Error("No default Clover tax rate configured");
  }

  console.log(
    "Using Clover default tax rate:",
    JSON.stringify(defaultTaxRate, null, 2),
  );

  return defaultTaxRate;
}
