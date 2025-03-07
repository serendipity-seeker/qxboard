import { useAtom } from "jotai";
import { Toaster } from "react-hot-toast";
import { RouterProvider } from "react-router-dom";
import { QubicConnectProvider } from "./components/connect/QubicConnectContext";
import { WalletConnectProvider } from "./components/connect/WalletConnectContext";
import router from "./router";
import { settingsAtom } from "./store/settings";

const App: React.FC = () => {
  const [settings] = useAtom(settingsAtom);

  return (
    <div className={`bg-background text-foreground ${settings.darkMode ? "dark" : ""}`}>
      <WalletConnectProvider>
        <QubicConnectProvider>
          <RouterProvider router={router} />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#202E3C",
                color: "#fff",
              },
            }}
          />
        </QubicConnectProvider>
      </WalletConnectProvider>
    </div>
  );
};

export default App;
