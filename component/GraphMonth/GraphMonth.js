import React, { useEffect, useState, useRef } from 'react';
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../app/firebase";
import Chart from 'chart.js/auto';
import styles from "./graphmonth.module.css";

export default function GraphMetric() {
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
            const currentMonth = currentDate.getMonth();
            const currentYear = currentDate.getFullYear();

            const monthsLabels = [];

            for (let i = 11; i >= 0; i--) {
                const month = new Date(currentYear, new Date().getMonth() - i, 1);
                const monthLabel = month.toLocaleDateString('fr-FR', { month: 'long' });
                if (i === 0) {
                    monthsLabels.push(`${monthLabel} "En cours"`);
                } else {
                    monthsLabels.push(monthLabel);
                }
            }


            const viewsByMonth = Array(12).fill(0);

            for (let i = 0; i < vue.visit.length; i++) {
                for (const ipAddress in vue.visit[i]) {
                    const visitDate = new Date(vue.visit[i][ipAddress]);
                    if (visitDate.getFullYear() === currentYear && visitDate.getMonth() >= currentMonth - 11) {
                        const monthIndex = 11 - (currentMonth - visitDate.getMonth());
                        viewsByMonth[monthIndex]++;
                    }
                }
            }

            if (chartInstance) {
                chartInstance.destroy();
            }
            let max = 0;
            for (let i= 0; i< viewsByMonth.length; i++){
                if (viewsByMonth[i] > max){
                    max = viewsByMonth[i];
                }
            }

            if (chartRef.current) {
                const ctx = chartRef.current.getContext('2d');
                const newChartInstance = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: monthsLabels,
                        datasets: [{
                            label: 'Evolution des vues par mois',
                            data: viewsByMonth,
                            backgroundColor: 'rgba(54, 162, 235, 1)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 1,
                        }]
                    },
                    options: {
                        scales: {
                            x: {
                                offset: true,
                                grid: {
                                    offset: true
                                }
                            },
                            y: {
                                beginAtZero: true,
                                max: max + 2
                            }
                        },
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
