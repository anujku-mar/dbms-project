"use client";

import { useState } from "react";

type Station = {
    station_code: string;
    station_name: string;
    state: string;
    zone: string;
    latitude: number;
    longitude: number;
};

export default function Home() {
    const [search, setSearch] = useState("");
    const [stations, setStations] = useState<Station[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const searchStations = async () => {
        if (!search) {
            setError("Please enter station code or city name.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const res = await fetch(`/api/stations?search=${search}`);
            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Failed to fetch stations.");
                setStations([]);
                return;
            }

            setStations(data.stations || []);
        } catch (err) {
            console.error(err);
            setError("An error occurred while searching.");
            setStations([]);
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
                    Smart Station Search
                </h1>

                <p
                    style={{
                        color: "#cbd5e1",
                        marginBottom: "30px"
                    }}
                >
                    Search by station code or city/station name.
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
                            placeholder="Enter code or city (e.g., GHY / Dibrugarh)"
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
                            onClick={searchStations}
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

                {!loading && stations.length === 0 && !error && search && (
                    <div style={{ color: "#cbd5e1" }}>
                        No stations found.
                    </div>
                )}

                <div
                    style={{
                        display: "grid",
                        gap: "18px"
                    }}
                >
                    {stations.map((station, index) => (
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
                                    {station.station_name}
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
                                    {station.station_code}
                                </span>
                            </div>

                            <div style={{ color: "#6b7280" }}>
                                State: {station.state}
                            </div>

                            <div style={{ color: "#6b7280", marginTop: "6px" }}>
                                Zone: {station.zone}
                            </div>

                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    marginTop: "18px"
                                }}
                            >
                                <a
                                    href={`https://www.google.com/maps?q=${station.latitude},${station.longitude}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        background: "#10b981",
                                        color: "white",
                                        padding: "10px 16px",
                                        borderRadius: "10px",
                                        textDecoration: "none",
                                        fontWeight: "bold",
                                        fontSize: "14px"
                                    }}
                                >
                                    📍 View Map
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}