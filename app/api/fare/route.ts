import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const train_no = searchParams.get("train_no");
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    const [rows]: any = await db.query(
        `SELECT
            (SELECT cumulative_price FROM train_schedule_price WHERE train_no = ? AND station_code = ?) AS to_price,
            (SELECT cumulative_price FROM train_schedule_price WHERE train_no = ? AND station_code = ?) AS from_price`,
        [train_no, to, train_no, from]
    );

    if (!rows.length || rows[0].to_price === null || rows[0].from_price === null) {
        return NextResponse.json({ fare: null });
    }

    const fare = Math.abs(parseFloat(rows[0].to_price) - parseFloat(rows[0].from_price));
    return NextResponse.json({ fare });
}