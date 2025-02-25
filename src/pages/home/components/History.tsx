import { Card } from "@/components/ui/card";
import clsx from "clsx";

interface HistoryProps extends React.HTMLAttributes<HTMLDivElement> {}
const History: React.FC<HistoryProps> = ({ className, ...props }) => {
  return (
    <Card className={clsx("w-full", className)} {...props}>
      <div>History</div>
    </Card>
  );
};

export default History;
