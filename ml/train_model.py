import pandas as pd
import lightgbm as lgb
from sklearn.model_selection import train_test_split
import joblib
from sklearn.metrics import mean_absolute_error



df = pd.read_csv("data/ir_trains.csv")

features = [
    "zone_congestion_index",
    "num_scheduled_stops",
    "distance_km",
    "fog_risk_score",
    "route_historical_ontime_pct",
    "late_incoming_rake"
]

X = df[features]
y = df["delay_minutes"]

X_train, X_test, y_train, y_test = train_test_split(X, y)

model = lgb.LGBMRegressor()

model.fit(X_train, y_train)
pred = model.predict(X_test)
mae = mean_absolute_error(y_test, pred)
print("MAE:", mae)
joblib.dump(model, "delay_model.pkl")
