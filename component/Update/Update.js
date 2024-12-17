"use client";
import {useState, useEffect} from "react";
import {
    getDocs,
    collection,
    updateDoc,
    doc,
    getDoc,
    deleteDoc,
} from "firebase/firestore";
import {auth, db, storage} from "../../app/firebase";
import styles from "./update.module.css";
import {getDownloadURL, ref, uploadBytes} from "firebase/storage";
import Link from "next/link";
import NavAdmin from "../NavAdmin/NavAdmin";
import {useRouter} from "next/navigation";

export default function Ajtcategorie() {
    const router = useRouter();
    const [categorie, setCategorie] = useState([]);
    const [active, setActive] = useState(false);
    const [selected, setSelected] = useState("");
    const [info, setInfo] = useState({
        name: "",
        photoUrl: "",
        position: 0,
        published: false,
        slug: "",
    });

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
                const photoData = [];
                querySnapshot.forEach((doc) => {
                    const photo = {
                        ...doc.data(),
                        id: doc.id,
                    };
                    photoData.push(photo);
                });
                setCategorie(photoData);
            } catch (error) {
                console.error("Erreur lors de la récupération des données:", error);
            }
        };
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setActive(true);
        const fetchData = async () => {
            try {
                const querySnapshot = await getDoc(doc(db, "category", selected));
                const photoData = [];
                if (querySnapshot.exists()) {
                    const photo = {
                        ...querySnapshot.data(),
                        id: querySnapshot.id,
                    };
                    photoData.push(photo);
                }

                setInfo(photoData[0]);
            } catch (error) {
                console.error("Erreur lors de la récupération des données:", error);
            }
        };
        fetchData();
    };

    const addData = async (e) => {
        e.preventDefault();
        try {
            await updateDoc(doc(db, "category", selected), {
                name: info.name,
                photoUrl: info.photoUrl,
                position: parseInt(info.position),
                published: info.published,
                slug: info.slug,
            });
            console.log("Données mises à jour avec succès !");
        } catch (error) {
            console.error("Erreur lors de la mise à jour des données :", error);
        }
        setActive(false);
    };

    const handleAddPicture = async (e) => {
        const imageFile = e.target.files[0];
        const imageName = imageFile.name;

        const storageRef = ref(storage, `photos/${imageName}`);
        await uploadBytes(storageRef, imageFile);

        const downloadURL = await getDownloadURL(storageRef);

        setInfo({
            ...info,
            photoUrl: downloadURL,
        });
    };

    const suppresion = async () => {
        try {
            await deleteDoc(doc(db, "category", selected));
        } catch (error) {
            console.error("Erreur lors de la suppresion des données :", error);
        }
        setActive(false);
    };

    return (
        <div className={styles.contain}>
            <NavAdmin/>
            <div className={styles.content}>
                <h2>Modifier une catégorie</h2>
                <form onSubmit={handleSubmit} className={styles.selection}>
                    <select onChange={(e) => setSelected(e.target.value)}>
                        {categorie.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                    <button type="submit">Select</button>
                </form>
                {active && (
                    <form onSubmit={addData} className={styles.form}>
                        <input
                            type="text"
                            name="name"
                            placeholder="Nom Catégorie"
                            onChange={(e) =>
                                setInfo({
                                    ...info,
                                    name: e.target.value,
                                })
                            }
                            value={info.name}
                        />
                        <label>
                            <input
                                type="file"
                                name="image"
                                placeholder="Photo associé à la catégorie"
                                onChange={handleAddPicture}
                            />
                        </label>
                        <img src={info.photoUrl} alt="photo"/>
                        <label>Position:</label>
                        <input
                            type="text"
                            name="position"
                            placeholder="Position dans la page"
                            onChange={(e) =>
                                setInfo({
                                    ...info,
                                    position: e.target.value,
                                })
                            }
                            value={info.position}
                        />
                        <div>
                            <input
                                type="radio"
                                name="published"
                                value="true"
                                checked={info.published === true}
                                onChange={() =>
                                    setInfo({
                                        ...info,
                                        published: true,
                                    })
                                }
                            />
                            <label htmlFor="trueBool">True</label>

                            <input
                                type="radio"
                                name="published"
                                value="false"
                                checked={info.published === false}
                                onChange={() =>
                                    setInfo({
                                        ...info,
                                        published: false,
                                    })
                                }
                            />
                            <label htmlFor="falseBool">False</label>
                        </div>
                        <label htmlFor="slug">Slug :</label>
                        <input
                            type="text"
                            name="slug"
                            placeholder="Slug"
                            onChange={(e) =>
                                setInfo({
                                    ...info,
                                    slug: e.target.value,
                                })
                            }
                            value={info.slug}
                        />

                        <button type="submit">Modifier</button>
                        <button onClick={suppresion}>Supprimer</button>
                    </form>
                )}
                <div className={styles.navigation}>
                    <Link href="/admin">Retour à admin</Link>
                </div>
            </div>
        </div>
    );
}
