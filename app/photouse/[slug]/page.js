"use client";
import {useEffect, useState} from "react";
import {getDocs, collection, query, where, doc, getDoc} from "firebase/firestore";
import Link from "next/link";
import {auth, db} from "../../firebase";
import styles from "./../photouse.module.css";
import {useRouter} from "next/navigation";

export default function Page({params}) {
    const router = useRouter();
    const [info, setInfo] = useState([]);
    const [usersData, setUsersData] = useState([]);
    const [loading, setLoading] = useState(false);

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
                const usersDoc = await getDoc(doc(db, "users", params.slug));
                if (usersDoc.exists()) {
                    setUsersData({
                        id: usersDoc.id,
                        ...usersDoc.data(),
                    });
                } else {
                    console.log("Aucun document trouvé avec l'ID:", params.slug);
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des données:", error);
            } finally {
                setLoading(true);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (loading) {
            const fetchphoto = async () => {
                try {
                    const querySnapshot = await getDocs(
                        query(
                            collection(db, "photos"),
                            where("proprietaire", "==", usersData?.displayName)
                        )
                    );
                    const photoData = [];
                    querySnapshot.forEach((doc) => {
                        const photo = {
                            ...doc.data(),
                            id: doc.id,
                        };
                        photoData.push(photo);
                    });

                    setInfo(photoData);
                } catch (error) {
                    console.error("Erreur lors de la récupération des données:", error);
                }
            };
            fetchphoto();
        }
    }, [loading]);

    return (
        <div>
            <h1 className={styles.title}>Photo de {usersData.displayName}</h1>
            <div className={styles.carroussel}>
                {info.map((photo) => (
                    <div key={photo.id} className={styles.photo}>
                        <img src={photo.url} alt="photo utilisateur"/>
                    </div>
                ))}
            </div>
            <div className={styles.navigation}>
                <Link href="/tableau">Retour à tableau</Link>
                <Link href="/admin">Retour à admin</Link>
                <Link href="/photoajout">Ajouter une photo</Link>
            </div>
        </div>
    );
}
