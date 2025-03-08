import { useEffect, useState, useMemo } from "react";
import OrderTable from "./OrderTable";
import { actionAtom } from "@/store/action";
import { useAtom } from "jotai";
import { cn } from "@/utils";
import { EntityOrder } from "@/types";
import { fetchAssetOrders } from "@/services/rpc.service";
import { Button } from "@/components/ui/button";
import { Settings2 } from "lucide-react";
import OrderbookSettingsModal from "./OrderbookSettingsModal";
import { orderbookSettingsAtom } from "@/store/orderbook";
import { assetsAtom } from "@/store/assets";
import { useDisclosure } from "@/hooks/useDisclosure";

interface OrderbookProps extends React.HTMLAttributes<HTMLDivElement> {}
const Orderbook: React.FC<OrderbookProps> = ({ className, ...props }) => {
  const [askOrders, setAskOrders] = useState<EntityOrder[]>([]);
  const [bidOrders, setBidOrders] = useState<EntityOrder[]>([]);
  const [midPrice, setMidPrice] = useState<number | null>(null);
  const [action] = useAtom(actionAtom);
  const [settings, setSettings] = useAtom(orderbookSettingsAtom);
  const [, setAction] = useAtom(actionAtom);
  const [assets] = useAtom(assetsAtom);
  const { open, onOpen, onClose } = useDisclosure();

  // Calculate market dominance
  const askVolume = useMemo(
    () => askOrders.reduce((acc, order) => acc + order.price * order.numberOfShares, 0),
    [askOrders],
  );

  const bidVolume = useMemo(
    () => bidOrders.reduce((acc, order) => acc + order.price * order.numberOfShares, 0),
    [bidOrders],
  );

  const totalVolume = askVolume + bidVolume;
  const bidDominance = totalVolume > 0 ? (bidVolume / totalVolume) * 100 : 50;

  // Apply price grouping based on settings
  const getGroupingFactor = (groupingSize: number) => {
    switch (groupingSize) {
      case 1:
        return 0.1;
      case 2:
        return 0.5;
      case 3:
        return 1;
      case 4:
        return 5;
      case 5:
        return 10;
      default:
        return 0;
    }
  };

  const groupOrders = (orders: EntityOrder[], type: "ask" | "bid"): EntityOrder[] => {
    const groupingFactor = getGroupingFactor(settings.groupingSize);
    if (groupingFactor === 0) return orders;

    const groupedMap = new Map<number, EntityOrder>();

    orders.forEach((order) => {
      // Round price to the nearest grouping factor
      const groupedPrice = Math.round(order.price / groupingFactor) * groupingFactor;

      if (groupedMap.has(groupedPrice)) {
        const existingOrder = groupedMap.get(groupedPrice)!;
        existingOrder.numberOfShares += order.numberOfShares;
      } else {
        groupedMap.set(groupedPrice, { ...order, price: groupedPrice });
      }
    });

    const result = Array.from(groupedMap.values());

    // Sort based on order type
    return result.sort((a, b) => (type === "ask" ? a.price - b.price : b.price - a.price));
  };

  const groupedAskOrders = useMemo(() => groupOrders(askOrders, "ask"), [askOrders, settings.groupingSize]);

  const groupedBidOrders = useMemo(() => groupOrders(bidOrders, "bid"), [bidOrders, settings.groupingSize]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const issuer = assets?.find((asset) => asset.name === action.curPair)?.issuer;
        const [askData, bidData] = await Promise.all([
          fetchAssetOrders(
            action.curPair || "QX",
            issuer || "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFXIB",
            "Ask",
            0,
          ),
          fetchAssetOrders(
            action.curPair || "QX",
            issuer || "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFXIB",
            "Bid",
            0,
          ),
        ]);
        setAskOrders(askData.orders || []);
        setBidOrders(bidData.orders || []);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };

    fetchOrders();

    // Set up polling for real-time updates
    const intervalId = setInterval(fetchOrders, 5000);
    return () => clearInterval(intervalId);
  }, [action]);

  useEffect(() => {
    if (askOrders.length > 0 && bidOrders.length > 0) {
      // Fix the index for best ask price
      const bestAsk = askOrders.length > 0 ? askOrders[0]?.price || 0 : 0;
      const bestBid = bidOrders.length > 0 ? bidOrders[0]?.price || 0 : 0;

      if (bestAsk && bestBid) {
        setMidPrice((bestAsk + bestBid) / 2);
      }
    } else {
      setMidPrice(null);
    }
  }, [askOrders, bidOrders]);

  const handleSelectPrice = (price: number) => {
    setAction({ ...action, curPrice: price });
  };

  return (
    <div className={cn("relative flex h-full w-full flex-col", className)} {...props}>
      <div className="flex items-center justify-between p-2 px-2">
        <h3 className="text-sm font-medium">Orderbook</h3>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onOpen}>
          <Settings2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Fixed header for ask table */}
      <div className="flex w-full border-b px-2 py-1 font-medium">
        <div className="flex-1 text-center">Price</div>
        <div className="flex-1 text-center">Quantity</div>
        <div className="flex-1 text-center">Total</div>
      </div>

      {/* Main content with flex layout */}
      <div className="flex h-full w-full flex-col">
        {/* Ask orders - always visible */}
        <div className="flex-1 overflow-y-auto">
          <OrderTable
            orders={groupedAskOrders}
            type="ask"
            id="ask-table"
            className="h-full"
            onSelectPrice={handleSelectPrice}
            maxItems={settings.maxItems}
            showCumulativeVolume={settings.showCumulativeVolume}
            showHeader={false}
          />
        </div>

        {/* Middle price section - fixed position */}
        <div className="flex w-full items-center justify-between border-y bg-background/50 px-4 py-2">
          <div className="text-xs text-muted-foreground">Last Price</div>
          <div className="text-sm font-semibold">{midPrice ? midPrice.toLocaleString() : "Loading..."}</div>
        </div>

        {/* Bid orders - always visible */}
        <div className="flex-1 overflow-y-auto">
          <OrderTable
            orders={groupedBidOrders}
            type="bid"
            id="bid-table"
            className="h-full"
            onSelectPrice={handleSelectPrice}
            maxItems={settings.maxItems}
            showCumulativeVolume={settings.showCumulativeVolume}
            showHeader={false}
          />
        </div>
      </div>

      {/* Market dominance indicator - fixed at bottom */}
      <div className="mt-2 px-2">
        <div className="mb-1 flex justify-between text-xs">
          <span className="text-green-500">Buy {bidDominance.toFixed(1)}%</span>
          <span className="text-red-500">Sell {(100 - bidDominance).toFixed(1)}%</span>
        </div>
        <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
          <div className="h-full bg-green-500" style={{ width: `${bidDominance}%` }} />
          <div className="h-full bg-red-500" style={{ width: `${100 - bidDominance}%` }} />
        </div>
      </div>

      <OrderbookSettingsModal open={open} onOpenChange={onClose} settings={settings} onSettingsChange={setSettings} />
    </div>
  );
};

export default Orderbook;
