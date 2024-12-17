'use client';
import React, {useEffect, useState, useRef} from 'react';
import {doc, getDoc} from "firebase/firestore";
import {db} from "../../app/firebase";
import Chart from 'chart.js/auto';
import styles from "./graphmetric.module.css";

export default function Metric() {
    const [vue, setVue] = useState({});
    const chartRef = useRef(null);
    const [chartInstance, setChartInstance] = useState(null);

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
            const currentDay = currentDate.getDay();
            const oneDay = 24 * 60 * 60 * 1000;
            const weekAgo = new Date(currentDate.getTime() - (7 * oneDay));
            const daysLabels = [];

            for (let i = 6; i >= 0; i--) {
                const day = new Date(currentDate.getTime() - (i * oneDay));
                const dayLabel = day.toLocaleDateString('fr-FR', { weekday: 'long' });
                if (i === 0) {
                    daysLabels.push(`${dayLabel} "En cours"`)
                }
                else{
                    daysLabels.push(dayLabel);
                }
            }

            let viewsByDay = [0, 0, 0, 0, 0, 0, 0];
            for (let i = 0; i< vue.visit.length; i++) {
                for (const ipAddress in vue.visit[i]) {
                    const visitDate = new Date(vue.visit[i][ipAddress]);
                    if (visitDate >= weekAgo && visitDate <= currentDate) {
                        const dayIndex = (visitDate.getDay() + 6 - currentDay);
                        viewsByDay[dayIndex]++;
                    }
                }
            }


            if (chartInstance) {
                chartInstance.destroy();
            }

            let max = 0;
            for (let i= 0; i< viewsByDay.length; i++){
                if (viewsByDay[i] > max){
                    max = viewsByDay[i];
                }
            }

            if (chartRef.current) {
                const ctx = chartRef.current.getContext('2d');
                const newChartInstance = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: daysLabels,
                        datasets: [{
                            label: 'Evolution des vues',
                            data: viewsByDay,
                            backgroundColor: 'rgba(54, 162, 235, 1)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 1,
                        }]
                    },
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true,
                                max: max + 2
                            }
                        }
                    }
                });
                setChartInstance(newChartInstance);
            }
        }
    }, [vue]);

    return (
        <div className={styles.graphique}>
            <canvas ref={chartRef} className={styles.graph}></canvas>
        </div>
    );
}
