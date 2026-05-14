import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;

    const from = searchParams.get("from");
    const to = searchParams.get("to");

    if (!from || !to) {
        return NextResponse.json(
            { error: "Missing station codes" },
            { status: 400 }
        );
    }

    try {
        const query = `
        SELECT train_no, from_station, to_station, class_code, base_fare, tatkal_fare
        FROM fares
        WHERE from_station = ?
          AND to_station = ?
        `;

        const [rows] = await db.query(query, [from, to]);

        return NextResponse.json({ fares: rows });

    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { error: "Failed to fetch fares" },
            { status: 500 }
        );
    }
}