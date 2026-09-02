import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { logError } from "@/lib/logger";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ year: string }> }
) {
  const { year } = await params;
  try {
    const records = await prisma.records.findMany({
      where: {
        year: parseInt(year),
      },
      include: {
        teams: true,
      },
    });
    if (records) {
      return NextResponse.json(records, { status: 200 });
    } else {
      return NextResponse.json(
        { error: "Records not found" },
        { status: 404 }
      );
    }
  } catch (error) {
    logError("Error fetching records for year", error, { year });

    return NextResponse.json(
      {
        error: `Failed to fetch records for year ${year}. 
          ${error instanceof Error ? error.message : "Unknown error"}`,
      },
      { status: 500 }
    );
  }
}
