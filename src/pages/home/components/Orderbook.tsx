import { useEffect, useState } from "react";
import OrderTable from "./OrderTable";
import { actionAtom } from "@/store/action";
import { useAtom } from "jotai";
import { cn } from "@/utils";
import { EntityOrder } from "@/types";
import { fetchAssetOrders } from "@/services/rpc.service";
import { ISSUER } from "@/constants";

interface OrderbookProps extends React.HTMLAttributes<HTMLDivElement> {}
const Orderbook: React.FC<OrderbookProps> = ({ className, ...props }) => {
  const [askOrders, setAskOrders] = useState<EntityOrder[]>([]);
  const [bidOrders, setBidOrders] = useState<EntityOrder[]>([]);
  const [midPrice, setMidPrice] = useState<number | null>(null);
  const [action] = useAtom(actionAtom);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const [askData, bidData] = await Promise.all([
          fetchAssetOrders(action.curPair || "QCAP", ISSUER.get(action.curPair || "QCAP") || "", "Ask", 0),
          fetchAssetOrders(action.curPair || "QCAP", ISSUER.get(action.curPair || "QCAP") || "", "Bid", 0),
        ]);
        setAskOrders(askData.orders || []);
        setBidOrders(bidData.orders || []);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };

    fetchOrders();
  }, [action]);

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
    <div className={cn("flex h-full w-full flex-col justify-center", className)} {...props}>
      <OrderTable orders={askOrders} type="ask" id="" className="flex-1" />
      <div className="flex w-full justify-center">
        {midPrice ? Math.floor(midPrice).toLocaleString() : "Loading..."}
      </div>
      <OrderTable orders={bidOrders} type="bid" id="" className="flex-1" />
    </div>
  );
};

export default Orderbook;
