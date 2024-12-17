import {CircleChevronRight} from "lucide-react";
import styles from './info.module.css';
import Link from 'next/link';

export default function Info() {
    return (
        <div className={styles.info}>
            <div>
                <h1 className={styles.titletxt}>Bienvenue sur mon Portfolio</h1>
                <p className={styles.titledate}>Marie-Gcl photographe</p>
            </div>
            <Link href={"/information"} className={styles.lien}>
                <p>
                    Me découvrir
                </p>
                <CircleChevronRight size={70} strokeWidth={3} />
            </Link>
        </div>
    )
        ;
}
