import { QubicDefinitions } from "@qubic-lib/qubic-ts-library/dist/QubicDefinitions";
import { useCallback, useState } from "react";
import { useAtom } from "jotai";
import { settingsAtom } from "@/store/settings";
import { useQubicConnect } from "@/components/connect/QubicConnectContext";
import { createQXOrderTx } from "@/services/qx.service";
import { createQXOrderPayload } from "@/services/qx.service";
import { broadcastTx } from "@/services/rpc.service";
import { tickInfoAtom } from "@/store/tickInfo";
import { assetsAtom } from "@/store/assets";
import toast from "react-hot-toast";
import { useTxMonitor } from "@/store/txMonitor";

const usePlaceOrder = () => {
  const [orderTick, setOrderTick] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
  const { wallet, getSignedTx } = useQubicConnect();
  const [settings] = useAtom(settingsAtom);
  const [tickInfo] = useAtom(tickInfoAtom);
  const [assets] = useAtom(assetsAtom);
  const { startMonitoring } = useTxMonitor();

  const placeOrder = useCallback(
    async (
      assetName: string,
      type: "buy" | "sell" | "rmBuy" | "rmSell",
      price: number,
      amount: number,
    ): Promise<void> => {
      if (!wallet?.publicKey) return;

      const latestTick = tickInfo.tick;
      setOrderTick(latestTick + settings.tickOffset);
      setShowProgress(true);

      const issuer = assets.find((asset) => asset.name === assetName)?.issuer;
      if (!issuer) return;

      const orderPayload = createQXOrderPayload(issuer, assetName, price, amount);

      const actionType = {
        buy: QubicDefinitions.QX_ADD_BID_ORDER,
        sell: QubicDefinitions.QX_ADD_ASK_ORDER,
        rmBuy: QubicDefinitions.QX_REMOVE_BID_ORDER,
        rmSell: QubicDefinitions.QX_REMOVE_ASK_ORDER,
      }[type];

      const transaction = await createQXOrderTx(
        wallet?.publicKey,
        latestTick + settings.tickOffset,
        orderPayload,
        actionType,
      );

      const signedTx = await getSignedTx(transaction);
      const res = await broadcastTx(signedTx.tx);

      const taskId = `place-order-${assetName}-${price}-${amount}-${Date.now()}`; // Unique task ID
      const checker = async () => {
        // TODO: Check if order is placed
        return true;
      };

      const onSuccess = async () => {
        toast.success("Order placed successfully");
      };

      const onFailure = async () => {
        toast.error("Order placement failed");
      };

      startMonitoring(taskId, { checker, onSuccess, onFailure, targetTick: orderTick });
    },
    [setOrderTick, setShowProgress, createQXOrderPayload, broadcastTx],
  );

  return { orderTick, showProgress, setShowProgress, placeOrder };
};

export default usePlaceOrder;
