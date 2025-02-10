import { Outlet } from "react-router-dom";
import Header from "@/layouts/Header";
import Footer from "@/layouts/Footer";
import InfoBanner from "@/components/InfoBanner";

const Layout: React.FC = () => {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1 pt-[80px]">
        <div className="flex-1 px-4">
          <InfoBanner />
          <Outlet />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
