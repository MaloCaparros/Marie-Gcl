import styles from "./home.module.css";
import Menu from "../component/Menu/Menu";
import Info from "../component/Info/Info";
import Carroussel from "../component/Carroussel/Carroussel";

export default function Home() {
    return (
        <main className={styles.home}>
            <Menu />
            <div className={styles.contenu}>
                <Info />
                <Carroussel />
            </div>
        </main>
    );
}
