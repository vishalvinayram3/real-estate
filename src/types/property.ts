export interface Property {
    image_url: any;
    id: string;
    title: string;
    description: string;
    price: number;
    type: "buy" | "sell" | "rent";
    owner_id: string;
  }
  

  export enum Role {
    Buyer = "buyer",
    Agent = "agent",
    Seller = "seller",
  }
  