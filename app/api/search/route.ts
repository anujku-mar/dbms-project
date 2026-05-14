import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams;

        const from = searchParams.get("from");
        const to = searchParams.get("to");
        const day = searchParams.get("day");

        if (!from || !to || !day) {
            return NextResponse.json(
                { error: "Missing parameters" },
                { status: 400 }
            );
        }

        const dayMap: any = {
            "1": "Mon",
            "2": "Tue",
            "3": "Wed",
            "4": "Thu",
            "5": "Fri",
            "6": "Sat",
            "7": "Sun"
        };

        const dayName = dayMap[day];

        const query = `
        SELECT
            t.train_no,
            t.train_name,
            t.train_type,
            t.origin_station,
            t.dest_station,
            t.running_days,

            s1.departure_time AS from_departure,
            s1.arrival_time   AS from_arrival,

            s2.arrival_time   AS to_arrival,
            s2.departure_time AS to_departure

        FROM trains t

        JOIN train_schedule s1
            ON t.train_no = s1.train_no

        JOIN train_schedule s2
            ON t.train_no = s2.train_no

        WHERE s1.station_code = ?
          AND s2.station_code = ?
          AND s1.stop_number < s2.stop_number
          AND t.running_days LIKE ?

        ORDER BY t.train_no ASC
        `;

        const [rows]: any = await db.query(query, [
            from.toUpperCase(),
            to.toUpperCase(),
            `%${dayName}%`
        ]);

        return NextResponse.json({
            trains: rows
        });

    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { error: "Failed to fetch trains" },
            { status: 500 }
        );
    }
}