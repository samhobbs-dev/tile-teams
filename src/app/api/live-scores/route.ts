import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(
      "https://ncaa-api.henrygd.me/scoreboard/football/fbs"
    );
    const data = await res.json();

    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*", // optional if your frontend is on a different domain
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch scores" }, { status: 500 });
  }
}
