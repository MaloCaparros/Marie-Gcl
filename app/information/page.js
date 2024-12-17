'use client';
import {useEffect, useState} from "react";
import {doc, getDoc} from "firebase/firestore";
import {db} from "../firebase";
import Link from "next/link";
import styles from "./information.module.css";
import {LogOut} from "lucide-react";

export default function Page() {
    const [info, setInfo] = useState({
        name: "",
        photographe: "",
        description: "",
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const querySnapshot = await getDoc(doc(db, "information", "info"));
                if (querySnapshot.exists()) {
                    setInfo(querySnapshot.data());
                }


            } catch (error) {
                console.error("Erreur lors de la récupération des données:", error);
            }
        };

        fetchData();
    }, []);
    console.log(info);
    return (
        <div className={styles.contain}>
            <div className={styles.main}>
                <div className={styles.contenu}>
                    <h1>{info.name}</h1>
                    <h2>Connu sous le nom de <strong>{info.photographe}</strong></h2>
                    <p>{info.description}</p>
                    <Link href={"/contact"}>Contactez-moi</Link>
                </div>
                <img src={"/Design.png"} alt={"photo photographe"}/>
            </div>
            <div className={styles.navigation}>
                <Link href={"/"}><LogOut />Retour à l&apos;accueil</Link>
            </div>
        </div>
    );
}
