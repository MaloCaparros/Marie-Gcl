import styles from "./globals.css";
import {Montserrat} from "next/font/google";
import {Analytics} from "@vercel/analytics/react";
import AjtMetric from "../component/AjtMetric/AjtMetric";

export const metadata = {
    title: "Photographe Nantes | Marie Gcl - Spécialiste en Mariage, Couple, Famille, Grossesse, Entreprise et Anniversaire",
    description: "Explorez l'art de la photographie avec Marie Gcl, votre photographe à Nantes. Capturant l'amour et l'émotion à travers des images vibrantes. Mariage, couple, famille, grossesse, entreprise et anniversaire, chaque moment devient intemporel avec notre talentueuse photographe.",
};

const montserrat = Montserrat({
     weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    subsets: ['latin'],
});

export default function RootLayout({children}) {
    return (
        <html lang="fr" className={montserrat.className}>
        <body className={styles.body}>
        <Analytics/>
        <AjtMetric/>
        {children}
        </body>
        </html>);
}