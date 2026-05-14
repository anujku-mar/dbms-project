import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
    try {
        const params = req.nextUrl.searchParams;

        const trainNo = params.get("trainNo");
        const date = params.get("date");
        const classCode = params.get("classCode");

        if (!trainNo || !date || !classCode) {
            return NextResponse.json(
                { error: "Missing parameters" },
                { status: 400 }
            );
        }

        const query = `
        SELECT
            train_no,
            journey_date,
            class_code,
            available_seats,
            waitlist_count,
            quota
        FROM seat_availability
        WHERE train_no = ?
        AND journey_date = ?
        AND class_code = ?
        ORDER BY available_seats DESC
        `;

        const [rows]: any = await db.query(query, [
            trainNo,
            date,
            classCode
        ]);

        return NextResponse.json({
            seats: rows
        });

    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { error: "Failed to fetch seat data" },
            { status: 500 }
        );
    }
}