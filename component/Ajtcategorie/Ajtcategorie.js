"use client";
import {addDoc, collection, getDocs} from "firebase/firestore";
import {auth, storage} from "../../app/firebase";
import {getDownloadURL, ref, uploadBytes} from "firebase/storage";
import {db} from "../../app/firebase";
import {useEffect, useState} from "react";
import styles from "./ajtcategorie.module.css";
import Link from "next/link";
import NavAdmin from "../NavAdmin/NavAdmin";
import {useRouter} from "next/navigation";

export default function Ajtcategorie() {
    const router = useRouter();
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

    const [categorie, setcategorie] = useState({
        name: "",
        photos: [],
        photoURL: "",
        position: categories.length+1,
        published: true,
        slug: "",
    });

    const addData = async (e) => {
        e.preventDefault();
        if (categorie.name !== "") {
            await addDoc(collection(db, "category"), categorie);
            setcategorie({
                name: "",
                photos: [],
                photoURL: "",
                position: categories.length+1,
                published: false,
                slug: "",
            });
        }
    };

    const handleBoolChange = (value) => {
        setcategorie({
            ...categorie,
            published: value === "true",
        });
    };

    const handleAddPicture = async (e) => {
        const imageFile = e.target.files[0];
        const imageName = imageFile.name;

        const storageRef = ref(storage, `categorie/${imageName}`);
        await uploadBytes(storageRef, imageFile);

        const downloadURL = await getDownloadURL(storageRef);

        setcategorie({
            ...categorie,
            photoURL: downloadURL,
        });
    };

    return (
        <div className={styles.contain}>
            <NavAdmin/>
            <div className={styles.content}>
                <h2 className={styles.titre}>
                    Ajouter une photo dans la base de données
                </h2>
                <form onSubmit={addData} className={styles.form}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Nom Catégorie"
                        onChange={(e) =>
                            setcategorie({
                                ...categorie,
                                name: e.target.value,
                            })
                        }
                        value={categorie.name}
                    />
                    <label className={styles.labelimg}>
                        <input
                            type="file"
                            name="image"
                            placeholder="Photo associé à la catégorie"
                            onChange={handleAddPicture}
                            className={styles.image}
                        />
                        Ajouter une image
                    </label>
                    <img
                        src={categorie.photoURL}
                        alt="Aperçu de l'image"
                        style={{width: "100px"}}
                        className={styles.affichimg}
                    />
                    <div className={styles.publish}>
                        <label htmlFor="published">Publié :</label>
                        <input
                            type="radio"
                            name="published"
                            value="true"
                            checked={categorie.published}
                            onChange={() => handleBoolChange("true")}
                        />
                        <label htmlFor="trueBool">True</label>

                        <input
                            type="radio"
                            name="published"
                            value="false"
                            checked={!categorie.published}
                            onChange={() => handleBoolChange("false")}
                        />
                        <label htmlFor="falseBool">False</label>
                    </div>
                    <input
                        type="text"
                        name="slug"
                        placeholder="Slug"
                        onChange={(e) =>
                            setcategorie({
                                ...categorie,
                                slug: e.target.value,
                            })
                        }
                        value={categorie.slug}
                    />

                    <button type="submit" className={styles.button}>
                        Ajouter
                    </button>
                </form>
                <div className={styles.navigation}>
                    <Link href="/admin">Retour à admin</Link>
                </div>
            </div>
        </div>
    );
}
