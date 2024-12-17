"use client";
import {useEffect, useState} from "react";
import {getDocs, collection, query, where, doc, getDoc} from "firebase/firestore";
import Link from "next/link";
import {db} from "../../app/firebase";
import styles from "./navcategorie.module.css";

export default function Navcategorie() {

    const [info, setInfo] = useState([]);

    useEffect(() => {
        const fetchphoto = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "category"));
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
    }, []);
    return (
        <div className={styles.content}>
            <h2>Voir plus de catégorie</h2>
            <div className={styles.carroussel}>
                {info.map((photo) => (
                    <div key={photo.id}>
                        <Link href={`/categorie/${photo.id}`}>
                            <img src={photo.photoUrl} alt={photo.slug} className={styles.img}/>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}
