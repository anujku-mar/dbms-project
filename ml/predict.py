import joblib
import sys
import mysql.connector
import pandas as pd
import os

if len(sys.argv) < 3:
    print(0)
    sys.exit()

train_number = int(sys.argv[1])
day_of_week = int(sys.argv[2])

BASE_DIR = os.path.dirname(__file__)
model_path = os.path.join(BASE_DIR, "delay_model.pkl")

model = joblib.load(model_path)

conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database="railways"
)

cursor = conn.cursor()

query = """
        SELECT
            AVG(distance_km),
            AVG(num_scheduled_stops),
            AVG(fog_risk_score),
            AVG(zone_congestion_index),
            AVG(route_historical_ontime_pct),
            AVG(late_incoming_rake)
        FROM ir_trains
        WHERE train_number = %s AND day_of_week = %s 
        """

cursor.execute(query, (train_number, day_of_week))
row = cursor.fetchone()

if row is None or row[0] is None:
    print(0)
    sys.exit()

features = {
    "zone_congestion_index": float(row[3]),
    "num_scheduled_stops": float(row[1]),
    "distance_km": float(row[0]),
    "fog_risk_score": float(row[2]),
    "route_historical_ontime_pct": float(row[4]),
    "late_incoming_rake": float(row[5])
}

input_df = pd.DataFrame([features])

input_df = input_df[
    [
        "zone_congestion_index",
        "num_scheduled_stops",
        "distance_km",
        "fog_risk_score",
        "route_historical_ontime_pct",
        "late_incoming_rake"
    ]
]

prediction = model.predict(input_df)[0]

print(int(prediction))