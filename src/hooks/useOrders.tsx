import { useState, useCallback } from "react";
import { Order } from "@/types";
import { fetchAssetOrders } from "@/services/rpc.service";
import { ISSUER } from "@/constants";

const useOrders = () => {
  const [askOrders, setAskOrders] = useState<Order[]>([]);
  const [bidOrders, setBidOrders] = useState<Order[]>([]);

  const fetchOrders = useCallback(
    async (assetName: string): Promise<void> => {
      try {
        const [askData, bidData] = await Promise.all([
          fetchAssetOrders(assetName, ISSUER.get(assetName) || "", "Ask", 0),
          fetchAssetOrders(assetName, ISSUER.get(assetName) || "", "Bid", 0),
        ]);

        setAskOrders(askData.orders || []);
        setBidOrders(bidData.orders || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    },
    [fetchAssetOrders],
  );

  return {
    askOrders,
    bidOrders,
    fetchOrders,
  };
};

export default useOrders;
