import { Card, CardContent } from "@/components/ui/card";
import { fetchAssetTrades } from "@/services/api.service";
import { actionAtom } from "@/store/action";
import { assetsAtom } from "@/store/assets";
import { Trade } from "@/types";
import clsx from "clsx";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";

interface HistoryProps extends React.HTMLAttributes<HTMLDivElement> {}

const History: React.FC<HistoryProps> = ({ className, ...props }) => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [action] = useAtom(actionAtom);
  const [assets] = useAtom(assetsAtom);

  useEffect(() => {
    const loadTrades = async () => {
      setLoading(true);
      try {
        const asset = assets.find((asset) => asset.name === action.curPair);

        const data = await fetchAssetTrades(
          asset?.issuer || "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFXIB",
          asset?.name || "QX",
        );

        setTrades(data);
      } catch (error) {
        console.error("Failed to fetch trades:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTrades();
  }, [action.curPair]);

  return (
    <Card className={clsx("w-full", className)} {...props}>
      <CardContent className="max-h-[400px] overflow-y-auto text-xs">
        <h3 className="mb-4 text-lg font-semibold">Recent Trades</h3>
        {loading ? (
          <div className="flex justify-center py-4">Loading...</div>
        ) : trades.length === 0 ? (
          <div className="py-4 text-center text-gray-500">No recent trades</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-gray-500">
                  <th className="px-2 py-2 text-left">Price</th>
                  <th className="px-2 py-2 text-left">Amount</th>
                  <th className="px-2 py-2 text-left">Time</th>
                </tr>
              </thead>
              <tbody>
                {trades.map((trade, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className={clsx("px-2 py-2", trade.bid ? "text-green-500" : "text-red-500")}>
                      {trade.price.toLocaleString()}
                    </td>
                    <td className="px-2 py-2">{trade.price.toLocaleString()}</td>
                    <td className="px-2 py-2">{new Date(trade.tickTime).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default History;
