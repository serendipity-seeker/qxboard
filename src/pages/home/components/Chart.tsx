import LightweightChart from "@/components/LightweightChart";
import { Card } from "@/components/ui/card";
import { fetchAssetChartAveragePrice } from "@/services/api.service";
import { actionAtom } from "@/store/action";
import { assetsAtom } from "@/store/assets";
import { cn } from "@/utils";
import { useAtom } from "jotai";
import type { SingleValueData } from "lightweight-charts";
import { useEffect, useState } from "react";

interface ChartProps extends React.HTMLAttributes<HTMLDivElement> {}
const Chart: React.FC<ChartProps> = ({ className, ...props }) => {
  const [priceData, setPriceData] = useState<SingleValueData[]>([]);
  const [volumeData, setVolumeData] = useState<SingleValueData[]>([]);
  const [action] = useAtom(actionAtom);
  const [assets] = useAtom(assetsAtom);

  const asset = assets.find((asset) => asset.name === action.curPair);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetchAssetChartAveragePrice(
        asset?.issuer || "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFXIB",
        asset?.name || "QX",
      );
      const avgPriceData: SingleValueData[] = res?.map((v) => ({ value: v.averagePrice, time: v.time })) ?? [];

      const histogramVolumeData: SingleValueData[] = res?.map((v) => ({ value: v.totalAmount, time: v.time })) ?? [];

      setPriceData(avgPriceData);
      setVolumeData(histogramVolumeData);
    };

    fetchData();
  }, [action]);

  return (
    <Card className={cn("w-full", className)} {...props}>
      <LightweightChart priceDataSeries={priceData} volumeDataSeries={volumeData} className="w-[100vw]" />
    </Card>
  );
};

export default Chart;
