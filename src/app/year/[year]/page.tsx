"use client";

import Image from "next/image";
import { store } from "@/store/store";
import { Provider } from "react-redux";
import SchedulePage from "@/page/SchedulePage";
import Header from "@/component/Header";
import Footer from "@/component/Footer";

import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useState, useEffect } from "react";
import { CURRENT_YEAR, FIRST_YEAR } from "@/const/const";

// TODO resolve potential undefined URL or other screwery
export default function Home() {
  const pathname = usePathname();
  const [year, setYear] = useState<string | null>(null); // Initial state is null

  useEffect(() => {
    // Extract the year from the pathname (assuming the route is something like /year/2020)
    const segments = pathname.split("/");
    const yearFromPath = segments[2]; // Assuming /year/[year]
    // Validate yearFromPath
    const parsedYear = parseInt(yearFromPath, 10);
    const isValidYear =
      !isNaN(parsedYear) && parsedYear >= FIRST_YEAR && parsedYear < 2026;
    setYear(isValidYear ? yearFromPath : CURRENT_YEAR.toString()); // Use the provided year if valid, otherwise default to 2025
  }, [pathname]);

  if (year === null) {
    // Optionally render a loading state or nothing until year is determined
    return <div>Loading...</div>;
  }

  return (
    <Provider store={store}>
      <div className="text-center">
        {/* <main className="flex min-h-screen flex-col items-center justify-between p-24"> */}
        <header className="text-2xl">
          <Header />
        </header>
        <main className="bg-gray-300 min-h-screen flex flex-col items-center justify-center text-black font-sans">
          <SchedulePage year={year as string} />
        </main>
        <footer className="text-xl">
          <Footer />
        </footer>
      </div>
    </Provider>
  );
}
