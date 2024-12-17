'use client';
import React, {useState, useEffect} from "react";
import {auth, db} from "../../app/firebase";
import {getDocs, collection} from "firebase/firestore";
import Link from "next/link";
import styles from "./tab.module.css";
import {useRouter} from "next/navigation";
import NavAdmin from "../NavAdmin/NavAdmin";

export default function Info() {
    const router = useRouter();
    const [usersData, setUsersData] = useState([]);

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
                const usersSnapshot = await getDocs(collection(db, "users"));
                const usersData = usersSnapshot.docs.map(doc => ({
                    ...doc.data(),
                    id: doc.id
                }));
                const photosSnapshot = await getDocs(collection(db, "photos"));
                const photosData = photosSnapshot.docs.map(doc => ({
                    ...doc.data(),
                    id: doc.id
                }));
                const usersWithPhotosCount = usersData.map(user => {
                    const userPhotos = photosData.filter(photo => photo.proprietaire === user.displayName);
                    return {
                        ...user,
                        photosCount: userPhotos.length
                    };
                });
                setUsersData(usersWithPhotosCount);
            } catch (error) {
                console.error("Erreur lors de la récupération des données:", error);
            }
        };

        fetchData();
    }, []);

    function formatTimestamp(timestamp) {
        const date = new Date(
            timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000
        );
        return date.toLocaleString();
    }

    return (
        <div className={styles.contain}>
            <NavAdmin/>
            <div className={styles.content}>
                <h1>Tableau des utilisateurs</h1>
                <table className={styles.tableau}>
                    <thead className={styles.tabhead}>
                    <tr>
                        <th className={styles.ligne}>Nom d&apos;utilisateur</th>
                        <th className={styles.ligne}>Email</th>
                        <th className={styles.ligne}>Date de création</th>
                        <th className={styles.ligne}>Dernière connexion</th>
                        <th className={styles.ligne}>Nombre de photos</th>
                        <th className={styles.ligne}>Photos</th>
                    </tr>
                    </thead>
                    <tbody>
                    {usersData.map(user => (
                        <tr key={user.id}>
                            <td className={styles.items}>{user.displayName}</td>
                            <td className={styles.items}>{user.email}</td>
                            <td className={styles.items}>
                                {formatTimestamp(user.creation_at)}
                            </td>
                            <td className={styles.items}>
                                {formatTimestamp(user.last_connexion)}
                            </td>
                            <td className={styles.items}>{user.photosCount}</td>
                            <td className={styles.items}>

                                <div onClick={() => router.push(`/photouse/${user.id}`)} className={styles.button}>Voir
                                    les
                                    photos
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <div className={styles.navigation}>
                    <Link href={"/admin"}>
                        <p>Retour à admin</p>
                    </Link>
                </div>
            </div>
        </div>
    );
}
