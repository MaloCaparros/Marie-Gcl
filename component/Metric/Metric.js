"use client";
import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../app/firebase";
import styles from "./metric.module.css";

export default function Metric() {
  const [vue, setVue] = useState({});
  const [date, setDate] = useState({
    jour: 0,
    semaine: 0,
    mois: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const document = await getDoc(doc(db, "metric", "analytics"));
        if (document.exists()) {
          setVue(document.data());
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (vue && vue.visit) {
      const currentDate = new Date();
      const currentDay = currentDate.getDate();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();
      let dayViews = 0;
      let weekViews = 0;
      let monthViews = 0;

      for (let i = 0; i < vue.visit.length; i++) {
        for (let ipAddress in vue.visit[i]) {
          const visitDate = new Date(vue.visit[i][ipAddress]);
          if (
            visitDate.getFullYear() === currentYear &&
            visitDate.getMonth() === currentMonth
          ) {
            monthViews++;
            if (visitDate.getDate() === currentDay) {
              dayViews++;
            }
            if (currentDate - visitDate <= 7 * 24 * 60 * 60 * 1000) {
              weekViews++;
            }
          }
        }
      }
      setDate({
        jour: dayViews,
        semaine: weekViews,
        mois: monthViews,
      });
    }
  }, [vue]);

  return (
    <div className={styles.chiffre}>
      <div className={styles.info}>
        <p>Vues aujourd&apos;hui</p>
        <p> {date.jour}</p>
      </div>
      <div className={styles.info}>
        <p>Vues cette semaine</p>
        <p>{date.semaine}</p>
      </div>
      <div className={styles.info}>
        <p>Vues ce mois-ci</p>
        <p>{date.mois}</p>
      </div>
    </div>
  );
}
