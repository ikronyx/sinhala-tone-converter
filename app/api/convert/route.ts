import { NextRequest, NextResponse } from "next/server";
import { convertText } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const { text, tone } = await req.json();

    if (!text || !tone) {
      return NextResponse.json(
        { error: "Missing text or tone" },
        { status: 400 }
      );
    }

    const result = await convertText({ text, tone });

    return NextResponse.json({ result });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}