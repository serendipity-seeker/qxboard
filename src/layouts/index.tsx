import { Outlet } from "react-router-dom";
import Header from "@/layouts/Header";
import Footer from "@/layouts/Footer";
import useAPIFetcher from "@/hooks/useAPIFetcher";
import useRPCFetcher from "@/hooks/useRPCFetcher";

const Layout: React.FC = () => {
  useRPCFetcher();
  useAPIFetcher();

  return (
    <div className="relative flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1 pt-[56px]">
        <div className="flex-1 p-2">
          <Outlet />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
