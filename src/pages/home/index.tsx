import OrderForm from "./components/OrderForm";
import Orderbook from "./components/Orderbook";
import Chart from "./components/Chart";
import History from "./components/History";

const Home: React.FC = () => {
  return (
    <div className="flex gap-4">
      <div className="flex w-2/3 flex-col gap-4">
        <Chart className="" />
        <History className="" />
      </div>
      <div className="flex w-1/3 min-w-[220px] max-w-[420px] flex-col gap-4">
        <Orderbook className="" />
        <OrderForm className="" />
      </div>
    </div>
  );
};

export default Home;
