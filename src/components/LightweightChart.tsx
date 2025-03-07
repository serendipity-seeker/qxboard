import { cn } from "@/utils";
import type { ChartOptions, DeepPartial, IChartApi, ISeriesApi, SingleValueData, SolidColor } from "lightweight-charts";
import { createChart, HistogramSeries, LineSeries } from "lightweight-charts";
import { useEffect, useRef } from "react";

type Props = Readonly<{
  priceDataSeries: SingleValueData[];
  volumeDataSeries: SingleValueData[];
  className?: string;
}>;

// Create the chart instance
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

export default function LightweightChart({ priceDataSeries, volumeDataSeries, className }: Props) {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const priceSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<"Histogram"> | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const container = chartContainerRef.current;
    const parentElement = container.parentElement;

    // Get parent dimensions
    const width = parentElement?.offsetWidth || container.offsetWidth;
    const height = parentElement?.offsetHeight || container.offsetHeight;

    const chart = createChart(container, {
      ...CHART_OPTIONS,
      width,
      height,
    });
    chartRef.current = chart;

    // Create price series
    const priceSeries = chart.addSeries(LineSeries);
    priceSeries.applyOptions({
      lineWidth: 2,
      color: "#3b82f6",
      priceFormat: { type: "price", precision: 1, minMove: 0.1 },
    });
    priceSeries.priceScale().applyOptions({
      scaleMargins: { top: 0.1, bottom: 0.4 },
    });
    priceSeries.setData(priceDataSeries);
    priceSeriesRef.current = priceSeries;

    // Create volume series
    const volumeSeries = chart.addSeries(HistogramSeries);
    volumeSeries.applyOptions({
      priceFormat: { type: "volume" },
      priceScaleId: "left",
      color: "#1e293b",
    });
    volumeSeries.priceScale().applyOptions({
      scaleMargins: { top: 0.75, bottom: 0 },
    });
    volumeSeries.setData(volumeDataSeries);
    volumeSeriesRef.current = volumeSeries;

    // Fit the content to the time scale
    chart.timeScale().fitContent();

    // Use ResizeObserver for responsiveness
    const resizeObserver = new ResizeObserver(() => {
      if (chartRef.current && parentElement) {
        const newWidth = parentElement.offsetWidth;
        const newHeight = parentElement.offsetHeight;
        chartRef.current.resize(newWidth, newHeight);
        chartRef.current.timeScale().fitContent();
      }
    });

    if (parentElement) {
      resizeObserver.observe(parentElement);
    }

    // eslint-disable-next-line consistent-return -- Cleanup
    return () => {
      chart.remove();
      chartRef.current = null;
      resizeObserver.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update price data series
  useEffect(() => {
    if (priceSeriesRef.current) {
      priceSeriesRef.current.setData(priceDataSeries);
      chartRef.current?.timeScale().fitContent();
    }
  }, [priceDataSeries]);

  // Update volume data series
  useEffect(() => {
    if (volumeSeriesRef.current) {
      volumeSeriesRef.current.setData(volumeDataSeries);
      chartRef.current?.timeScale().fitContent();
    }
  }, [volumeDataSeries]);

  return (
    <div
      ref={chartContainerRef}
      className={cn("h-full w-full", className)}
      style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
    />
  );
}
