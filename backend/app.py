from flask import Flask, jsonify
from flask_cors import CORS
import random
import datetime

app = Flask(__name__)
# Enable CORS so the GitHub pages frontend can access this backend from anywhere
CORS(app)

@app.route('/')
def home():
    return jsonify({"status": "online", "message": "Cyber Analytics API is running"})

@app.route('/api/traffic/forecast')
def traffic_forecast():
    """Generates dynamic traffic prediction values modeled after LSTM outputs"""
    
    # Generate labels
    now = datetime.datetime.now()
    time_labels = []
    
    # Past 13 hours/mins
    for i in range(13, 0, -1):
        dt = now - datetime.timedelta(minutes=i*5)
        time_labels.append(dt.strftime("%H:%M"))
        
    # Future 6 forecasts
    for i in range(1, 7):
        time_labels.append(f"+{i*5}m")

    # Generate synthetic real data (first 13)
    real_data = [random.randint(30, 45)]
    for i in range(1, 13):
        real_data.append(min(100, max(0, real_data[-1] + random.randint(-5, 8))))
    real_data.extend([None] * 6)  # No real data for the future
    
    # Generate synthetic forecast data (last 7 items starting from current)
    forecast_data = [None] * 12
    current_value = real_data[12]
    forecast_data.append(current_value) # Bridge
    for i in range(1, 7):
        # Escalate rapidly for the demo
        current_value = min(100, current_value + random.randint(2, 6))
        forecast_data.append(current_value)

    return jsonify({
        "labels": time_labels,
        "realFlow": real_data,
        "lstmForecast": forecast_data,
        "currentSeverity": "High" if current_value > 80 else "Normal",
        "etaStandstill": f"T-{max(0, (100 - current_value) * 2)}m"
    })

@app.route('/api/electoral/matrix')
def electoral_matrix():
    """Returns PoW scoring and Head-to-Head analytics based on simulated OSINT"""
    return jsonify({
        "pow": {
            "labels": ["Candidate A (Incumbent)", "Candidate B (Challenger)", "Candidate C (Independent)"],
            "data": [30 + random.randint(-5, 10), 55 + random.randint(-5, 10), 15 + random.randint(-5, 5)]
        },
        "radar": {
            "labels": ["Incumbency", "Party Strength", "Past Work", "Personal Base", "Religious/Caste", "Digital Sentiment"],
            "candidateA": [80, 70, 60, random.randint(70, 90), 50, random.randint(30, 50)],
            "candidateB": [20, 65, 85, random.randint(60, 80), 80, random.randint(80, 95)]
        }
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
