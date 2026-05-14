"use client";

import { useState } from "react";

export default function AIAssistant() {
    const [open, setOpen] = useState(false);
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [loading, setLoading] = useState(false);

    const askAI = async () => {
        if (!question.trim()) return;

        setLoading(true);
        setAnswer("");

        try {
            const res = await fetch("/api/ai", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ question })
            });

            const data = await res.json();
            setAnswer(data.reply || "No reply.");
        } catch {
            setAnswer("AI unavailable.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setOpen(!open)}
                style={{
                    background: "#2563eb",
                    color: "white",
                    border: "none",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    cursor: "pointer",
                    fontWeight: "bold"
                }}
            >
                AI
            </button>

            {open && (
                <div
                    style={{
                        position: "fixed",
                        top: "70px",
                        right: "20px",
                        width: "340px",
                        background: "#0f172a",
                        color: "white",
                        padding: "18px",
                        borderRadius: "14px",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
                        maxHeight: "80vh",
                        overflowY: "auto",
                        zIndex: 9999
                    }}
                >
                    <h3 style={{ marginBottom: "12px" }}>
                        Smart Rail AI
                    </h3>

                    <input
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="Ask train/station question..."
                        style={{
                            width: "100%",
                            padding: "10px",
                            borderRadius: "8px",
                            border: "none",
                            marginBottom: "10px"
                        }}
                    />

                    <button
                        onClick={askAI}
                        style={{
                            width: "100%",
                            padding: "10px",
                            background: "#06b6d4",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer"
                        }}
                    >
                        {loading ? "Thinking..." : "Ask AI"}
                    </button>

                    {answer && (
                        <div
                            style={{
                                marginTop: "14px",
                                background: "#1e293b",
                                padding: "12px",
                                borderRadius: "10px",
                                whiteSpace: "pre-wrap"
                            }}
                        >
                            {answer}
                        </div>
                    )}
                </div>
            )}
        </>
    );
}