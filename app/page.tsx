"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Train = {
    train_number: string;
    train_name: string;
    departure: string;
    arrival: string;
    predicted_delay: number;
};

export default function Home() {
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [date, setDate] = useState("");
    const [trains, setTrains] = useState<Train[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const router = useRouter();

    const searchTrains = async () => {
        if (!from || !to) {
            setError("Please enter both station codes.");
            return;
        }

        if (!date) {
            setError("Please select a date.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const selectedDate = new Date(date);
            const dayOfWeekInt = selectedDate.getDay();
            const dayOfWeek = dayOfWeekInt === 0 ? 7 : dayOfWeekInt;

            const res = await fetch(
                `/api/trains?from=${from}&to=${to}&dayOfWeek=${dayOfWeek}`
            );

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Failed to fetch trains.");
                setTrains([]);
                return;
            }

            setTrains(data.trains || []);
        } catch (err) {
            console.error(err);
            setError("An error occurred while searching.");
            setTrains([]);
        } finally {
            setLoading(false);
        }
    };

    const getDayName = (dateString: string) => {
        if (!dateString) return "";

        const days = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday"
        ];

        return days[new Date(dateString).getDay()];
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                padding: "40px",
                fontFamily: "Arial, sans-serif",
                background:
                    "linear-gradient(135deg, #0f172a 0%, #1e293b 45%, #334155 100%)",
                color: "white"
            }}
        >
            <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
                <h1 style={{ fontSize: "42px", marginBottom: "10px", fontWeight: "bold" }}>
                    Smart Train Search with ML Prediction
                </h1>

                <p style={{ color: "#cbd5e1", marginBottom: "30px" }}>
                    Search trains and ML-predicted delays instantly.
                </p>

                {/* SEARCH BOX */}
                <div
                    style={{
                        background: "rgba(255,255,255,0.08)",
                        padding: "24px",
                        borderRadius: "16px",
                        marginBottom: "30px",
                        backdropFilter: "blur(8px)"
                    }}
                >
                    <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                        <input
                            placeholder="From (e.g., GHY)"
                            value={from}
                            onChange={(e) => setFrom(e.target.value.toUpperCase())}
                            style={inputStyle}
                        />

                        <input
                            placeholder="To (e.g., NDLS)"
                            value={to}
                            onChange={(e) => setTo(e.target.value.toUpperCase())}
                            style={inputStyle}
                        />

                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            style={inputStyle}
                        />

                        <button onClick={searchTrains} disabled={loading} style={searchBtn}>
                            {loading ? "Searching..." : "Search"}
                        </button>
                    </div>

                    {date && (
                        <div style={{ marginTop: "14px", color: "#cbd5e1" }}>
                            Selected Day: {getDayName(date)}
                        </div>
                    )}
                </div>

                {/* ERROR */}
                {error && (
                    <div style={{ background: "#7f1d1d", padding: "12px", borderRadius: "10px", marginBottom: "20px" }}>
                        {error}
                    </div>
                )}

                {/* NO RESULTS */}
                {!loading && trains.length === 0 && !error && from && to && date && (
                    <div style={{ color: "#cbd5e1", padding: "20px" }}>
                        No trains found for this route.
                    </div>
                )}

                {/* RESULTS */}
                <div style={{ display: "grid", gap: "18px" }}>
                    {trains.map((train) => (
                        <div key={train.train_number} style={cardStyle}>
                            <div style={cardHeader}>
                                <h2 style={{ margin: 0 }}>{train.train_name}</h2>

                                <span style={badge}>
                                    {train.train_number}
                                </span>
                            </div>

                            <div style={{ color: "#6b7280", marginBottom: "16px" }}>
                                {train.departure} → {train.arrival}
                            </div>

                            <div
                                style={{
                                    background:
                                        train.predicted_delay > 20 ? "#fef2f2" : "#ecfdf5",
                                    padding: "14px",
                                    borderRadius: "12px"
                                }}
                            >
                                <div style={{ fontSize: "13px" }}>
                                    Predicted Delay
                                </div>

                                <div style={{ fontSize: "24px", fontWeight: "bold" }}>
                                    {train.predicted_delay} min
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                
                    <div style={{ marginTop: "30px", display: "flex", justifyContent: "center" }}>
                        <button
                            onClick={() => router.push("/analytics")}
                            style={analyticsBtn}
                        >
                            📊 View Analytics Dashboard
                        </button>
                    </div>
            
            </div>
        </div>
    );
}

/* STYLES */
const inputStyle = {
    padding: "12px",
    flex: 1,
    minWidth: "200px",
    borderRadius: "10px",
    border: "none",
    outline: "none"
};

const searchBtn = {
    padding: "12px 24px",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
    background: "linear-gradient(90deg,#06b6d4,#3b82f6)",
    color: "white",
    fontWeight: "bold"
};

const analyticsBtn = {
    padding: "14px 28px",
    borderRadius: "12px",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    background: "linear-gradient(90deg,#22c55e,#16a34a)",
    color: "white",
    boxShadow: "0 8px 20px rgba(0,0,0,0.25)"
};

const cardStyle = {
    background: "white",
    color: "#111827",
    padding: "22px",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.18)"
};

const cardHeader = {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px"
};

const badge = {
    background: "#dbeafe",
    color: "#1d4ed8",
    padding: "6px 12px",
    borderRadius: "999px",
    fontWeight: "bold"
};