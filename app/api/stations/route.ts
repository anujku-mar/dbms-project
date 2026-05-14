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
        SELECT station_code, station_name, state, zone, latitude, longitude
        FROM stations
        WHERE station_code LIKE ?
           OR station_name LIKE ?
           OR state LIKE ?
        LIMIT 20
        `;

        const value = `%${search}%`;

        const [rows] = await db.query(query, [
            value,
            value,
            value
        ]);

        return NextResponse.json({ stations: rows });

    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { error: "Failed to fetch stations" },
            { status: 500 }
        );
    }
}