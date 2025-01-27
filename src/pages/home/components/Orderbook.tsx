import Card from "@/components/ui/Card";
import useOrders from "@/hooks/useOrders";
import clsx from "clsx";
import { useEffect, useState } from "react";
import OrderTable from "./OrderTable";

interface OrderbookProps extends React.HTMLAttributes<HTMLDivElement> {}
const Orderbook: React.FC<OrderbookProps> = ({ className, ...props }) => {
  const { askOrders, bidOrders, fetchOrders } = useOrders();
  const [midPrice, setMidPrice] = useState<number | null>(null);

  useEffect(() => {
    fetchOrders("CFB");
  }, [fetchOrders]);

  useEffect(() => {
    if (askOrders.length > 0 && bidOrders.length > 0) {
      const bestAsk = askOrders[-1]?.price || 0;
      const bestBid = bidOrders[0]?.price || 0;
      setMidPrice((bestAsk + bestBid) / 2);
    } else {
      setMidPrice(null);
    }
  }, [askOrders, bidOrders]);

  return (
    <Card className={clsx("w-full", className)} {...props}>
      <div className="flex h-full flex-col justify-center">
        <OrderTable orders={askOrders} type="ask" id="" className="flex-1" />
        <div className="flex w-full justify-center">{midPrice ? midPrice.toLocaleString() : "Loading..."}</div>
        <OrderTable orders={bidOrders} type="bid" id="" className="flex-1" />
      </div>
    </Card>
  );
};

export default Orderbook;
