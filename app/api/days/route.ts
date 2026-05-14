import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const search = searchParams.get("search");

    if (!search) {
        return NextResponse.json(
            { error: "Missing search input" },
            { status: 400 }
        );
    }

    try {
        const query = `
        SELECT 
            train_no,
            train_name,
            train_type,
            origin_station,
            dest_station,
            running_days
            FROM trains
            WHERE train_no LIKE ?
            OR train_name LIKE ?
            LIMIT 20
        `;

        const value = `%${search}%`;

        const [rows] = await db.query(query, [
            value,
            value
        ]);

        return NextResponse.json({ trains: rows });

    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { error: "Failed to fetch running days" },
            { status: 500 }
        );
    }
}