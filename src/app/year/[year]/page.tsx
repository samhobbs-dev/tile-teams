"use client";
import { store } from "@/store/store";
import { Provider } from "react-redux";
import SchedulePage from "@/page/SchedulePage";
import Header from "@/component/Header";
import Footer from "@/component/Footer";
import ThemeRegistry from "@/component/ThemeRegistry";
import { usePathname } from "next/navigation";
import { CURRENT_YEAR, FIRST_YEAR, NEXT_YEAR } from "@/const/const";

// TODO resolve potential undefined URL or other screwery
export default function Home() {
  const pathname = usePathname();
  
  // Extract the year from the pathname (assuming route is like /year/2020)
  const segments = pathname.split("/");
  const yearFromPath = segments[2]; // Assuming /year/[year]
  const parsedYear = parseInt(yearFromPath, 10);
  const isValidYear =
    !isNaN(parsedYear) && parsedYear >= FIRST_YEAR && parsedYear < NEXT_YEAR;
  const year = isValidYear ? yearFromPath : CURRENT_YEAR.toString();

  if (year === null) {
    // Optionally render a loading state or nothing until year is determined
    return <div>Loading...</div>;
  }

  return (
    <Provider store={store}>
      <ThemeRegistry>
        <div className="text-center">
          <header className="text-2xl">
            <Header />
          </header>
          <main
            className={`
              min-h-screen flex flex-col items-center justify-center
              font-sans
            `}
          >
            <SchedulePage year={year as string} />
          </main>
          <footer className="text-xl">
            <Footer />
          </footer>
        </div>
      </ThemeRegistry>
    </Provider>
  );
}
