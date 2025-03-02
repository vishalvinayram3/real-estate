import './globals.css';
export const metadata = {
  title: "No Clone - Buy, Sell, Rent Properties",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
       {children}
      </body>
    </html>
  );
}
