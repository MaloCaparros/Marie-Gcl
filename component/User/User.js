"use client";
import { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db, storage } from "../../app/firebase";
import { auth } from "../../app/firebase";
import { useRouter } from "next/navigation";
import styles from "./user.module.css";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import Link from "next/link";
import {LogOut} from "lucide-react";

export default function User() {
  const [info, setInfo] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    email: "",
    displayName: "",
    photoURL: "",
  });
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserData({
          ...userData,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        });
      } else {
        router.push("/connexion");
      }
      setLoading(true);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(
          query(
            collection(db, "photos"),
            where("proprietaire", "==", userData.displayName)
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

    fetchData();
  }, [loading]);

  const handleAddPicture = async (e) => {
    const imageFile = e.target.files[0];
    const imageName = imageFile.name;
    const storageRef = ref(storage, `photos/${imageName}`);
    await uploadBytes(storageRef, imageFile);
    const downloadURL = await getDownloadURL(storageRef);

    setUserData({
      ...userData,
      photoURL: downloadURL,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await updateProfile(auth.currentUser, {
      photoURL: userData.photoURL,
    });
    await updateDoc(doc(db, "users", auth.currentUser.uid), {
      photoURL: userData.photoURL,
    });
  };

  return (
    <>
      {auth.currentUser?.emailVerified === true ? (
        <div className={styles.contain}>
          <h1>Bonjour {userData.displayName}</h1>
          <img
            src={userData.photoURL}
            alt={userData.displayName}
            className={styles.imgprofil}
          />
          <form onSubmit={handleSubmit} className={styles.form}>
            <label className={styles.labelimg}>
              <input
                type="file"
                name="image"
                placeholder="Image"
                onChange={handleAddPicture}
              />
              Modifier la photo
            </label>
            <button type="submit">Valider</button>
          </form>
          <p>{userData.email}</p>
          <h3>Vos photos</h3>
          <div className={styles.carrou}>
            {info.map((photo) => (
              <div key={photo.id}>
                <img src={photo.url} alt={photo.proprietaire} />
              </div>
            ))}
          </div>
          <div className={styles.retour}>
            <button onClick={() => auth.signOut()} className={styles.button}>
              Se déconnecter
            </button>
            <div className={styles.navigation}>
              <Link href={"/"}><LogOut />Retour à l&apos;accueil</Link>
            </div>
          </div>
        </div>
      ) : (
        <>
          <h2>Faite vérifier votre adresse e-mail</h2>
          <Link href="/">Aller à la page d&apos;accueil</Link>
        </>
      )}
    </>
  );
}
