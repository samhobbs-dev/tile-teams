import { NextResponse } from "next/server";
import { logError } from "@/lib/logger";

export async function GET() {
  try {
    const res = await fetch(
      "https://ncaa-api.henrygd.me/scoreboard/football/fbs"
    );
    const data = await res.json();

    return NextResponse.json(data, {
      status: 200,
      headers: {
        // optional if your frontend is on a different domain
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    logError("Failed to fetch live scores", error);
    return NextResponse.json({ error: "Failed to fetch scores" }, { status: 500 });
  }
}
