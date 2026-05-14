import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { exec } from "child_process";

function predictDelay(trainNumber: string, day_of_week : string) : Promise<{ predicted_delay: number }> {
    return new Promise((resolve, reject) => {
        exec(`python ml/predict.py ${trainNumber} ${day_of_week}`, (error, stdout) => {
            if (error) {
                reject(error);
            } else {
                resolve({ predicted_delay: parseInt(stdout.trim()) });
            }
        });
    });
}

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;

    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const day_of_week = searchParams.get("dayOfWeek");
    if (!from || !to) {
        return NextResponse.json(
            { error: "Missing station codes" },
            { status: 400 }
        );
    }
    if(!day_of_week){
        return NextResponse.json(
            {error: "Missing date"},
            {status: 400}
        );
    }

    const query = `
    SELECT DISTINCT s1.train_number, s1.train_name, s1.departure , s2.arrival
    FROM schedules s1
    JOIN schedules s2
      ON s1.train_number = s2.train_number
    WHERE s1.station_code = ?
      AND s2.station_code = ?
  `;

    const [rows] = await db.query(query, [from, to]);

    type Train = {
        train_number: string
        train_name: string
        departure: string
        arrival: string
    }

    type TrainWithDelay = Train & {
        predicted_delay: number
    }

    const trains: TrainWithDelay[] = [];

    for (const train of rows as Train[]) {

        const prediction = await predictDelay(train.train_number, day_of_week);

        trains.push({
            ...train,
            predicted_delay: prediction.predicted_delay
        });

    }

    return NextResponse.json({ trains });
}