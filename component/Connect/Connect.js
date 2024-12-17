"use client";
import {useState} from "react";
import {signInWithEmailAndPassword} from "firebase/auth";
import {auth} from "../../app/firebase";
import styles from "./connect.module.css";
import {useRouter} from "next/navigation";
import Link from "next/link";
import {LogOut} from "lucide-react";

export default function LoginForm() {
    const [data, setData] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState(null);
    const router = useRouter();
    const [compter, setCompter] = useState(0);

    const handleSignIn = (e) => {
        e.preventDefault();

        if (compter <= 5) {
            signInWithEmailAndPassword(auth, data.email, data.password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    setData({
                        email: "",
                        password: "",
                    });
                    setError(null);
                    router.push("/profil");
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    setError(errorMessage);
                });
            setCompter(compter + 1);
        } else {
            setError("Vous avez dépassé le nombre de tentatives autorisées");
        }
    };

    return (
        <div className={styles.contain}>
            <h2>Se connecter</h2>
            <form onSubmit={handleSignIn} className={styles.form}>
                {error && <div style={{color: "red"}}>{error}</div>}{" "}
                <div className={styles.element}>
                    <label htmlFor="email">Email :</label>
                    <input
                        type="email"
                        id="email"
                        value={data.email}
                        onChange={(e) => setData({
                            ...data,
                            email: e.target.value,
                        })}
                        required
                    />
                </div>
                <div className={styles.element}>
                    <label htmlFor="password">Mot de passe :</label>
                    <input
                        type="password"
                        id="password"
                        value={data.password}
                        onChange={(e) => setData({
                            ...data,
                            password: e.target.value,
                        })}
                        required
                    />
                </div>
                <button type="submit" className={styles.button}>
                    Se connecter
                </button>
            </form>
            <Link href="/inscription" className={styles.button}>
                Pas encore de compte ? Inscrivez-vous
            </Link>
            <div className={styles.navigation}>
                <Link href={"/"}><LogOut />Retour à l&apos;accueil</Link>
            </div>
        </div>
    );
}
