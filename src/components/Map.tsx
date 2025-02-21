import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

export default function Map({ latitude, longitude }) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  if (!isLoaded) return <p>Loading Map...</p>;

  return (
    <GoogleMap zoom={15} center={{ lat: latitude, lng: longitude }} mapContainerClassName="w-full h-64">
      <Marker position={{ lat: latitude, lng: longitude }} />
    </GoogleMap>
  );
}
