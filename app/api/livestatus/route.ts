import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams;
        const trainNo = searchParams.get("trainNo");

        if (!trainNo) {
            return NextResponse.json(
                { error: "Missing train number" },
                { status: 400 }
            );
        }

        const query = `
        SELECT
            train_no,
            station_code,
            scheduled_arr,
            actual_arr,
            delay_minutes,
            recorded_at
        FROM live_status
        WHERE train_no = ?
        ORDER BY id ASC
        `;

        const [rows]: any = await db.query(query, [trainNo]);

        const recordedAt =
            rows.length > 0 ? rows[0].recorded_at : "";

        return NextResponse.json({
            status: rows,
            recordedAt
        });

    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { error: "Failed to fetch live status" },
            { status: 500 }
        );
    }
}