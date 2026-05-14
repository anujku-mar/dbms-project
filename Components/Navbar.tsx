"use client";
import AIAssistant from "./AIAssistant";
import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
    const [open, setOpen] = useState(false);

    return (
        <>
            {/* Top Navbar */}
            <nav
                style={{
                    background: "#111827",
                    color: "white",
                    padding: "14px 20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    position: "sticky",
                    top: 0,
                    zIndex: 1000,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.25)"
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "14px"
                    }}
                >
                    {/* Hamburger Toggle */}
                    <button
                        onClick={() => setOpen(!open)}
                        style={{
                            background: "transparent",
                            border: "none",
                            color: "white",
                            fontSize: "28px",
                            cursor: "pointer"
                        }}
                    >
                        ☰
                    </button>

                    <h2
                        style={{
                            margin: 0,
                            fontSize: "24px",
                            fontWeight: "bold"
                        }}
                    >
                        Smart Rail Portal
                    </h2>
                </div>

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px"
                    }}
                >
                    <span
                        style={{
                            color: "#9ca3af",
                            fontSize: "14px"
                        }}
                    >
                        Railway System
                    </span>

                    <AIAssistant />
                </div>
            </nav>

            {/*How to ovelay the panel..? */}
            {open && (
                <div
                    onClick={() => setOpen(false)}
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        background: "rgba(0,0,0,0.45)",
                        zIndex: 998
                    }}
                />
            )}

            {/* Side Panel */}
            <div
                style={{
                    position: "fixed",
                    top: "64px",
                    left: open ? "0" : "-290px",
                    width: "280px",
                    height: "calc(100% - 64px)",
                    background: "#0f172a",
                    color: "white",
                    padding: "24px",
                    transition: "0.3s ease",
                    zIndex: 999,
                    boxShadow: "4px 0 20px rgba(0,0,0,0.35)"
                }}
            >
                {/* Links */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "14px"
                    }}
                >
                    <Link href="/" onClick={() => setOpen(false)} style={linkStyle}>
                        Home
                    </Link>
                    <Link href="/search" onClick={() => setOpen(false)} style={linkStyle}>
                        Search
                    </Link>

                    <Link href="/fares" onClick={() => setOpen(false)} style={linkStyle}>
                        Fares
                    </Link>

                    <Link href="/stations" onClick={() => setOpen(false)} style={linkStyle}>
                        Get Station Details
                    </Link>

                    <Link href="/days" onClick={() => setOpen(false)} style={linkStyle}>
                        Get Train Details
                    </Link>
                    <Link href="/livestatus" onClick={() => setOpen(false)} style={linkStyle}>
                        Live Status
                    </Link>
                    <Link href="/seatavail" onClick={() => setOpen(false)} style={linkStyle}>
                        Seat Availibility
                    </Link>
                    <Link href="/booking" onClick={() => setOpen(false)} style={linkStyle}>
                        Book Trains
                    </Link>


                    
                </div>
            </div>
        </>
    );
}

const linkStyle = {
    color: "white",
    textDecoration: "none",
    padding: "12px 14px",
    borderRadius: "10px",
    background: "#1e293b",
    fontSize: "16px"
};