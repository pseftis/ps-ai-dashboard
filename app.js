document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------
    Chart.defaults.color = '#94a3b8';
    Chart.defaults.font.family = "'Inter', sans-serif";

    // ----------------------------------------
    // PS4: Traffic Chart
    // ----------------------------------------
    const ctxTraffic = document.getElementById('trafficChart').getContext('2d');
    
    // Generate mock time labels
    const timeLabels = [];
    let d = new Date();
    d.setMinutes(d.getMinutes() - 60);
    for(let i=0; i<=12; i++) {
        timeLabels.push(`${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`);
        d.setMinutes(d.getMinutes() + 5);
    }
    // Add prediction labels
    for(let i=1; i<=6; i++) {
        timeLabels.push(`+${i*5}m`);
    }

    const trafficData = {
        labels: timeLabels,
        datasets: [
            {
                label: 'Google Maps Flow (Real)',
                data: [35, 42, 38, 45, 52, 48, 55, 60, 58, 65, 70, 75, 82, null, null, null, null, null, null],
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
                fill: true
            },
            {
                label: 'LSTM Prediction (Forecast)',
                data: [null, null, null, null, null, null, null, null, null, null, null, null, 82, 88, 92, 95, 98, 99, 100],
                borderColor: '#ef4444',
                borderDash: [5, 5],
                tension: 0.4,
                fill: false,
                pointBackgroundColor: '#ef4444'
            }
        ]
    };

    new Chart(ctxTraffic, {
        type: 'line',
        data: trafficData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top' },
                tooltip: { mode: 'index', intersect: false }
            },
            scales: {
                y: {
                    title: { display: true, text: 'Congestion Threshold (%)' },
                    min: 0,
                    max: 100
                }
            }
        }
    });

    document.getElementById('validateAlertsBtn').addEventListener('click', (e) => {
        const btn = e.target;
        btn.textContent = 'Validating...';
        btn.style.opacity = '0.7';
        setTimeout(() => {
            btn.textContent = 'Alerts Validated';
            btn.style.background = '#10b981';
            btn.style.opacity = '1';
        }, 1500);
    });

    // ----------------------------------------
    // PS5: Electoral Charts
    // ----------------------------------------
    const ctxPow = document.getElementById('powChart').getContext('2d');
    new Chart(ctxPow, {
        type: 'doughnut',
        data: {
            labels: ['Cadidate A', 'Candidate B', 'Candidate C'],
            datasets: [{
                data: [35, 55, 10],
                backgroundColor: [
                    '#f59e0b',
                    '#10b981',
                    '#64748b'
                ],
                borderWidth: 0,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });

    const ctxRadar = document.getElementById('comparisonRadar').getContext('2d');
    new Chart(ctxRadar, {
        type: 'radar',
        data: {
            labels: ['Incumbency', 'Party Strength', 'Past Work', 'Personal Base', 'Religious/Caste', 'Digital Sentiment'],
            datasets: [
                {
                    label: 'Cand. A (Incumbent)',
                    data: [80, 70, 60, 85, 50, 40],
                    backgroundColor: 'rgba(245, 158, 11, 0.2)',
                    borderColor: '#f59e0b',
                    pointBackgroundColor: '#f59e0b',
                },
                {
                    label: 'Cand. B (Challenger)',
                    data: [20, 65, 85, 75, 80, 90],
                    backgroundColor: 'rgba(16, 185, 129, 0.2)',
                    borderColor: '#10b981',
                    pointBackgroundColor: '#10b981',
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    pointLabels: { color: '#f8fafc', font: { size: 12 } },
                    ticks: {
                        color: 'transparent',
                        backdropColor: 'transparent',
                        z: -1
                    }
                }
            }
        }
    });
});
