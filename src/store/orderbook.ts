import { atom } from 'jotai';

export interface OrderbookSettings {
  showCumulativeVolume: boolean;
  maxItems: number;
  groupingSize: number;
}

export const orderbookSettingsAtom = atom<OrderbookSettings>({
  showCumulativeVolume: false,
  maxItems: 15,
  groupingSize: 0,
});

export const currentPriceAtom = atom<number | null>(null); 