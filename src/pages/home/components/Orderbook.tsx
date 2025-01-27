import Card from "@/components/ui/Card";
import clsx from "clsx";

interface OrderbookProps extends React.HTMLAttributes<HTMLDivElement> {}
const Orderbook: React.FC<OrderbookProps> = ({ className, ...props }) => {
  return (
    <Card className={clsx("w-full", className)} {...props}>
      <h1>Orderbook</h1>
    </Card>
  );
};

export default Orderbook;
