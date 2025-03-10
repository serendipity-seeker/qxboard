import { useAtom } from "jotai";
import { actionAtom } from "@/store/action";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { formatQubicAmount } from "@/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/utils";
import usePlaceOrder from "@/hooks/usePlaceOrder";

interface OrderFormProps extends React.HTMLAttributes<HTMLDivElement> {}

interface OrderFormData {
  price: number;
  quantity: number;
}

const OrderForm: React.FC<OrderFormProps> = ({ className, ...props }) => {
  const [action] = useAtom(actionAtom);
  const [orderType, setOrderType] = useState<"buy" | "sell">("buy");

  const { placeOrder } = usePlaceOrder();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<OrderFormData>({
    defaultValues: {
      price: action.curPrice || 0,
      quantity: 0,
    },
  });

  // Update form when price changes from outside
  useEffect(() => {
    if (action.curPrice) {
      setValue("price", action.curPrice);
    }
  }, [action.curPrice, setValue]);

  const watchedPrice = watch("price");
  const watchedQuantity = watch("quantity");
  const total = (watchedPrice || 0) * (watchedQuantity || 0);

  const onSubmit = async (data: OrderFormData) => {
    try {
      await placeOrder(action.curPair, orderType, data.price, data.quantity);
    } catch (error) {
      console.error("Failed to submit order:", error);
    }
  };

  return (
    <div className={cn("w-full", className)} {...props}>
      <div className="px-2 pb-0 pt-2">
        <h2 className="text-lg font-medium">Place Order</h2>
      </div>
      <div className="p-1">
        <Tabs
          defaultValue="buy"
          value={orderType}
          onValueChange={(value: string) => setOrderType(value as "buy" | "sell")}
          className="w-full"
        >
          <TabsList className="mb-2 grid w-full grid-cols-2">
            <TabsTrigger
              value="buy"
              className={cn("bg-secondary data-[state=active]:bg-success-40 data-[state=active]:text-white")}
            >
              Buy
            </TabsTrigger>
            <TabsTrigger
              value="sell"
              className={cn("bg-secondary data-[state=active]:bg-error-40 data-[state=active]:text-white")}
            >
              Sell
            </TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
            <div>
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                placeholder="200"
                step="any"
                {...register("price", {
                  required: "Price is required",
                  min: { value: 0, message: "Price must be greater than 0" },
                  valueAsNumber: true,
                })}
                className={errors.price ? "border-error-40" : ""}
              />
              {errors.price && <p className="text-sm text-error-40">{errors.price.message}</p>}
            </div>

            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                placeholder="3000"
                step="any"
                {...register("quantity", {
                  required: "Quantity is required",
                  min: { value: 0, message: "Quantity must be greater than 0" },
                  valueAsNumber: true,
                })}
                className={errors.quantity ? "border-error-40" : ""}
              />
              {errors.quantity && <p className="text-sm text-error-40">{errors.quantity.message}</p>}
            </div>

            <Separator className="my-1" />

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
