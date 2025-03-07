import { Card, CardContent } from "@/components/ui/card";
import clsx from "clsx";
import type { ChartOptions, DeepPartial, IChartApi, ISeriesApi, SolidColor, Time } from "lightweight-charts";
import { CandlestickSeries, createChart, HistogramSeries } from "lightweight-charts";
import { useEffect, useRef, useState } from "react";

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
  timeScale: {
    borderVisible: false,
    timeVisible: true,
    secondsVisible: false,
  },
};

// Mock data for the chart
const generateMockData = () => {
  const now = new Date();
  const candleData = [];
  const volumes = [];

  let price = 100;

  for (let i = 0; i < 100; i++) {
    const time = new Date(now);
    time.setDate(now.getDate() - 100 + i);

    // Random price movement
    const change = (Math.random() - 0.5) * 5;
    price += change;
    price = Math.max(50, price); // Ensure price doesn't go too low

    const open = price;
    const high = price + Math.random() * 3;
    const low = price - Math.random() * 3;
    const close = price + (Math.random() - 0.5) * 2;

    candleData.push({
      time: (time.getTime() / 1000) as unknown as Time,
      open,
      high,
      low,
      close,
    });

    // Random volume
    volumes.push({
      time: (time.getTime() / 1000) as unknown as Time,
      value: Math.random() * 10000,
      color: close >= open ? "rgba(0, 150, 136, 0.5)" : "rgba(255, 82, 82, 0.5)",
    });
  }

  return { candleData, volumeData: volumes };
};

interface ChartProps extends React.HTMLAttributes<HTMLDivElement> {}
const Chart: React.FC<ChartProps> = ({ className, ...props }) => {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<"Histogram"> | null>(null);
  const [mockData] = useState(generateMockData());

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const handleResize = () => {
      if (chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current?.clientWidth || 600,
          height: chartContainerRef.current?.clientHeight || 400,
        });
      }
    };

    const chart = createChart(chartContainerRef.current, {
      ...CHART_OPTIONS,
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
    });

    chartRef.current = chart;

    // Add candlestick series
    candleSeriesRef.current = chart.addSeries(CandlestickSeries, {
      upColor: "#26a69a",
      downColor: "#ef5350",
      borderVisible: false,
      wickUpColor: "#26a69a",
      wickDownColor: "#ef5350",
    });

    // Add volume series
    volumeSeriesRef.current = chart.addSeries(HistogramSeries, {
      color: "#26A69A",
    });

    // Set data
    if (candleSeriesRef.current && volumeSeriesRef.current) {
      candleSeriesRef.current.setData(mockData.candleData);
      volumeSeriesRef.current.setData(mockData.volumeData);

      // Fit content
      chart.timeScale().fitContent();
    }

    // Handle resize
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [mockData]);

  return (
    <Card className={clsx("w-full", className)} {...props}>
      <CardContent ref={chartContainerRef} className="h-[500px] w-full"></CardContent>
    </Card>
  );
};

export default Chart;
