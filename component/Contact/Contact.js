"use client"

import styles from "./contact.module.css";
import emailjs from "emailjs-com";
import {useState} from "react";
import Link from "next/link";
import {LogOut} from "lucide-react";

function FormContact() {

    const [formData, setFormData] = useState({
        firstName: "",
        email: "",
        message: "",
    });
    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.firstName || !formData.email || !formData.message) {
            setErrorMessage("Veuillez remplir tous les champs du formulaire.");
            return;
        }

        emailjs
            .send(
                process.env.NEXT_PUBLIC_SECRET_KEY_EMAILJS_SERVICE_ID,
                process.env.NEXT_PUBLIC_SECRET_KEY_EMAILJS_TEMPLATE,
                formData,
                process.env.NEXT_PUBLIC_SECRET_KEY_EMAILJS_KEY
            )
            .then((response) => {
                setErrorMessage("");
                setFormData({
                    firstName: "",
                    email: "",
                    message: "",
                });
            })
            .catch((error) => {
                console.error("Erreur lors de l'envoi de l'e-mail:", error);
                setErrorMessage("Erreur lors de l'envoi de l'e-mail. Veuillez réessayer.");
            });
        setFormData({
            firstName: "",
            email: "",
            message: "",
        });
    };

    return (
        <div className={styles.contact}>
            <div className={styles.left}>
                <h1>Page <strong> Contacter </strong></h1>
                <form onSubmit={handleSubmit} className={styles.formContact}>
                    {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
                    <div className={styles.formcase}>
                        <label htmlFor="name">
                            <input
                                type="text"
                                id="prenom"
                                name="firstName"
                                placeholder="Prénom"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                            />
                        </label>
                    </div>
                    <div className={styles.formcase}>
                        <label htmlFor="email">
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </label>
                    </div>
                    <div className={styles.formcase}>
                        <label htmlFor="message">
                    <textarea
                        id="message"
                        name="message"
                        placeholder="Message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        className={styles.textarea}
                    ></textarea>
                        </label>
                    </div>

                    <button type="submit">Envoyer
                    </button>
                </form>
            </div>
            <div className={styles.right}>
                <h2>Nous trouver</h2>
                <div className={styles.contactMap}>
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d21691.85796090041!2d-1.4908473652343655!3d47.18757290000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4805e61f3add3241%3A0x287fc5a9924b0e3c!2sMcDonald&#39;s!5e0!3m2!1sfr!2sfr!4v1712149755990!5m2!1sfr!2sfr"
                          allowFullScreen="" loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade">
                    </iframe>
                </div>
                <div className={styles.contactInfo}>
                    <p><strong>Mail </strong> <Link href={"mailto:malo.caparros@orange.fr"}>malo.caparros@orange.fr</Link></p>
                    <p><strong>Téléphone </strong> <Link href={"tel:+1234567890"}> 01 02 03 04 05</Link></p>
                    <p><strong>Adresse </strong><Link href={"https://www.google.fr/maps/place/McDonald's/@47.1875765,-1.4728229,17z/data=!3m1!4b1!4m6!3m5!1s0x4805e61f3add3241:0x287fc5a9924b0e3c!8m2!3d47.1875729!4d-1.470248!16s%2Fg%2F1tj846hb?entry=ttu"}>McDonalds</Link></p>
                </div>
            </div>
            <div className={styles.navigation}>
                <Link href={"/"}><LogOut />Retour à l&apos;accueil</Link>
            </div>

        </div>
    );
}

export default FormContact;