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

export type { Order, OwnedAsset };
