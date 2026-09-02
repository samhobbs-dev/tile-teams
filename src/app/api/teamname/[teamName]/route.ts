import { TeamResponse } from "@/type/team";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { logError } from "@/lib/logger";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ teamName: string }> }
) {
  const { teamName } = await params;
  // currentLogo in TeamResponse is duplicate of logo
  try {
    // Assumes school name is unique (so [0])
    const result: TeamResponse[] = await prisma.$queryRaw(Prisma.sql`
        select
          id,
          name_full as full_name,
          name_school as school,
          mascot,
          logo,
          current_logo
        from teams t
        left join (
          select team_id, image as logo, image as current_logo from logos
          where team_id is not null and year_last is null
        ) as t2
        on t.id = t2.team_id
        where name_school = ${teamName}
        ;
    `);
    if (result && result.length > 0) {
      return NextResponse.json(result[0], { status: 200 });
    } else {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }
  } catch (error) {
    logError("Error fetching teams for team name", error, { teamName });

    return NextResponse.json(
      {
        error: `Failed to fetch teams for team name ${teamName}.
          ${error instanceof Error ? error.message : "Unknown error"}`,
      },
      { status: 500 }
    );
  }
}
