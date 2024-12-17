"use client";
import { useEffect, useState } from "react";
import {
  getDocs,
  collection,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import Link from "next/link";
import { db } from "../../firebase";
import styles from "./../categorie.module.css";
import Navcategorie from "../../../component/Navcategorie/Navcategorie";
import { LogOut, ChevronLeft, ChevronRight, X } from "lucide-react";

export default function Page({ params }) {
  const [info, setInfo] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState({
    open: false,
    photoIndex: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDoc(doc(db, "category", params.slug));
        const photoData = [];
        if (querySnapshot.exists()) {
          photoData.push({ id: querySnapshot.id, ...querySnapshot.data() });
        }
        setCategories(photoData);
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchphoto = async () => {
      try {
        const querySnapshot = await getDocs(
          query(collection(db, "photos"), where("categorie", "==", params.slug))
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
  }, []);

  const openModal = (photoIndex) => {
    setLoading({
      open: true,
      photoIndex: photoIndex,
    });
  };

  const closeModal = () => {
    setLoading({
      open: false,
      photoIndex: null,
    });
  };

  const prevPhoto = () => {
    if (loading.photoIndex > 0) {
      setLoading({
        ...loading,
        photoIndex: loading.photoIndex - 1,
      });
    }
  };

  const nextPhoto = () => {
    if (loading.photoIndex < info.length - 1) {
      setLoading({
        ...loading,
        photoIndex: loading.photoIndex + 1,
      });
    }
  };

  return (
    <div className={styles.contain}>
      <h1 className={styles.title}>
        <span>{categories[0]?.name}</span>
      </h1>
      <div className={styles.carroussel}>
        {info.map((photo, index) => (
          <div key={photo.id}>
            <img
              src={photo.url}
              alt="photo utilisateur"
              onClick={() => openModal(index)}
            />
          </div>
        ))}
      </div>
      {loading.open && (
        <div className={styles.overview}>
          <button onClick={prevPhoto} disabled={loading.photoIndex === 0}>
              <ChevronLeft strokeWidth={2} size={44} />
            </button>
            {loading.photoIndex !== null && (
              <img
                src={info[loading.photoIndex].url}
                alt="Photo sélectionnée"
              />
            )}
            
            <button
              onClick={nextPhoto}
              disabled={loading.photoIndex === info.length - 1}
            >
              <ChevronRight strokeWidth={2} size={44} />
            </button>
            <button onClick={closeModal} className={styles.fermeture}><X strokeWidth={2} size={44} /></button>
        </div>
      )}
      <Navcategorie />
      <div className={styles.navigation}>
        <Link href={"/"}>
          <LogOut />
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
