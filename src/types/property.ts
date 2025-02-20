export interface Property {
    id: string;
    title: string;
    description: string;
    price: number;
    type: "buy" | "sell" | "rent";
    owner_id: string;
  }
  