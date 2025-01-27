import OrderForm from "./components/OrderForm";
import Orderbook from "./components/Orderbook";
import Chart from "./components/Chart";
import History from "./components/History";

const Home: React.FC = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-4 min-h-[680px]">
        <Chart className="col-span-2" />
        <Orderbook className="col-span-1" />
      </div>
      <div className="grid grid-cols-3 gap-4 min-h-[320px]">
        <History className="col-span-2" />
        <OrderForm className="col-span-1" />
      </div>
    </div>
  );
};

export default Home;
