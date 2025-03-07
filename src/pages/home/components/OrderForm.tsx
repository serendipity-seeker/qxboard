import { useAtom } from "jotai";
import { actionAtom } from "@/store/action";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { formatQubicAmount } from "@/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/utils";

interface OrderFormProps extends React.HTMLAttributes<HTMLDivElement> {}

interface OrderFormData {
  price: number;
  quantity: number;
}

const OrderForm: React.FC<OrderFormProps> = ({ className, ...props }) => {
  const [action] = useAtom(actionAtom);
  const [orderType, setOrderType] = useState<"buy" | "sell">("buy");
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<OrderFormData>();

  const price = watch("price");
  const quantity = watch("quantity");
  const total = (price || 0) * (quantity || 0);

  const onSubmit = async (data: OrderFormData) => {
    try {
      console.log("Submitting order:", {
        type: orderType,
        price: data.price,
        quantity: data.quantity,
        pair: action.curPair,
      });
      reset();
    } catch (error) {
      console.error("Failed to submit order:", error);
    }
  };

  return (
    <div className={cn("w-full overflow-hidden", className)} {...props}>
      <div className="px-4 pb-0 pt-4">
        <h2 className="text-lg font-medium">Place Order</h2>
      </div>
      <div className="p-4">
        <Tabs
          defaultValue="buy"
          value={orderType}
          onValueChange={(value: string) => setOrderType(value as "buy" | "sell")}
          className="w-full"
        >
          <TabsList className="mb-4 grid w-full grid-cols-2">
            <TabsTrigger value="buy" className={cn("bg-secondary data-[state=active]:bg-success-40 data-[state=active]:text-white")}>
              Buy
            </TabsTrigger>
            <TabsTrigger value="sell" className={cn("bg-secondary data-[state=active]:bg-error-40 data-[state=active]:text-white")}>
              Sell
            </TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                placeholder="200"
                step="any"
                {...register("price", { required: true, min: 0 })}
                className={errors.price ? "border-error-40" : ""}
              />
              {errors.price && <p className="text-sm text-error-40">Price is required</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                placeholder="3000"
                step="any"
                {...register("quantity", { required: true, min: 0 })}
                className={errors.quantity ? "border-error-40" : ""}
              />
              {errors.quantity && <p className="text-sm text-error-40">Quantity is required</p>}
            </div>

            <Separator className="my-2" />

            <div className="flex items-center justify-between rounded-lg bg-muted p-3 text-sm">
              <span className="text-muted-foreground">Total</span>
              <span className="font-medium">{formatQubicAmount(total)}</span>
            </div>

            <Button
              type="submit"
              className={cn(
                "mt-2 w-full",
                orderType === "buy"
                  ? "bg-success-40 text-white hover:bg-success-40/90"
                  : "bg-error-40 text-white hover:bg-error-40/90",
              )}
            >
              {orderType === "buy" ? "Buy" : "Sell"} {action.curPair || "QCAP"}
            </Button>
          </form>
        </Tabs>
      </div>
    </div>
  );
};

export default OrderForm;
