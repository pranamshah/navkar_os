import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { createGroq } from "@ai-sdk/groq";
import { generateText } from "ai";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { text } = await req.json();
  if (!text?.trim()) return NextResponse.json({ error: "text required" }, { status: 400 });

  const prompt = `You are an expert Indian accounting assistant (Tally-style). Parse this transaction description into a structured voucher.

Description: "${text}"

Return ONLY a valid JSON object with this exact structure:
{
  "voucherType": "PAYMENT|RECEIPT|SALES|PURCHASE|JOURNAL|CONTRA",
  "date": "YYYY-MM-DD",
  "narration": "clean description",
  "totalAmount": number,
  "suggestedLines": [
    {"account": "account name", "type": "Dr|Cr", "amount": number, "narration": "optional note"}
  ]
}

Rules:
- For payments: Dr the expense/party, Cr the bank/cash
- For receipts: Dr the bank/cash, Cr the income/party
- For sales: Dr the party/debtors, Cr the income + GST payable
- Include GST lines if GST amount is mentioned or inferable (18% default)
- Date: use today (${new Date().toISOString().split("T")[0]}) if not specified
- Indian context: amounts in ₹, GST at 18% unless specified

Return ONLY the JSON, no explanation.`;

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "AI service not configured" }, { status: 503 });

  try {
    const groq = createGroq({ apiKey });
    const { text: result } = await generateText({
      model: groq("llama3-8b-8192"),
      prompt,
      maxOutputTokens: 500,
    });

    const parsed = JSON.parse(result.trim());
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Could not parse transaction. Try being more specific." }, { status: 422 });
  }
}
