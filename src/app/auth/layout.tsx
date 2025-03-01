import Navbar from "../../components/Navbar";
import './globals.css';
export const metadata = {
  title: "BrokersKart - Buy, Sell, Rent Properties",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="container mx-auto p-4">{children}</main>
      </body>
    </html>
  );
}
