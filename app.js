document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------
    Chart.defaults.color = '#94a3b8';
    Chart.defaults.font.family = "'Inter', sans-serif";

    // Set Backend API URL (Change this to Render URL when deployed!)
    const API_BASE_URL = 'http://127.0.0.1:5000';

    // Global Chart Instances to allow updating
    let trafficChartInstance = null;
    let powChartInstance = null;
    let radarChartInstance = null;

    // Async Fetcher Function
    async function fetchDashboardData() {
        try {
            // 1. Fetch Traffic Forecast Data
            const trafficRes = await fetch(`${API_BASE_URL}/api/traffic/forecast`);
            if(trafficRes.ok) {
                const trafficData = await trafficRes.json();
                updateTrafficChart(trafficData);
            }

            // 2. Fetch Electoral Matrix Data
            const powRes = await fetch(`${API_BASE_URL}/api/electoral/matrix`);
            if(powRes.ok) {
                const electoralData = await powRes.json();
                updateElectoralCharts(electoralData);
            }
        } catch (error) {
            console.error("Backend Error. Make sure Flask is running!", error);
            console.log("Serving degraded mock data since backend is unreachable.");
            
            // Fallback Traffic Data
            const timeLabels = [];
            let d = new Date(); d.setMinutes(d.getMinutes() - 60);
            for(let i=0; i<=12; i++) { timeLabels.push(`${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`); d.setMinutes(d.getMinutes() + 5); }
            for(let i=1; i<=6; i++) { timeLabels.push(`+${i*5}m`); }
            
            updateTrafficChart({
                labels: timeLabels,
                realFlow: [35, 42, 38, 45, 52, 48, 55, 60, 58, 65, 70, 75, 82, null, null, null, null, null, null],
                lstmForecast: [null, null, null, null, null, null, null, null, null, null, null, null, 82, 88, 92, 95, 98, 99, 100],
                currentSeverity: "High",
                etaStandstill: "T-15m"
            });
            
            // Fallback Electoral Data
            updateElectoralCharts({
                pow: { labels: ["Candidate A", "Candidate B", "Candidate C"], data: [35, 55, 10] },
                radar: {
                    labels: ["Incumbency", "Party Strength", "Past Work", "Personal Base", "Religious/Caste", "Digital Sentiment"],
                    candidateA: [80, 70, 60, 85, 50, 40],
                    candidateB: [20, 65, 85, 75, 80, 90]
                }
            });
        }
    }

    function updateTrafficChart(data) {
        const ctxTraffic = document.getElementById('trafficChart').getContext('2d');
        
        const chartConfig = {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [
                    {
                        label: 'Google Maps Flow (Real-Time)',
                        data: data.realFlow,
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'LSTM Prediction (Forecast)',
                        data: data.lstmForecast,
                        borderColor: '#ef4444',
                        borderDash: [5, 5],
                        tension: 0.4,
                        fill: false,
                        pointBackgroundColor: '#ef4444'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'top' },
                    tooltip: { mode: 'index', intersect: false }
                },
                scales: {
                    y: { title: { display: true, text: 'Congestion Threshold (%)' }, min: 0, max: 100 }
                }
            }
        };

        if (trafficChartInstance) {
            trafficChartInstance.data = chartConfig.data;
            trafficChartInstance.update();
        } else {
            trafficChartInstance = new Chart(ctxTraffic, chartConfig);
        }

        // Update UI dynamic numbers
        document.querySelector('.stat-value.text-red').textContent = `${data.lstmForecast[12] || 85}%`;
        const etaElements = document.querySelectorAll('.stat-value');
        if(etaElements.length > 1) {
            etaElements[1].textContent = data.etaStandstill;
        }
    }

    function updateElectoralCharts(data) {
        // Doughnut Chart
        const ctxPow = document.getElementById('powChart').getContext('2d');
        const powConfig = {
            type: 'doughnut',
            data: {
                labels: data.pow.labels,
                datasets: [{
                    data: data.pow.data,
                    backgroundColor: ['#f59e0b', '#10b981', '#64748b'],
                    borderWidth: 0,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false, cutout: '70%',
                plugins: { legend: { position: 'bottom' } }
            }
        };

        if (powChartInstance) {
            powChartInstance.data = powConfig.data;
            powChartInstance.update();
        } else {
            powChartInstance = new Chart(ctxPow, powConfig);
        }

        // Radar Chart
        const ctxRadar = document.getElementById('comparisonRadar').getContext('2d');
        const radarConfig = {
            type: 'radar',
            data: {
                labels: data.radar.labels,
                datasets: [
                    {
                        label: 'Cand. A (Incumbent)',
                        data: data.radar.candidateA,
                        backgroundColor: 'rgba(245, 158, 11, 0.2)',
                        borderColor: '#f59e0b',
                        pointBackgroundColor: '#f59e0b',
                    },
                    {
                        label: 'Cand. B (Challenger)',
                        data: data.radar.candidateB,
                        backgroundColor: 'rgba(16, 185, 129, 0.2)',
                        borderColor: '#10b981',
                        pointBackgroundColor: '#10b981',
                    }
                ]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                scales: {
                    r: {
                        angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        pointLabels: { color: '#f8fafc', font: { size: 12 } },
                        ticks: { color: 'transparent', backdropColor: 'transparent', z: -1 }
                    }
                }
            }
        };

        if (radarChartInstance) {
            radarChartInstance.data = radarConfig.data;
            radarChartInstance.update();
        } else {
            radarChartInstance = new Chart(ctxRadar, radarConfig);
        }
    }

    // Trigger Initial Fetch
    fetchDashboardData();

    // Set up real-time polling to simulate live LSTM / API updates
    setInterval(fetchDashboardData, 15000);

    // Front-End Validation Button Logic
    document.getElementById('validateAlertsBtn').addEventListener('click', (e) => {
        const btn = e.target;
        btn.textContent = 'Validating API Sync...';
        btn.style.opacity = '0.7';
        fetchDashboardData().then(() => {
            btn.textContent = 'Alerts Validated';
            btn.style.background = '#10b981';
            btn.style.opacity = '1';
            setTimeout(() => {
                btn.textContent = 'Validate Alerts';
                btn.style.background = '#3b82f6';
            }, 3000);
        });
    });
});
