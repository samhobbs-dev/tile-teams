"use client";

import { store } from "@/store/store";
import { Provider } from "react-redux";
import SchedulePage from "@/page/SchedulePage";
import Header from "@/component/Header";
import Footer from "@/component/Footer";
import ThemeRegistry from "@/component/ThemeRegistry";
import { CURRENT_YEAR } from "../const/const";

export default function Home() {
  return (
    <Provider store={store}>
      <ThemeRegistry>
        <div className="text-center">
          <header className="text-2xl">
            <Header />
          </header>
          <main
            className={`
              bg-cover bg-center min-h-screen flex flex-col items-center
              justify-center font-sans
            `}
          >
            <SchedulePage year={CURRENT_YEAR.toString()} />
          </main>
          <footer className="text-xl">
            <Footer />
          </footer>
        </div>
      </ThemeRegistry>
    </Provider>
  );
}
