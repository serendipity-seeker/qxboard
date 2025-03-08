import { Outlet } from "react-router-dom";
import Header from "@/layouts/Header";
import Footer from "@/layouts/Footer";
import useAPIFetcher from "@/hooks/useAPIFetcher";
import useRPCFetcher from "@/hooks/useRPCFetcher";
import { useContext } from "react";
import { useEffect } from "react";
import { useQubicConnect } from "@/components/connect/QubicConnectContext";
import { MetaMaskContext } from "@/components/connect/MetamaskContext";

const Layout: React.FC = () => {
  const [state] = useContext(MetaMaskContext);
  const { mmSnapConnect, connect } = useQubicConnect();
  useRPCFetcher();
  useAPIFetcher();

  useEffect(() => {
    const storedWallet = localStorage.getItem("wallet");
    if (storedWallet) {
      connect(JSON.parse(storedWallet));
    } else if (state.installedSnap) {
      mmSnapConnect();
    }
  }, [state]);

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
