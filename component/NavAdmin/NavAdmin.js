import styles from "./navadmin.module.css";
import { Camera, Images, ImagePlus, BookUser, LogOut } from "lucide-react";
import Link from "next/link";
import { auth } from "../../app/firebase";
import { usePathname } from 'next/navigation'


export default function NavAdmin() {
    const pathname = usePathname()
    const blueColor = "#0000ff";
  return (
    <nav className={styles.nav}>
      <Link href={"/"}>
        <img src="/logo.png" alt="logo" className={styles.logo} />
      </Link>
      <div className={styles.navContain}>
        <Link href={"/photoajout"}>
          <Camera strokeWidth={1} style={{ color: pathname  === "/photoajout" ? blueColor : "" }} />
        </Link>
        <Link href={"/categorieajout"}>
          <ImagePlus strokeWidth={1} style={{ color: pathname === "/categorieajout" ? blueColor : "" }} />
        </Link>
        <Link href={"/modifcate"}>
          <Images strokeWidth={1} style={{ color: pathname === "/modifcate" ? blueColor : "" }} />
        </Link>
        <Link href={"/tableau"}>
          <BookUser strokeWidth={1} style={{ color: pathname === "/tableau" ? blueColor : "" }} />
        </Link>
      </div>
      <button onClick={() => auth.signOut()} className={styles.button}><LogOut strokeWidth={1} /></button>
      
    </nav>
  );
}
