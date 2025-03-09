import { QubicDefinitions } from "@qubic-lib/qubic-ts-library/dist/QubicDefinitions";
import { useState } from "react";
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
import { fetchAssetAskOrders, fetchAssetBidOrders } from "@/services/api.service";

const usePlaceOrder = () => {
  const [showProgress, setShowProgress] = useState(false);
  const { wallet, getSignedTx } = useQubicConnect();
  const [settings] = useAtom(settingsAtom);
  const [tickInfo] = useAtom(tickInfoAtom);
  const [assets] = useAtom(assetsAtom);
  const { startMonitoring } = useTxMonitor();

  const placeOrder = async (
    assetName: string,
    type: "buy" | "sell" | "rmBuy" | "rmSell",
    price: number,
    amount: number,
  ): Promise<void> => {
    if (!wallet?.publicKey) return;

    setShowProgress(true);

    const issuer = assets.find((asset) => asset.name === assetName)?.issuer;
    if (!issuer || !tickInfo) return;

    const orderPayload = createQXOrderPayload(issuer, assetName, price, amount);

    const actionType = {
      buy: QubicDefinitions.QX_ADD_BID_ORDER,
      sell: QubicDefinitions.QX_ADD_ASK_ORDER,
      rmBuy: QubicDefinitions.QX_REMOVE_BID_ORDER,
      rmSell: QubicDefinitions.QX_REMOVE_ASK_ORDER,
    }[type];

    const transaction = await createQXOrderTx(
      wallet?.publicKey,
      tickInfo?.tick + settings.tickOffset,
      orderPayload,
      actionType,
    );

    const signedTx = await getSignedTx(transaction);
    const res = await broadcastTx(signedTx.tx);

    if (res.transactionId) {
      toast.success("Transaction sent successfully");
    } else {
      toast.error("Transaction broadcast failed");
      return;
    }

    const taskId = `place-order-${assetName}-${price}-${amount}-${Date.now()}`; // Unique task ID
    const checker = async () => {
      switch (type) {
        case "buy":
          const bidOrders = await fetchAssetBidOrders(issuer, assetName);
          return bidOrders.some((order) => order.price === price && order.entityId === wallet?.publicKey);
        case "sell":
          const askOrders = await fetchAssetAskOrders(issuer, assetName);
          return askOrders.some((order) => order.price === price && order.entityId === wallet?.publicKey);
        case "rmBuy":
          const rmAskOrders = await fetchAssetAskOrders(issuer, assetName);
          return !rmAskOrders.some((order) => order.price === price && order.entityId === wallet?.publicKey);
        case "rmSell":
          const rmBidOrders = await fetchAssetBidOrders(issuer, assetName);
          return !rmBidOrders.some((order) => order.price === price && order.entityId === wallet?.publicKey);
        default:
          return false;
      }
    };

    const onSuccess = async () => {
      toast.success("Order placed successfully");
    };

    const onFailure = async () => {
      toast.error("Order placement failed");
    };

    startMonitoring(taskId, { checker, onSuccess, onFailure, targetTick: tickInfo?.tick + settings.tickOffset });
  };

  return { showProgress, setShowProgress, placeOrder };
};

export default usePlaceOrder;
