"use client";
import {addDoc, collection, getDocs, updateDoc, doc} from "firebase/firestore";
import {auth, storage} from "../../app/firebase";
import {getDownloadURL, ref, uploadBytes} from "firebase/storage";
import {db} from "../../app/firebase";
import {useEffect, useState} from "react";
import styles from "./ajouter.module.css";
import {useRouter} from "next/navigation";
import NavAdmin from "../NavAdmin/NavAdmin";

export default function Ajouter() {
    const router = useRouter();
    const [photo, setphoto] = useState({
        proprietaire: "",
        url: "",
        categorie: "aQt9W5hhXF4MbeKsPgs7",
        created_at: new Date(),
    });
    const [categories, setCategories] = useState([]);

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

    const addData = async (e) => {
        e.preventDefault();
        if (photo.url !== "") {
            const addDocFirebase = await addDoc(collection(db, "photos"), photo);

            if (addDocFirebase) {
                await updateDoc(doc(db, "category", photo.categorie), {
                    photos: [
                        ...categories.find((cat) => cat.id === photo.categorie).photos,
                        addDocFirebase.id,
                    ],
                });
            }

            setphoto({
                proprietaire: "",
                url: "",
                categorie: "aQt9W5hhXF4MbeKsPgs7",
                created_at: new Date(),
            });
        } else {
            console.log(
                "L'URL de téléchargement est vide. Veuillez télécharger une image."
            );
        }
    };

    const handleAddPicture = async (e) => {
        const imageFile = e.target.files[0];
        const imageName = imageFile.name;
        const storageRef = ref(storage, `photos/${imageName}`);
        await uploadBytes(storageRef, imageFile);
        const downloadURL = await getDownloadURL(storageRef);

        setphoto({
            ...photo,
            url: downloadURL,
        });
    };

    return (
        <div className={styles.contain}>
            <NavAdmin />
            <div className={styles.content}>
                <h2 className={styles.titre}>
                    Ajouter une photo dans la base de données
                </h2>
                <form onSubmit={addData} className={styles.form}>
                    <input
                        type="text"
                        name="proprietaire"
                        placeholder="Propriétaire"
                        onChange={(e) =>
                            setphoto({
                                ...photo,
                                proprietaire: e.target.value,
                            })
                        }
                        value={photo.proprietaire}
                    />
                    <label className={styles.labelimg}>
                        <input
                            type="file"
                            name="image"
                            placeholder="Image"
                            onChange={handleAddPicture}
                            className={styles.image}
                        />
                        Ajouter une image
                    </label>
                    <img
                        src={photo.url}
                        alt="Aperçu de l'image"
                        style={{width: "100px"}}
                        className={styles.affichimg}
                    />
                    <div className={styles.divselect}>
                        <label htmlFor="categorie">
                            Sélectionner la catégorie associer à la photo :
                        </label>
                        <select
                            className={styles.select}
                            name="categorie"
                            value={photo.categorie}
                            onChange={(e) =>
                                setphoto({
                                    ...photo,
                                    categorie: e.target.value,
                                })
                            }
                        >
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button type="submit" className={styles.button}>
                        Ajouter
                    </button>
                </form>
                <div className={styles.navigation}>
                    <button onClick={() => router.back()}>Retour</button>
                </div>
            </div>
        </div>
    );
}
