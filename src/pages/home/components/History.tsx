import Card from "@/components/ui/Card";
import clsx from "clsx";

interface HistoryProps extends React.HTMLAttributes<HTMLDivElement> {}
const History: React.FC<HistoryProps> = ({ className, ...props }) => {
  return (
    <Card className={clsx("w-full", className)} {...props}>
      <h1>History</h1>
    </Card>
  );
};

export default History