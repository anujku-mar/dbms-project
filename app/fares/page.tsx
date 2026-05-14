"use client";

import { useState } from "react";

type Fare = {
    train_no: string;
    from_station: string;
    to_station: string;
    class_code: string;
    base_fare: number;
    tatkal_fare: number;
};

export default function Home() {
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [fares, setFares] = useState<Fare[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const searchFares = async () => {
        if (!from || !to) {
            setError("Please enter both station codes.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const res = await fetch(`/api/fares?from=${from}&to=${to}`);
            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Failed to fetch fares.");
                setFares([]);
                return;
            }

            setFares(data.fares || []);
        } catch (err) {
            console.error(err);
            setError("An error occurred while searching.");
            setFares([]);
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
            <div
                style={{
                    maxWidth: "1000px",
                    margin: "0 auto"
                }}
            >
                <h1
                    style={{
                        fontSize: "42px",
                        marginBottom: "10px",
                        fontWeight: "bold"
                    }}
                >
                    Fare Finder
                </h1>

                <p
                    style={{
                        color: "#cbd5e1",
                        marginBottom: "30px",
                        fontSize: "16px"
                    }}
                >
                    Search train fares instantly with a smart railway dashboard.
                </p>

                <div
                    style={{
                        background: "rgba(255,255,255,0.08)",
                        padding: "24px",
                        borderRadius: "16px",
                        marginBottom: "30px",
                        backdropFilter: "blur(8px)"
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
                            placeholder="From (e.g., JTTN)"
                            value={from}
                            onChange={(e) =>
                                setFrom(e.target.value.toUpperCase())
                            }
                            style={{
                                padding: "12px",
                                flex: 1,
                                minWidth: "220px",
                                borderRadius: "10px",
                                border: "none",
                                outline: "none",
                                fontSize: "15px"
                            }}
                        />

                        <input
                            placeholder="To (e.g., FKM)"
                            value={to}
                            onChange={(e) =>
                                setTo(e.target.value.toUpperCase())
                            }
                            style={{
                                padding: "12px",
                                flex: 1,
                                minWidth: "220px",
                                borderRadius: "10px",
                                border: "none",
                                outline: "none",
                                fontSize: "15px"
                            }}
                        />

                        <button
                            onClick={searchFares}
                            disabled={loading}
                            style={{
                                padding: "12px 24px",
                                borderRadius: "10px",
                                border: "none",
                                cursor: "pointer",
                                background:
                                    "linear-gradient(90deg,#06b6d4,#3b82f6)",
                                color: "white",
                                fontWeight: "bold",
                                fontSize: "15px"
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

                {!loading &&
                    fares.length === 0 &&
                    !error &&
                    from &&
                    to && (
                        <div
                            style={{
                                color: "#cbd5e1",
                                padding: "20px"
                            }}
                        >
                            No fares found for this route.
                        </div>
                    )}

                <div
                    style={{
                        display: "grid",
                        gap: "18px"
                    }}
                >
                    {fares.map((fare, index) => (
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
                                        fontSize: "22px"
                                    }}
                                >
                                    🚆 Train {fare.train_no}
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
                                    Class {fare.class_code}
                                </span>
                            </div>

                            <div
                                style={{
                                    color: "#6b7280",
                                    marginBottom: "18px",
                                    fontSize: "15px"
                                }}
                            >
                                {fare.from_station} → {fare.to_station}
                            </div>

                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns:
                                        "repeat(auto-fit,minmax(180px,1fr))",
                                    gap: "12px"
                                }}
                            >
                                <div
                                    style={{
                                        background: "#ecfdf5",
                                        padding: "14px",
                                        borderRadius: "12px"
                                    }}
                                >
                                    <div
                                        style={{
                                            color: "#047857",
                                            fontSize: "13px"
                                        }}
                                    >
                                        Base Fare
                                    </div>

                                    <div
                                        style={{
                                            fontSize: "24px",
                                            fontWeight: "bold",
                                            color: "#065f46"
                                        }}
                                    >
                                        ₹{fare.base_fare}
                                    </div>
                                </div>

                                <div
                                    style={{
                                        background: "#fff7ed",
                                        padding: "14px",
                                        borderRadius: "12px"
                                    }}
                                >
                                    <div
                                        style={{
                                            color: "#c2410c",
                                            fontSize: "13px"
                                        }}
                                    >
                                        Tatkal Fare
                                    </div>

                                    <div
                                        style={{
                                            fontSize: "24px",
                                            fontWeight: "bold",
                                            color: "#9a3412"
                                        }}
                                    >
                                        ₹{fare.tatkal_fare}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}