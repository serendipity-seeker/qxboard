import { atom } from "jotai";

interface Action {
  curPair: string;
  curPrice: number;
  curQty: number;
  action: "buy" | "sell" | "rmBuy" | "rmSell";
}

export const actionAtom = atom<Action>({} as Action);
