import { useState } from "react";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import MobileMenu from "./MobileMenu";
import Sidebar from "./Sidebar";

export default function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-50 font-sans">
      <Header
        className="fixed top-0 left-0 right-0 z-10"
        onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
      />
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
      <div className="flex flex-1 overflow-hidden pt-16 md:pt-20">
        <Sidebar className="hidden md:block" />
        <main className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto px-4 md:ml-64 pb-8">
            <Outlet />
          </div>
        </main>
      </div>
      <Footer className="fixed bottom-0 left-0 right-0 z-10" />
    </div>
  );
}
