import { WalletConnectProvider } from "./components/connect/WalletConnectContext";
import { QubicConnectProvider } from "./components/connect/QubicConnectContext";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import router from "./router";

const App: React.FC = () => {
  return (
    <div className="dark bg-background text-foreground">
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
