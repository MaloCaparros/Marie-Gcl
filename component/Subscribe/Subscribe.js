"use client";
import {useState} from "react";
import {
    createUserWithEmailAndPassword,
    sendEmailVerification,
    updateProfile,
} from "firebase/auth";
import {auth} from "../../app/firebase";
import {db} from "../../app/firebase";
import {setDoc, doc} from "firebase/firestore";
import styles from "./subscribe.module.css";
import {useRouter} from "next/navigation";
import Link from "next/link";
import {LogOut} from "lucide-react";

export default function Subscribe() {
    const [error, setError] = useState(null);
    const [compter, setCompter] = useState(0);
    const [user, setUser] = useState({
        creation_at: new Date(),
        displayName: "",
        email: "",
        last_connexion: new Date(),
        password: "",
        photoURL:
            "https://firebasestorage.googleapis.com/v0/b/marie-gcl.appspot.com/o/unnamed.jpg?alt=media&token=3c1dae84-da2f-4b72-adcd-7828de6bc6e8",
    });
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (compter <= 5) {
            const emailRegex = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;
            const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[^\s]{6,}$/;

            if (!emailRegex.test(user.email)) {
                setError("Veuillez entrer une adresse e-mail valide.");
                return;
            }
            if (!passwordRegex.test(user.password)) {
                setError(
                    "Le mot de passe doit contenir au moins une majuscule, un chiffre, un caractère spécial et faire au moins 6 caractères de long."
                );
                return;
            }

            await createUserWithEmailAndPassword(auth, user.email, user.password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    sendVerificationEmail(user);
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.error("Erreur lors de l'inscription:", errorCode, errorMessage);
                });
            await updateProfile(auth.currentUser, {
                displayName: user.displayName,
                photoURL: user.photoURL,
            })
                .then(() => {
                })
                .catch((error) => {
                });

            if (user.displayName !== "" && auth.currentUser) {
                await setDoc(doc(db, "users", auth.currentUser.uid), {
                    creation_at: user.creation_at,
                    displayName: user.displayName,
                    email: user.email,
                    last_connexion: user.last_connexion,
                    photoURL: user.photoURL,
                });
                setUser({
                    ...user,
                    displayName: "",
                    email: "",
                });
            }
            setCompter(compter + 1);
            router.push("/profil");
        } else {
            setError("Vous avez atteint le nombre maximal d'inscription pour aujourd'hui.");
        }
    };

    const sendVerificationEmail = () => {
        sendEmailVerification(auth.currentUser)
            .then(() => {
                console.log("E-mail de vérification envoyé !");
            })
            .catch((error) => {
                console.error(
                    "Erreur lors de l'envoi de l'e-mail de vérification:",
                    error
                );
            });
    };

    return (
        <div className={styles.contain}>
            <h2>Inscription</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
                {error && <div style={{color: "red"}}>{error}</div>}{" "}
                <div className={styles.element}>
                    <label htmlFor="displayName">Nom :</label>
                    <input
                        type="text"
                        id="displayName"
                        value={user.displayName}
                        onChange={(e) => setUser({...user, displayName: e.target.value})}
                        required
                    />
                </div>
                <div className={styles.element}>
                    <label htmlFor="email">Email :</label>
                    <input
                        type="email"
                        id="email"
                        value={user.email}
                        onChange={(e) => setUser({...user, email: e.target.value})}
                        required
                    />
                </div>
                <div className={styles.element}>
                    <label htmlFor="password">Mot de passe :</label>
                    <input
                        type="password"
                        id="password"
                        value={user.password}
                        onChange={(e) => setUser({...user, password: e.target.value})}
                        required
                    />
                </div>
                <button type="submit">S&apos;inscrire</button>
            </form>
            <div className={styles.navigation}>
                <Link href={"/"}><LogOut />Retour à l&apos;accueil</Link>
            </div>
        </div>
    );
}
