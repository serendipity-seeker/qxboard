import { useEffect } from "react";
import { useAtom } from "jotai";
import { assetsAtom } from "@/store/assets";
import { fetchAssets } from "@/services/api.service";

const useAPIFetcher = () => {
  const [, setAssets] = useAtom(assetsAtom);

  useEffect(() => {
    const fetchData = async () => {
      const assets = await fetchAssets();
      setAssets(assets);
    };
    fetchData();
  }, []);
};

export default useAPIFetcher;
