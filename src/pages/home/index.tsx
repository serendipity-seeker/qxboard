import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import OrderForm from "./components/OrderForm";
import Orderbook from "./components/Orderbook";
import Chart from "./components/Chart";
import History from "./components/History";
import UserOrder from "./components/UserOrder";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Home: React.FC = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [chartDimensions, setChartDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateChartDimensions = () => {
      if (chartContainerRef.current) {
        const { clientWidth, clientHeight } = chartContainerRef.current;
        setChartDimensions({
          width: clientWidth,
          height: clientHeight,
        });
      }
    };

    // Initial size calculation
    updateChartDimensions();

    // Update on resize
    const resizeObserver = new ResizeObserver(updateChartDimensions);
    if (chartContainerRef.current) {
      resizeObserver.observe(chartContainerRef.current);
    }

    // Also handle window resize events
    window.addEventListener("resize", updateChartDimensions);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateChartDimensions);
    };
  }, []);

  return (
    <div className="container mx-auto h-full space-y-4 overflow-hidden p-2">
      {/* Main content area */}
      <div className="grid h-[calc(100vh-10rem)] gap-1 overflow-hidden sm:grid-cols-1 lg:grid-cols-[3fr_1fr]">
        {/* Left column - Chart, History, User Orders */}
        <div className="grid h-full grid-rows-[3fr_1fr] gap-1 overflow-hidden">
          <Card className="relative overflow-hidden p-2" ref={chartContainerRef}>
            {chartDimensions.width > 0 && chartDimensions.height > 0 && (
              <Chart
                className="absolute inset-0 p-2"
                style={{
                  width: chartDimensions.width,
                  height: chartDimensions.height,
                }}
              />
            )}
          </Card>
          <Card className="overflow-auto p-2 text-xs">
            <Tabs defaultValue="history" className="h-full w-full">
              <TabsList className="mb-2 grid w-full grid-cols-2">
                <TabsTrigger value="history">Market Trades</TabsTrigger>
                <TabsTrigger value="userOrders">My Orders</TabsTrigger>
              </TabsList>
              <TabsContent
                value="history"
                className="scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800 h-[calc(100%-40px)] overflow-auto"
              >
                <History className="w-full" />
              </TabsContent>
              <TabsContent
                value="userOrders"
                className="scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800 h-[calc(100%-40px)] overflow-auto"
              >
                <UserOrder className="w-full" />
              </TabsContent>
            </Tabs>
          </Card>
        </div>

        {/* Right column - Orderbook, Order Form */}
        <div className="grid h-full grid-rows-[3fr_1fr] gap-1 overflow-hidden">
          <Card className="scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800 overflow-auto p-2 text-xs">
            <Orderbook className="w-full" />
          </Card>
          <Card className="p-1">
            <OrderForm className="w-full" />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home;
