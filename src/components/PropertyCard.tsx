import Image from "next/image";
import { Property } from "../types/property";

interface Props {
  property: Property;
}

export default function PropertyCard({ property }: Props) {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform hover:scale-105">
      {property.image_url ? (
        <Image src={property.image_url} width={400} height={250} alt={property.title} className="w-full h-56 object-cover" />
      ) : (
        <Image src="/property-placeholder.jpg" width={400} height={250} alt="No Image" className="w-full h-56 object-cover" />
      )}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{property.title}</h3>
        <p className="text-gray-600 text-sm">{property.description}</p>
        <p className="text-blue-600 font-bold mt-2 text-lg">{property.price} USD</p>
        <p className="text-sm text-gray-500">{property.type.toUpperCase()}</p>
        <button className="mt-3 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">View Details</button>
      </div>
    </div>
  );
}
