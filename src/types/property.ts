export interface Property {
  id: string; // Unique property ID
  title: string; // Property title
  description: string; // Property description
  price: number; // Price in currency
  type: "rent" | "sell"; // Property type
  location: string; // Property location
  bedrooms: number; // Number of bedrooms
  bathrooms: number; // Number of bathrooms
  square_feet: number; // Property size
  status: "pending" | "approved"; // Property approval status
  owner_id: string; // ID of the property owner
  image_url?: string; // Optional image URL
  latitude?: number; // Optional latitude for map
  longitude?: number; 
  address:string;// Optional longitude for map
  nearby:string
}


  export enum Role {
    Buyer = "buyer",
    Agent = "agent",
    Seller = "seller",
  }
  