import Card from "@/components/ui/Card";
import clsx from "clsx";

interface OrderFormProps extends React.HTMLAttributes<HTMLDivElement> {}
const OrderForm: React.FC<OrderFormProps> = ({ className, ...props }) => {
  return (
    <Card className={clsx("w-full", className)} {...props}>
      <div>OrderForm</div>
    </Card>
  );
};

export default OrderForm;
