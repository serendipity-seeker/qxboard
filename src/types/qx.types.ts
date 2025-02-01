interface Order {
  entityId: string;
  price: number;
  numberOfShares: number;
}

interface OwnedAsset {
  data: {
    issuedAsset: {
      name: string;
    };
    numberOfUnits: number;
  };
}

interface IFees {
  assetIssuanceFee: number;
  transferFee: number;
  tradeFee: number;
}

export type { Order, OwnedAsset, IFees };
