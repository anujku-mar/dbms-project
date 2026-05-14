"use client";

import { useState } from "react";

type Seat = {
    train_no: string;
    journey_date: string;
    class_code: string;
    available_seats: number;
    waitlist_count: number;
    quota: string;
};

export default function Home() {
    const [trainNo, setTrainNo] = useState("");
    const [date, setDate] = useState("");
    const [cls, setCls] = useState("3A");

    const [rows, setRows] = useState<Seat[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const searchSeats = async () => {
        if (!trainNo || !date || !cls) {
            setError("Please fill all fields.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const res = await fetch(
                `/api/seatavail?trainNo=${trainNo}&date=${date}&classCode=${cls}`
            );

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Failed.");
                setRows([]);
                return;
            }

            setRows(data.seats || []);
        } catch {
            setError("Something went wrong.");
            setRows([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={container}>
            <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
                <h1 style={title}>Seat Availability</h1>
                <p style={subtitle}>Check available seats instantly.</p>

                <div style={searchBox}>
                    <div style={field}>
                        <label style={label}>Train Number</label>
                        <input
                            placeholder="e.g. 12423"
                            value={trainNo}
                            onChange={(e) => setTrainNo(e.target.value)}
                            style={input}
                        />
                    </div>

                    <div style={field}>
                        <label style={label}>Journey Date</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            style={input}
                        />
                    </div>

                    <div style={field}>
                        <label style={label}>Class</label>
                        <select
                            value={cls}
                            onChange={(e) => setCls(e.target.value)}
                            style={select}
                        >
                            <option value="1A">1A - First AC</option>
                            <option value="2A">2A - Second AC</option>
                            <option value="3A">3A - Third AC</option>
                            <option value="SL">SL - Sleeper</option>
                            <option value="CC">CC - Chair Car</option>
                        </select>
                    </div>

                    <div style={{ marginLeft: "auto", display: "flex", alignItems: "flex-end" }}>
                        <button onClick={searchSeats} style={btn}>
                            {loading ? "Searching..." : "Search"}
                        </button>
                    </div>
                </div>

                {error && <div style={errorBox}>{error}</div>}

                {!loading && rows.length === 0 && !error && trainNo && (
                    <p style={{ color: "#94a3b8", marginTop: "10px" }}>
                        No seat data found.
                    </p>
                )}

                <div style={{ marginTop: "30px", display: "grid", gap: "20px" }}>
                    {rows.map((seat, i) => (
                        <div key={i} style={card}>
                            <div style={cardHeader}>
                                <h2 style={{ margin: 0 }}>
                                    Train {seat.train_no}
                                </h2>

                                <span style={badge}>
                                    {seat.class_code}
                                </span>
                            </div>

                            <p style={muted}>Date: {seat.journey_date}</p>
                            <p style={muted}>Quota: {seat.quota}</p>

                            <div style={statusBox}>
                                <div>
                                    Seats Available:{" "}
                                    <b>{seat.available_seats}</b>
                                </div>

                                <div>
                                    Waitlist: <b>{seat.waitlist_count}</b>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}


const container = {
    minHeight: "100vh",
    padding: "40px",
    background:
        "linear-gradient(135deg,#0f172a,#1e293b,#334155)",
    fontFamily: "Arial",
    color: "white"
};

const title = {
    fontSize: "42px",
    fontWeight: "bold"
};

const subtitle = {
    color: "#cbd5e1",
    marginBottom: "25px"
};

const searchBox = {
    display: "flex",
    gap: "14px",
    flexWrap: "wrap",
    background: "rgba(255,255,255,0.08)",
    padding: "20px",
    borderRadius: "16px"
};

const field = {
    display: "flex",
    flexDirection: "column" as const,
    gap: "6px",
    minWidth: "180px"
};

const label = {
    color: "#94a3b8",
    fontSize: "13px",
    fontWeight: "bold"
};

const input = {
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    background: "#0f172a",
    color: "white"
};

const select = {
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #334155",
    background: "#0f172a",
    color: "white"
};

const btn = {
    padding: "12px 22px",
    borderRadius: "10px",
    border: "none",
    background: "linear-gradient(90deg,#06b6d4,#3b82f6)",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold"
};

const errorBox = {
    background: "#7f1d1d",
    padding: "12px",
    borderRadius: "10px",
    marginTop: "20px"
};

const card = {
    background: "#1e293b",
    padding: "20px",
    borderRadius: "16px"
};

const cardHeader = {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px"
};

const badge = {
    background: "#1d4ed8",
    padding: "6px 12px",
    borderRadius: "999px",
    fontWeight: "bold"
};

const statusBox = {
    marginTop: "14px",
    background: "#0f172a",
    padding: "12px",
    borderRadius: "10px"
};

const muted = {
    color: "#94a3b8",
    fontSize: "14px"
};