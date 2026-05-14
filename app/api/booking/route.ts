import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

function generatePNR() {
    return Math.floor(1000000000 + Math.random() * 9000000000);
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const {
            train_no,
            journey_date,
            from_station,
            to_station,
            class_code,
            passenger_count
        } = body;

        if (!train_no || !journey_date || !from_station || !to_station) {
            return NextResponse.json(
                { error: "Missing fields" },
                { status: 400 }
            );
        }

        // 🔹 Fare calculation
        const [fareRows]: any = await db.query(
            `
            SELECT
                (SELECT cumulative_price FROM train_schedule_price
                 WHERE train_no = ? AND station_code = ?) AS to_price,
                (SELECT cumulative_price FROM train_schedule_price
                 WHERE train_no = ? AND station_code = ?) AS from_price
            `,
            [train_no, to_station, train_no, from_station]
        );

        let fare_per_person = 100; // fallback
        if (
            fareRows.length > 0 &&
            fareRows[0].to_price !== null &&
            fareRows[0].from_price !== null
        ) {
            fare_per_person =
                parseFloat(fareRows[0].to_price) -
                parseFloat(fareRows[0].from_price);

            if (fare_per_person < 0) {
                fare_per_person = Math.abs(fare_per_person);
            }
        }

        const total_fare = parseFloat(
            (fare_per_person * passenger_count).toFixed(2)
        );

        // 🔹 Seat availability check
        const [rows]: any = await db.query(
            `
            SELECT available_seats, waitlist_count
            FROM seat_availability
            WHERE train_no = ?
              AND journey_date = ?
              AND class_code = ?
            `,
            [train_no, journey_date, class_code]
        );

        let booking_status = "CONFIRMED";

        // 🔥 NEW LOGIC
        if (rows.length > 0) {
            const seat = rows[0];

            booking_status =
                seat.available_seats >= passenger_count
                    ? "CONFIRMED"
                    : "WAITLIST";
        } else {
            // 👇 No seat data → still confirm
            booking_status = "CONFIRMED";
        }

        const pnr = generatePNR();

        // 🔹 Insert booking
        await db.query(
            `
            INSERT INTO bookings 
            (pnr, train_no, journey_date, from_station, to_station, class_code, passenger_count, booking_status, fare_paid)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
            [
                pnr,
                train_no,
                journey_date,
                from_station,
                to_station,
                class_code,
                passenger_count,
                booking_status,
                total_fare
            ]
        );

        // 🔹 Update seats ONLY if row exists
        if (rows.length > 0) {
            if (booking_status === "CONFIRMED") {
                await db.query(
                    `UPDATE seat_availability 
                     SET available_seats = available_seats - ?
                     WHERE train_no = ? AND journey_date = ? AND class_code = ?`,
                    [passenger_count, train_no, journey_date, class_code]
                );
            } else {
                await db.query(
                    `UPDATE seat_availability 
                     SET waitlist_count = waitlist_count + ?
                     WHERE train_no = ? AND journey_date = ? AND class_code = ?`,
                    [passenger_count, train_no, journey_date, class_code]
                );
            }
        }

        return NextResponse.json({
            success: true,
            pnr,
            status: booking_status,
            fare: total_fare
        });

    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { error: "Booking failed" },
            { status: 500 }
        );
    }
}