import Header from "@components/header/Header.tsx";
import Footer from "@components/footer/Footer.tsx";
import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";

const Layout = () => {
  return (
    <>
      <header>
        <Header/>
      </header>
      <main className="pb-4">
        <Outlet/>
        {/* Rendu des composants enfants au Layout ici */}
        <Toaster richColors/>
      </main>
      <footer>
        <Footer/>
      </footer>
    </>
  );
}

export default Layout;