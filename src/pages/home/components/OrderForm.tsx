import { Card } from "@/components/ui/card";
import clsx from "clsx";
import { useAtom } from "jotai";
import { actionAtom } from "@/store/action";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { formatQubicAmount } from "@/utils";

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
    <Card className={clsx("w-full", className)} {...props}>
      <div className="flex flex-col gap-4 p-4">
        <div className="flex gap-2">
          <Button
            className={clsx("flex-1", orderType === "buy" ? "!bg-success-40 hover:!bg-success-40/80" : "")}
            onClick={() => setOrderType("buy")}
          />
          Buy
          <Button
            className={clsx("flex-1", orderType === "sell" ? "!bg-error-40 hover:!bg-error-40/80" : "")}
            onClick={() => setOrderType("sell")}
          >
            Sell
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="relative">
            <input
              type="number"
              placeholder="Price"
              step="any"
              {...register("price", { required: true, min: 0 })}
              className="border-card-border focus:ring-primary-40 w-full rounded-lg border bg-card p-3 focus:outline-none focus:ring-2"
            />
            {errors.price && <span className="absolute -bottom-5 left-0 text-sm text-error-40">Price is required</span>}
          </div>

          <div className="relative">
            <input
              type="number"
              placeholder="Quantity"
              step="any"
              {...register("quantity", { required: true, min: 0 })}
              className="border-card-border focus:ring-primary-40 w-full rounded-lg border bg-card p-3 focus:outline-none focus:ring-2"
            />
            {errors.quantity && (
              <span className="absolute -bottom-5 left-0 text-sm text-error-40">Quantity is required</span>
            )}
          </div>

          <div className="flex justify-between rounded-lg bg-card p-3 text-sm">
            <span className="text-gray-500">Total</span>
            <span className="font-medium">{formatQubicAmount(total)}</span>
          </div>

          <Button
            type="submit"
            className={clsx(
              "w-full",
              orderType === "buy" ? "!bg-success-50 hover:!bg-success-50/80" : "!bg-error-50 hover:!bg-error-50/80",
            )}
          >
            {orderType === "buy" ? "Buy" : "Sell"}
          </Button>
        </form>
      </div>
    </Card>
  );
};

export default OrderForm;
