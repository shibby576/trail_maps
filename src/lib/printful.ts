const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY!;
const BASE_URL = "https://api.printful.com";

async function printfulFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${PRINTFUL_API_KEY}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Printful API error ${res.status}: ${body}`);
  }

  return res.json();
}

interface PrintfulOrderItem {
  variant_id: number;
  quantity: number;
  files: { type: string; url: string }[];
}

interface PrintfulRecipient {
  name: string;
  address1: string;
  address2?: string;
  city: string;
  state_code: string;
  country_code: string;
  zip: string;
}

export async function createOrder(
  recipient: PrintfulRecipient,
  items: PrintfulOrderItem[]
) {
  return printfulFetch("/orders", {
    method: "POST",
    body: JSON.stringify({ recipient, items }),
  });
}

export async function confirmOrder(orderId: number) {
  return printfulFetch(`/orders/${orderId}/confirm`, {
    method: "POST",
  });
}
