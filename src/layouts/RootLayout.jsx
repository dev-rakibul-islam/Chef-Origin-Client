import { Outlet } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";
import ScrollToTopOnNavigation from "../components/ScrollToTopOnNavigation";

export default function RootLayout() {
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <ScrollToTopOnNavigation />
      <Navbar />
      <main className="grow pt-18">
        <Outlet />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
