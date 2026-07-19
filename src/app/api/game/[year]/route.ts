import { GameResponse } from "@/type/teamGame";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ year: string }> }
) {
  const { year } = await params;
  try {
    const schedules: GameResponse[] = await prisma.games.findMany({
      where: {
        year: parseInt(year),
        completed: 1,
      },
    });
    if (schedules) {
      return NextResponse.json(schedules, { status: 200 });
    } else {
      return NextResponse.json({ error: "Games not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error fetching games for year:", year);

    return NextResponse.json(
      {
        error: `Failed to fetch games for year ${year}. 
          ${error instanceof Error ? error.message : "Unknown error"}`,
      },
      { status: 500 }
    );
  }
}
