"use client";
import styles from "./menu.module.css";
import { useEffect, useState } from "react";
import { auth } from "../../app/firebase";
import { LogIn } from "lucide-react";
import Link from "next/link";

export default function Menu() {
  const [admin, setAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [ouvert, setOuvert] = useState(false);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user?.uid === process.env.NEXT_PUBLIC_REACT_APP_FIREBASE_USER_ID) {
        setAdmin(true);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setLoading(false);
      }
      return () => unsubscribe();
    });
  }, []);

  const handleClick = () => {
    const menu = document.querySelector(`.${styles.menuBar}`);
    const nav = document.querySelector(`.${styles.navigation}`);

    if (menu.classList.contains(`${styles.active}`)) {
      nav.classList.remove(`${styles.ouvert}`);
      menu.classList.remove(`${styles.active}`);
      menu.classList.add(`${styles.inactive}`);
      setOuvert(false);
    } else {
      nav.classList.add(`${styles.ouvert}`);
      menu.classList.add(`${styles.active}`);
      setOuvert(true);
      menu.classList.remove(`${styles.inactive}`);
    }
  };

  return (
    <div className={styles.header}>
      <nav className={styles.menu}>
        <div className={styles.menuBar} onClick={handleClick}>
          <div className={styles.trait}></div>
          <div className={styles.trait}></div>
          <div className={styles.trait}></div>
        </div>
        <ul className={styles.navigation}>
          {!loading && (
            <li className={styles.navitems}>
              <a href="/profil">Profil</a>
            </li>
          )}
          <li className={styles.navitems}>
            <a href="/contact">Me contacter</a>
          </li>
          <li className={styles.navitems}>
            <a href="/information">Information</a>
          </li>
          {admin && (
            <li className={styles.navitems}>
              <a href="/admin">Admin</a>
            </li>
          )}
        </ul>
      </nav>
      <ul>
        {loading && (
          <li className={styles.navitems}>
            <Link href="/connexion">
              <p>Connexion</p>
              <LogIn strokeWidth={3} />
            </Link>

          </li>
        )}
      </ul>
    </div>
  );
}
