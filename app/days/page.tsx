"use client";

import { useState } from "react";

type Train = {
    train_no: string;
    train_name: string;
    train_type: string;
    origin_station: string;
    dest_station: string;
    running_days: string;
};

export default function Home() {
    const [search, setSearch] = useState("");
    const [trains, setTrains] = useState<Train[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const searchTrain = async () => {
        if (!search) {
            setError("Please enter train number or train name.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const res = await fetch(`/api/days?search=${search}`);
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
            <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
                <h1
                    style={{
                        fontSize: "42px",
                        marginBottom: "10px",
                        fontWeight: "bold"
                    }}
                >
                    Running Days Search
                </h1>

                <p
                    style={{
                        color: "#cbd5e1",
                        marginBottom: "30px"
                    }}
                >
                    Search by train number or train name.
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
                            placeholder="Enter train no or name"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{
                                padding: "12px",
                                flex: 1,
                                minWidth: "260px",
                                borderRadius: "10px",
                                border: "none",
                                outline: "none"
                            }}
                        />

                        <button
                            onClick={searchTrain}
                            disabled={loading}
                            style={{
                                padding: "12px 24px",
                                borderRadius: "10px",
                                border: "none",
                                cursor: "pointer",
                                background:
                                    "linear-gradient(90deg,#06b6d4,#3b82f6)",
                                color: "white",
                                fontWeight: "bold"
                            }}
                        >
                            {loading ? "Searching..." : "Search"}
                        </button>
                    </div>
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

                {!loading && trains.length === 0 && !error && search && (
                    <div style={{ color: "#cbd5e1" }}>
                        No trains found.
                    </div>
                )}

                <div
                    style={{
                        display: "grid",
                        gap: "18px"
                    }}
                >
                    {trains.map((train, index) => (
                        <div
                            key={index}
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

                            <div style={{ color: "#6b7280", marginTop: "6px" }}>
                                Route: {train.origin_station} → {train.dest_station}
                            </div>

                            <div
                                style={{
                                    marginTop: "16px",
                                    background: "#ecfdf5",
                                    padding: "14px",
                                    borderRadius: "12px"
                                }}
                            >
                                <div
                                    style={{
                                        fontSize: "13px",
                                        color: "#047857"
                                    }}
                                >
                                    Running Days
                                </div>

                                <div
                                    style={{
                                        fontSize: "22px",
                                        fontWeight: "bold",
                                        color: "#065f46"
                                    }}
                                >
                                    {train.running_days}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}