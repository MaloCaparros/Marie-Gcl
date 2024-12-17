'use client';
import Items from "../Items/Items";
import styles from "./carroussel.module.css";
import {useEffect, useState} from "react";
import {collection, getDocs} from "firebase/firestore";
import {db} from "../../app/firebase";

export default function Carroussel() {
    const [categories, setCategories] = useState([]);
    const [position, setPosition] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "category"));
                const categoriesData = [];
                querySnapshot.forEach((doc) => {
                    categoriesData.push({id: doc.id, ...doc.data()});
                });
                setCategories(categoriesData);
            } catch (error) {
                console.error("Erreur lors de la récupération des catégories :", error);
            }
        };
        fetchData();
    }, []);


    console.log(categories);
    return (
        <div className={styles.contain}>

            {categories
                .filter(categorie => categorie.published === true)
                .sort((a, b) => a.position - b.position)
                .map((categorie) => (
                    <div key={categorie.id}>
                        <Items
                            titre={categorie.name}
                            lien={`/categorie/${categorie.id}`}
                            date={categorie.slug}
                            imgurl={categorie.photoUrl}
                        />
                    </div>
                ))}
        </div>
    );
}