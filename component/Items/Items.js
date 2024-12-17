import {CircleChevronRight} from "lucide-react";
import Link from 'next/link';
import styles from './items.module.css';

export default function Carrousselitems({ titre, date,lien, imgurl}) {
    return (
        <Link href={lien} style={{ background: `linear-gradient(90deg, rgba(0,0,0,0.4954774145986519) 0%, rgba(0,0,0,0.5) 100%) , url(${imgurl})`}} className={styles.lien}>
            <h2>{titre}</h2>
            <CircleChevronRight size={70} strokeWidth={3} />
            <p>{date}</p>
        </Link>
    );
}