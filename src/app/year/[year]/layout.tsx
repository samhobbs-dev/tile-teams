import type { Metadata } from "next";
import { CURRENT_YEAR, FIRST_YEAR, NEXT_YEAR } from "@/const/const";

type Props = {
  params: Promise<{ year: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { year } = await params;
  const parsedYear = parseInt(year, 10);
  const isValidYear =
    !isNaN(parsedYear) && parsedYear >= FIRST_YEAR && parsedYear < NEXT_YEAR;
  const displayYear = isValidYear ? parsedYear : CURRENT_YEAR;

  return {
    title: `${displayYear} Season`,
    description: `College football schedules, standings, and rankings for the ${displayYear} season.`,
    alternates: {
      canonical: `/year/${displayYear}`,
    },
  };
}

export default function YearLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
