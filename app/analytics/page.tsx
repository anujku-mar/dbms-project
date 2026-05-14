"use client";

export default function AnalyticsPage() {
    return (
        <div
            style={{
                minHeight: "100vh",
                padding: "40px",
                background:
                    "linear-gradient(135deg,#0f172a 0%,#1e293b 50%,#334155 100%)",
                color: "white",
                fontFamily: "Arial, sans-serif"
            }}
        >
            <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
                
                <h1 style={{ fontSize: "36px", marginBottom: "10px" }}>
                    📊 Analytics Dashboard
                </h1>

                <p style={{ color: "#cbd5e1", marginBottom: "30px" }}>
                    Insights from ML-based train delay prediction system.
                </p>

                {/* GRID */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "24px"
                    }}
                >

                    {/* CARD 1 */}
                    <div style={cardStyle}>
                        <h3>Top Delay Factors</h3>
                        <img src="/plots/feature_importance.jpeg" style={imgStyle} />
                    </div>

                    {/* CARD 2 */}
                    <div style={cardStyle}>
                        <h3>Zone-wise Delay</h3>
                        <img src="/plots/zone_delay.jpeg" style={imgStyle} />
                    </div>

                    {/* CARD 3 */}
                    <div style={cardStyle}>
                        <h3>Delay Distribution</h3>
                        <img src="/plots/distributions.jpeg" style={imgStyle} />
                    </div>

                    {/* CARD 4 */}
                    <div style={cardStyle}>
                        <h3>Correlation Heatmap</h3>
                        <img src="/plots/heatmap.jpeg" style={imgStyle} />
                    </div>

                    {/* <div
                        style={{
                            ...cardStyle,
                            gridColumn: "1 / -1"
                        }}
                    >
                        <h3>Delay Patterns by Train Type</h3>
                        <img src="/plots/train_types.jpeg" style={imgStyle} />
                    </div> */}

                </div>
            </div>
        </div>
    );
}

const cardStyle = {
    background: "white",
    color: "#111827",
    padding: "18px",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
};

const imgStyle = {
    width: "100%",
    borderRadius: "10px",
    marginTop: "10px"
};