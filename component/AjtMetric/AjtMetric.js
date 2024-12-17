"use client";
import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../app/firebase";

export default function Metric() {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const ipAddress = await getUserIPAddress();
        const today = new Date().toISOString().split("T")[0];
        const documentSnapshot = await getDoc(doc(db, "metric", "analytics"));

        if (documentSnapshot.exists()) {
          const data = documentSnapshot.data();
          let found = false;

          for (let i = 0; i < data.visit.length; i++) {
            if (data.visit[i][ipAddress] === today) {
              found = true;
              break;
            }
          }

          if (!found) {
            data.visit[ipAddress] = today;
            await updateDoc(doc(db, "metric", "analytics"), {
              vue: data.vue + 1,
              visit: [...data.visit, { [ipAddress]: today }],
            });
          }
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      }
    };

    fetchData();
  }, []);

  const getUserIPAddress = async () => {
    try {
      const response = await fetch("https://api.ipify.org?format=json");
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.error("Erreur lors de la récupération de l'adresse IP:", error);
      return null;
    }
  };

  return <></>;
}
