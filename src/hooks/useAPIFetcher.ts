import { useEffect } from "react";
import { useAtom } from "jotai";
import { assetsAtom } from "@/store/assets";
import { fetchAssets, fetchTrades } from "@/services/api.service";
import { tradesAtom } from "@/store/trades";

const useAPIFetcher = () => {
  const [, setAssets] = useAtom(assetsAtom);
  const [, setTrades] = useAtom(tradesAtom);

  useEffect(() => {
    const fetchData = async () => {
      const assets = await fetchAssets();
      setAssets(assets);
    };
    fetchData();
  }, []);

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
