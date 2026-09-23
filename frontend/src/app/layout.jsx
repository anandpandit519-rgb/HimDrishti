import "./../styles/globals.css";
import "./../styles/map.css";

export const metadata = {
  title: "HimDrishti",
  description: "Landslide Early Warning & Risk Monitoring System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}