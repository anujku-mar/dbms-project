"use client";

import { useState } from "react";

type StatusRow = {
    train_no: string;
    station_code: string;
    scheduled_arr: string;
    actual_arr: string;
    delay_minutes: number;
};

export default function Home() {
    const [trainNo, setTrainNo] = useState("");
    const [rows, setRows] = useState<StatusRow[]>([]);
    const [recordedAt, setRecordedAt] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const searchStatus = async () => {
        if (!trainNo) {
            setError("Please enter train number.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const res = await fetch(`/api/livestatus?trainNo=${trainNo}`);
            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Failed to fetch live status.");
                setRows([]);
                return;
            }

            setRows(data.status || []);
            setRecordedAt(data.recordedAt || "");
        } catch (err) {
            console.error(err);
            setError("An error occurred.");
            setRows([]);
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
                    "linear-gradient(135deg,#0f172a 0%,#1e293b 45%,#334155 100%)",
                color: "white"
            }}
        >
            <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
                <h1 style={{ fontSize: "42px",fontWeight: "bold", marginBottom: "10px" }}>
                    Live Train Status
                </h1>

                <p style={{ color: "#cbd5e1", marginBottom: "30px" }}>
                    Search station-wise arrival and delay details.
                </p>

                <div
                    style={{
                        background: "rgba(255,255,255,0.08)",
                        padding: "24px",
                        borderRadius: "16px",
                        marginBottom: "30px"
                    }}
                >
                    <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                        <input
                            placeholder="Enter Train Number"
                            value={trainNo}
                            onChange={(e) => setTrainNo(e.target.value)}
                            style={{
                                padding: "12px",
                                flex: 1,
                                minWidth: "220px",
                                borderRadius: "10px",
                                border: "none",
                                outline: "none"
                            }}
                        />

                        <button
                            onClick={searchStatus}
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

                {recordedAt && (
                    <div
                        style={{
                            background: "#1e293b",
                            padding: "14px",
                            borderRadius: "12px",
                            marginBottom: "18px",
                            color: "#cbd5e1"
                        }}
                    >
                        Last Recorded At: {recordedAt}
                    </div>
                )}
                {!loading && rows.length === 0 && !error && trainNo && (
                    <div
                        style={{
                            background: "#1e293b",
                            padding: "14px",
                            borderRadius: "12px",
                            color: "#cbd5e1",
                            marginBottom: "18px"
                        }}
                    >
                        No live status found for this train number.
                    </div>
                )}
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

                <div style={{ display: "grid", gap: "16px" }}>
                    {rows.map((row, index) => (
                    <div
                        key={index}
                        style={{
                            background: "white",
                            color: "#111827",
                            padding: "22px",
                            borderRadius: "16px",
                            boxShadow: "0 8px 20px rgba(0,0,0,0.15)"
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: "16px"
                            }}
                        >
                            <div>
                                <div
                                    style={{
                                        fontSize: "13px",
                                        color: "#6b7280",
                                        letterSpacing: "0.5px"
                                    }}
                                >
                                    STATION
                                </div>
                                <div
                                    style={{
                                        fontSize: "22px",
                                        fontWeight: "bold",
                                        color: "#0f172a"
                                    }}
                                >
                                    {row.station_code}
                                </div>
                            </div>

                            <div
                                style={{
                                    background: "#dbeafe",
                                    color: "#1d4ed8",
                                    padding: "6px 14px",
                                    borderRadius: "999px",
                                    fontWeight: "bold"
                                }}
                            >
                                {row.train_no}
                            </div>
                        </div>

                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr",
                                gap: "16px",
                                marginBottom: "18px"
                            }}
                        >
                            <div>
                                <div style={{ fontSize: "12px", color: "#6b7280" }}>
                                    Scheduled Arrival
                                </div>
                                <div style={{ fontSize: "16px", fontWeight: "600" }}>
                                    {new Date(row.scheduled_arr).toLocaleTimeString()}
                                </div>
                            </div>

                            <div>
                                <div style={{ fontSize: "12px", color: "#6b7280" }}>
                                    Actual Arrival
                                </div>
                                <div style={{ fontSize: "16px", fontWeight: "600" }}>
                                    {new Date(row.actual_arr).toLocaleTimeString()}
                                </div>
                            </div>
                        </div>

                        <div
                            style={{
                                background:
                                    row.delay_minutes > 0 ? "#fef2f2" : "#ecfdf5",
                                padding: "14px",
                                borderRadius: "12px",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center"
                            }}
                        >
                            <div
                                style={{
                                    fontSize: "13px",
                                    color:
                                        row.delay_minutes > 0
                                            ? "#b91c1c"
                                            : "#047857"
                                }}
                            >
                                Delay Status
                            </div>

                            <div
                                style={{
                                    fontSize: "22px",
                                    fontWeight: "bold",
                                    color:
                                        row.delay_minutes > 0
                                            ? "#991b1b"
                                            : "#065f46"
                                }}
                            >
                                {row.delay_minutes} min
                            </div>
                        </div>
                    </div>
                ))}
                </div>
            </div>
        </div>
    );
}