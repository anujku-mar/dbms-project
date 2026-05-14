"use client";

import { useState } from "react";

type Train = {
    train_no: string;
    train_name: string;
    train_type: string;
    running_days: string;
    from_departure: string;
    to_arrival: string;
    fare?: number; // added
};

type ConfirmState = {
    train: Train;
} | null;

export default function Home() {
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [date, setDate] = useState("");
    const [classCode, setClassCode] = useState("3A");
    const [passengers, setPassengers] = useState(1);

    const [trains, setTrains] = useState<Train[]>([]);
    const [loading, setLoading] = useState(false);
    const [bookingLoading, setBookingLoading] = useState("");
    const [confirm, setConfirm] = useState<ConfirmState>(null);

    const searchTrains = async () => {
        if (!from || !to || !date) {
            alert("Fill all fields");
            return;
        }

        const d = new Date(date);
        let day = d.getDay();
        if (day === 0) day = 7;

        setLoading(true);

        const res = await fetch(`/api/search?from=${from}&to=${to}&day=${day}`);
        const data = await res.json();
        const rawTrains: Train[] = data.trains || [];

        // Fetch fare for each train from schedule_price
        const withFares = await Promise.all(
            rawTrains.map(async (t) => {
                try {
                    const fr = await fetch(
                        `/api/fare?train_no=${t.train_no}&from=${from}&to=${to}`
                    );
                    const fd = await fr.json();
                    return { ...t, fare: fd.fare ?? undefined };
                } catch {
                    return t;
                }
            })
        );

        setTrains(withFares);
        setLoading(false);
    };

    const bookTrain = async () => {
        if (!confirm) return;
        const train_no = confirm.train.train_no;

        setConfirm(null);
        setBookingLoading(train_no);

        const res = await fetch("/api/booking", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                train_no,
                journey_date: date,
                from_station: from,
                to_station: to,
                class_code: classCode,
                passenger_count: passengers
            })
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.error);
        } else {
            alert(`✅ Booking Successful!\nPNR: ${data.pnr}\nStatus: ${data.status}\nFare Paid: ₹${data.fare}`);
        }

        setBookingLoading("");
    };

    return (
        <div style={container}>
            <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
                <h1 style={title}>Smart Rail Portal</h1>
                <p style={subtitle}>Search trains and book your seat instantly.</p>

                <div style={searchBox}>
                    <div style={field}>
                        <label style={label}>From</label>
                        <input placeholder="DBRG" value={from}
                            onChange={(e) => setFrom(e.target.value.toUpperCase())} style={input} />
                    </div>
                    <div style={field}>
                        <label style={label}>To</label>
                        <input placeholder="APUR" value={to}
                            onChange={(e) => setTo(e.target.value.toUpperCase())} style={input} />
                    </div>
                    <div style={field}>
                        <label style={label}>Journey Date</label>
                        <input type="date" value={date}
                            onChange={(e) => setDate(e.target.value)} style={input} />
                    </div>
                    <div style={field}>
                        <label style={label}>Class</label>
                        <select value={classCode} onChange={(e) => setClassCode(e.target.value)} style={select}>
                            <option value="1A">1A - First AC</option>
                            <option value="2A">2A - Second AC</option>
                            <option value="3A">3A - Third AC</option>
                            <option value="SL">SL - Sleeper</option>
                            <option value="CC">CC - Chair Car</option>
                        </select>
                    </div>
                    <div style={field}>
                        <label style={label}>Passengers</label>
                        <select value={passengers}
                            onChange={(e) => setPassengers(Number(e.target.value))} style={select}>
                            {[1, 2, 3, 4, 5, 6].map((p) => (
                                <option key={p} value={p}>{p} Passenger{p > 1 ? "s" : ""}</option>
                            ))}
                        </select>
                    </div>
                    <div style={{ alignSelf: "flex-end" }}>
                        <button onClick={searchTrains} style={searchBtn}>
                            {loading ? "Searching..." : "Search Trains"}
                        </button>
                    </div>
                </div>

                {/* Results */}
                <div style={{ marginTop: "30px" }}>
                    {trains.map((t) => (
                        <div key={t.train_no} style={card}>
                            <div style={cardHeader}>
                                <div>
                                    <h2 style={{ margin: 0 }}>{t.train_name}</h2>
                                    <p style={muted}>Type: {t.train_type}</p>
                                    <p style={muted}>{from} → {to}</p>
                                </div>
                                <div style={trainNo}>{t.train_no}</div>
                            </div>

                            <div style={timeBox}>
                                <div>
                                    <p style={muted}>Departure</p>
                                    <b>{t.from_departure}</b>
                                </div>
                                <div>
                                    <p style={muted}>Arrival</p>
                                    <b>{t.to_arrival}</b>
                                </div>
                                <div>
                                    <p style={muted}>Fare (per person)</p>
                                    <b style={{ color: "#4ade80" }}>
                                        {t.fare !== undefined ? `₹${t.fare}` : "—"}
                                    </b>
                                </div>
                            </div>

                            <p style={muted}>Runs: {t.running_days}</p>

                            <button
                                onClick={() => setConfirm({ train: t })}
                                style={bookBtn}
                                disabled={bookingLoading === t.train_no}
                            >
                                {bookingLoading === t.train_no ? "Booking..." : "Book Ticket"}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* CONFIRMATION MODAL */}
            {confirm && (
                <div style={overlay}>
                    <div style={modal}>
                        <h2 style={{ marginTop: 0, color: "white" }}>Confirm Booking</h2>

                        <div style={modalRow}>
                            <span style={muted}>Train</span>
                            <span style={{ color: "white" }}>{confirm.train.train_name} ({confirm.train.train_no})</span>
                        </div>
                        <div style={modalRow}>
                            <span style={muted}>Route</span>
                            <span style={{ color: "white" }}>{from} → {to}</span>
                        </div>
                        <div style={modalRow}>
                            <span style={muted}>Date</span>
                            <span style={{ color: "white" }}>{date}</span>
                        </div>
                        <div style={modalRow}>
                            <span style={muted}>Class</span>
                            <span style={{ color: "white" }}>{classCode}</span>
                        </div>
                        <div style={modalRow}>
                            <span style={muted}>Passengers</span>
                            <span style={{ color: "white" }}>{passengers}</span>
                        </div>
                        {confirm.train.fare !== undefined && (
                            <div style={modalRow}>
                                <span style={muted}>Total Fare</span>
                                <span style={{ color: "#4ade80", fontWeight: "bold" }}>
                                    ₹{(confirm.train.fare * passengers).toFixed(2)}
                                </span>
                            </div>
                        )}

                        <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
                            <button onClick={() => setConfirm(null)} style={cancelBtn}>Cancel</button>
                            <button onClick={bookTrain} style={confirmBtn}>Confirm & Book</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

/* STYLES — only new ones added below, nothing changed above */

const container = { minHeight: "100vh", padding: "40px", background: "linear-gradient(135deg,#0f172a,#1e293b,#334155)", fontFamily: "Arial" };
const title = { color: "white", fontSize: "40px", marginBottom: "8px" };
const subtitle = { color: "#cbd5e1", marginBottom: "20px" };
const searchBox = { display: "flex", gap: "12px", flexWrap: "wrap" as const, background: "rgba(255,255,255,0.08)", padding: "20px", borderRadius: "16px" };
const field = { display: "flex", flexDirection: "column" as const, gap: "6px", minWidth: "160px" };
const label = { color: "#94a3b8", fontSize: "13px", fontWeight: "bold" };
const input = { padding: "12px", borderRadius: "10px", border: "none", background: "#0f172a", color: "white" };
const select = { padding: "12px", borderRadius: "10px", border: "1px solid #334155", background: "#0f172a", color: "white" };
const searchBtn = { padding: "12px 20px", borderRadius: "10px", border: "none", background: "linear-gradient(90deg,#06b6d4,#3b82f6)", color: "white", cursor: "pointer", fontWeight: "bold" };
const card = { background: "#1e293b", color: "white", padding: "20px", borderRadius: "16px", marginBottom: "20px" };
const cardHeader = { display: "flex", justifyContent: "space-between" };
const trainNo = { fontWeight: "bold", color: "#60a5fa" };
const timeBox = { display: "flex", justifyContent: "space-between", marginTop: "12px", background: "#0f172a", padding: "12px", borderRadius: "10px" };
const bookBtn = { marginTop: "14px", padding: "10px 16px", background: "#22c55e", border: "none", borderRadius: "8px", color: "white", cursor: "pointer", fontWeight: "bold" };
const muted = { color: "#94a3b8", fontSize: "14px" };

// Modal styles
const overlay = { position: "fixed" as const, inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 };
const modal = { background: "#1e293b", borderRadius: "16px", padding: "28px", width: "380px", maxWidth: "90vw", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" };
const modalRow = { display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #334155" };
const cancelBtn = { flex: 1, padding: "10px", borderRadius: "8px", border: "1px solid #475569", background: "transparent", color: "#94a3b8", cursor: "pointer" };
const confirmBtn = { flex: 1, padding: "10px", borderRadius: "8px", border: "none", background: "#22c55e", color: "white", cursor: "pointer", fontWeight: "bold" };