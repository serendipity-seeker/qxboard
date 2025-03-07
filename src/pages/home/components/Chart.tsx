import LightweightChart from "@/components/LightweightChart";
import { Card } from "@/components/ui/card";
import { fetchAssetChartAveragePrice } from "@/services/api.service";
import clsx from "clsx";
import type { SingleValueData } from "lightweight-charts";
import { useEffect, useState } from "react";

interface ChartProps extends React.HTMLAttributes<HTMLDivElement> {}
const Chart: React.FC<ChartProps> = ({ className, ...props }) => {
  const [priceData, setPriceData] = useState<SingleValueData[]>([]);
  const [volumeData, setVolumeData] = useState<SingleValueData[]>([]);

  const fetchData = async () => {
    const res = await fetchAssetChartAveragePrice("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFXIB", "QX");
    const avgPriceData: SingleValueData[] = res?.map((v) => ({ value: v.averagePrice, time: v.time })) ?? [];

    const histogramVolumeData: SingleValueData[] = res?.map((v) => ({ value: v.totalAmount, time: v.time })) ?? [];

    setPriceData(avgPriceData);
    setVolumeData(histogramVolumeData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Card className={clsx("w-full", className)} {...props}>
      <LightweightChart priceDataSeries={priceData} volumeDataSeries={volumeData} className="w-[100vw]" />
    </Card>
  );
};

export default Chart;
