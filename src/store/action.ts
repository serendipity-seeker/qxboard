import { atom } from "jotai";

interface Action {
  curPair: string;
  curPrice: number;
  curQty: number;
  curPairBestAskPrice: number;
  curPairBestBidPrice: number;
  curPairLatestTradePrice: number;
  action: "buy" | "sell" | "rmBuy" | "rmSell";
}

export const actionAtom = atom<Action>({
  curPair: "QX",
} as Action);
