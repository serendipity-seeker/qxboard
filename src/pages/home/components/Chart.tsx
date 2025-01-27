import Card from "@/components/ui/Card";
import clsx from "clsx";

interface ChartProps extends React.HTMLAttributes<HTMLDivElement> {}
const Chart: React.FC<ChartProps> = ({ className, ...props }) => {
  return (
    <Card className={clsx("w-full", className)} {...props}>
      <h1>Chart</h1>
    </Card>
  );
};

export default Chart;
