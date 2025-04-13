import { useEffect } from "react";
import { useAtom } from "jotai";
import { assetsAtom } from "@/store/assets";
import { fetchAssets, fetchTrades } from "@/services/api.service";
import { tradesAtom } from "@/store/trades";
import { fetchOwnedAssets } from "@/services/rpc.service";
import { useQubicConnect } from "@/components/connect/QubicConnectContext";
import { refetchAtom } from "@/store/action";

const useAPIFetcher = () => {
  const { wallet } = useQubicConnect();
  const [, setAssets] = useAtom(assetsAtom);
  const [, setTrades] = useAtom(tradesAtom);
  const [refetch] = useAtom(refetchAtom);

  useEffect(() => {
    const fetchData = async () => {
      const assets = await fetchAssets();
      const balance = await fetchOwnedAssets(
        wallet?.publicKey || "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFXIB",
      );
      setAssets(
        assets.map((asset) => ({
          ...asset,
          balance: balance.map((data: { asset: string; amount: string; issuerId: string; unitOfMeasurement: any }) =>
            data.asset === asset.name ? Number(data.amount) : 0,
          ),
        })),
      );
    };
    fetchData();
  }, [wallet?.publicKey, refetch]);

  // Fetch trades
  useEffect(() => {
    const fetchData = async () => {
      const trades = await fetchTrades();

      setTrades(trades);
    };
    fetchData();
  }, []);
};

export default useAPIFetcher;
