"use client";
import Link from "next/link";
import {auth} from "../../app/firebase";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import styles from "./accueiladmin.module.css";
import Metric from "../Metric/Metric";
import GraphMetric from "../GraphMetric/GraphMetric";
import GraphMonth from "../GraphMonth/GraphMonth";
import NavAdmin from "../NavAdmin/NavAdmin";
import {Camera, ImagePlus, Images} from "lucide-react";
import {collection, getDocs} from "firebase/firestore";
import {db} from "../../app/firebase";

export default function Accueiladmin() {
    const router = useRouter();
    const [day, setDay] = useState(false);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user?.uid !== process.env.NEXT_PUBLIC_REACT_APP_FIREBASE_USER_ID) {
                router.push("/");
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const document = await getDocs(collection(db, "users"));
                const users = [];
                document.forEach((doc) => {
                    users.push(doc.data());
                });
                setUsers(users);
            } catch (error) {
                console.error("Erreur lors de la récupération des données:", error);
            }
        };
        fetchData();
    }, []);

    return (
        <div className={styles.contain}>
            <NavAdmin/>
            <div className={styles.object}>
                <h1 className={styles.titre}>Tableau de bord</h1>
                <div className={styles.dashboard}>
                    <Link href={"/photoajout"}>
                        <div className={styles.svg}>
                            <Camera strokeWidth={1}/>
                        </div>
                        <p>Ajouter une photo</p>
                    </Link>
                    <Link href={"/categorieajout"}>
                        <div className={styles.svg}>
                            <ImagePlus strokeWidth={1}/>
                        </div>
                        <p>Ajouter une catégorie</p>
                    </Link>
                    <Link href={"/modifcate"}>
                        <div className={styles.svg}>
                            <Images strokeWidth={1}/>
                        </div>
                        <p>Modifier une catégorie</p>
                    </Link>
                </div>
                <div className={styles.graph}>
                    <h2>Statistique</h2>
                    <div className={styles.button}>
                        <button onClick={() => setDay(true)}>Par jour</button>
                        <button onClick={() => setDay(false)}>Par mois</button>
                    </div>
                    {day &&
                        <div className={styles.graphique}>
                            <GraphMetric/>
                        </div>
                    }
                    {!day &&
                        <div className={styles.graphique}>
                            <GraphMonth/>
                        </div>
                    }
                </div>
            </div>
            <div className={styles.gauche}>
                <Metric/>
                <div className={styles.userprof}>
                    <div className={styles.redirect}>
                        <h2>Users</h2>
                        <Link href="/tableau">Plus de détails</Link>
                    </div>
                    <div className={styles.users}>
                        {users.map((user, index) => (
                            <div key={index} className={styles.photoitems}>
                                <img src={user.photoURL} alt="photo de profil"/>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
