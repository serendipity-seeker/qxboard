import Card from "@/components/ui/Card";
import clsx from "clsx";
import type { ChartOptions, DeepPartial, IChartApi, ISeriesApi, SingleValueData, SolidColor } from "lightweight-charts";
import { createChart } from "lightweight-charts";
import { useEffect, useRef } from "react";

const CHART_OPTIONS: DeepPartial<ChartOptions> = {
  layout: {
    textColor: "#707A8A",
    attributionLogo: false,
    background: { type: "solid", color: "#151E27" } as SolidColor,
  },
  rightPriceScale: { visible: true, borderVisible: false },
  leftPriceScale: { visible: true, borderVisible: false },
  grid: {
    vertLines: {
      color: "#2B3A4A",
      style: 1,
      visible: true,
    },
    horzLines: {
      color: "#2B3A4A",
      style: 1,
      visible: true,
    },
  },
};

interface ChartProps extends React.HTMLAttributes<HTMLDivElement> {}
const Chart: React.FC<ChartProps> = ({ className, ...props }) => {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const priceSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<"Histogram"> | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;
    const chart = createChart(chartContainerRef.current, CHART_OPTIONS);
    chartRef.current = chart;
    priceSeriesRef.current = chart.addLineSeries({
      color: "#00FF00",
      lineWidth: 2,
    });
  }, []);

  return (
    <Card className={clsx("w-full", className)} {...props}>
      <div></div>
      {/* <div
        ref={chartContainerRef}
        className="border-1 h-full min-h-[250px] w-full max-w-2xl rounded-lg"
      ></div> */}
    </Card>
  );
};

export default Chart;
