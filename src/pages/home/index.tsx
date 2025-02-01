import OrderForm from "./components/OrderForm";
import Orderbook from "./components/Orderbook";
import Chart from "./components/Chart";
import History from "./components/History";

const Home: React.FC = () => {
  return (
    <div className="grid grid-cols-1 gap-4">
      {/* Main content area */}
      <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-[1fr_minmax(220px,360px)]">
        {/* Left column */}
        <div className="grid grid-rows-[2fr_1fr] gap-4">
          <Chart className="min-h-[400px]" />
          <History className="min-h-[200px]" />
        </div>

        {/* Right column */}
        <div className="grid grid-rows-[2fr_1fr] gap-4">
          <Orderbook className="min-h-[400px]" />
          <OrderForm className="min-h-[200px]" />
        </div>
      </div>
    </div>
  );
};

export default Home;
