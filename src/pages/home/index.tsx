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
    <div className="container mx-auto space-y-4 p-2">
      {/* Main content area */}
      <div className="grid h-[calc(100vh-5rem)] gap-1 sm:grid-cols-1 lg:grid-cols-[3fr_1fr]">
        {/* Left column - Chart, History, User Orders */}
        <div className="grid grid-rows-[3fr_1fr] gap-1 overflow-hidden">
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
                <TabsTrigger value="history" className="bg-secondary">
                  Asset Trades
                </TabsTrigger>
                <TabsTrigger value="userOrders" className="bg-secondary">
                  My Orders
                </TabsTrigger>
              </TabsList>
              <TabsContent
                value="history"
                className="h-[calc(100%-40px)] overflow-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-700 dark:scrollbar-track-gray-800 dark:scrollbar-thumb-gray-600"
              >
                <History className="w-full" />
              </TabsContent>
              <TabsContent
                value="userOrders"
                className="h-[calc(100%-40px)] overflow-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-700 dark:scrollbar-track-gray-800 dark:scrollbar-thumb-gray-600"
              >
                <UserOrder className="w-full" />
              </TabsContent>
            </Tabs>
          </Card>
        </div>

        {/* Right column - Orderbook, Order Form */}
        <div className="grid h-full gap-1">
          <Card className="text-xs">
            <Orderbook />
          </Card>
          <Card className="p-1">
            <OrderForm />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home;
