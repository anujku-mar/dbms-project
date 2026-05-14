"use client";

import { useState } from "react";

type Train = {
    train_no: string;
    train_name: string;
    train_type: string;
    origin_station: string;
    dest_station: string;
    running_days: string;

    from_departure: string;
    from_arrival: string;

    to_arrival: string;
    to_departure: string;
};

export default function Home() {
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [date, setDate] = useState("");

    const [trains, setTrains] = useState<Train[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const searchTrains = async () => {
        if (!from || !to || !date) {
            setError("Please fill all fields.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const selectedDate = new Date(date);

            let day = selectedDate.getDay();
            if (day === 0) day = 7;

            const res = await fetch(
                `/api/search?from=${from}&to=${to}&day=${day}`
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
            setError("Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    const getDayName = (dateString: string) => {
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
                <h1
                    style={{
                        fontSize: "42px",
                        marginBottom: "10px",
                        fontWeight: "bold"
                    }}
                >
                    Route Train Search
                </h1>

                <p
                    style={{
                        color: "#cbd5e1",
                        marginBottom: "30px"
                    }}
                >
                    Search trains between two stations with timings.
                </p>

                <div
                    style={{
                        background: "rgba(255,255,255,0.08)",
                        padding: "24px",
                        borderRadius: "16px",
                        marginBottom: "30px"
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            gap: "12px",
                            flexWrap: "wrap"
                        }}
                    >
                        <input
                            placeholder="from(e.g., AGAR)"
                            value={from}
                            onChange={(e) =>
                                setFrom(e.target.value.toUpperCase())
                            }
                            style={inputStyle}
                        />

                        <input
                            placeholder="to(e.g., GOP)"
                            value={to}
                            onChange={(e) =>
                                setTo(e.target.value.toUpperCase())
                            }
                            style={inputStyle}
                        />

                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            style={inputStyle}
                        />

                        <button
                            onClick={searchTrains}
                            disabled={loading}
                            style={buttonStyle}
                        >
                            {loading ? "Searching..." : "Search"}
                        </button>
                    </div>

                    {date && (
                        <div
                            style={{
                                marginTop: "14px",
                                color: "#cbd5e1"
                            }}
                        >
                            Selected Day: {getDayName(date)}
                        </div>
                    )}
                </div>

                {error && (
                    <div
                        style={{
                            background: "#7f1d1d",
                            padding: "12px",
                            borderRadius: "10px",
                            marginBottom: "20px"
                        }}
                    >
                        {error}
                    </div>
                )}

                <div
                    style={{
                        display: "grid",
                        gap: "18px"
                    }}
                >
                    {trains.map((train) => (
                        <div
                            key={train.train_no}
                            style={{
                                background: "white",
                                color: "#111827",
                                padding: "22px",
                                borderRadius: "16px",
                                boxShadow:
                                    "0 10px 30px rgba(0,0,0,0.18)"
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    flexWrap: "wrap",
                                    gap: "10px",
                                    marginBottom: "12px"
                                }}
                            >
                                <h2
                                    style={{
                                        margin: 0,
                                        fontSize: "24px"
                                    }}
                                >
                                    {train.train_name}
                                </h2>

                                <span
                                    style={{
                                        background: "#dbeafe",
                                        color: "#1d4ed8",
                                        padding: "6px 12px",
                                        borderRadius: "999px",
                                        fontWeight: "bold"
                                    }}
                                >
                                    {train.train_no}
                                </span>
                            </div>

                            <div style={{ color: "#6b7280" }}>
                                Type: {train.train_type}
                            </div>

                            <div
                                style={{
                                    color: "#6b7280",
                                    marginTop: "6px"
                                }}
                            >
                                Route: {from} → {to}
                            </div>

                            <div
                                style={{
                                    marginTop: "16px",
                                    background: "#f8fafc",
                                    padding: "14px",
                                    borderRadius: "12px"
                                }}
                            >
                                <div
                                    style={{
                                        fontWeight: "bold",
                                        marginBottom: "10px",
                                        color: "#111827"
                                    }}
                                >
                                    Journey Timing
                                </div>

                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        flexWrap: "wrap",
                                        gap: "10px"
                                    }}
                                >
                                    <div>
                                        <div
                                            style={{
                                                fontSize: "13px",
                                                color: "#6b7280"
                                            }}
                                        >
                                            Departure from {from}
                                        </div>

                                        <div
                                            style={{
                                                fontWeight: "bold",
                                                fontSize: "18px"
                                            }}
                                        >
                                            {train.from_departure}
                                        </div>
                                    </div>

                                    <div>
                                        <div
                                            style={{
                                                fontSize: "13px",
                                                color: "#6b7280"
                                            }}
                                        >
                                            Arrival at {to}
                                        </div>

                                        <div
                                            style={{
                                                fontWeight: "bold",
                                                fontSize: "18px"
                                            }}
                                        >
                                            {train.to_arrival}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div
                                style={{
                                    marginTop: "10px",
                                    color: "#6b7280",
                                    fontSize: "14px"
                                }}
                            >
                                Runs: {train.running_days}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

const inputStyle = {
    padding: "12px",
    flex: 1,
    minWidth: "200px",
    borderRadius: "10px",
    border: "none",
    outline: "none"
};

const buttonStyle = {
    padding: "12px 24px",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
    background: "linear-gradient(90deg,#06b6d4,#3b82f6)",
    color: "white",
    fontWeight: "bold"
};