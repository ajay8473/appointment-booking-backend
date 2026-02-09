import { NextResponse } from "next/server";
import { doctorLeaves, appointments } from "@/lib/data";

export async function POST(req: Request) {
  try {
    const { doctorId, date } = await req.json();

    if (!doctorId || !date) {
      return NextResponse.json(
        { message: "doctorId and date required" },
        { status: 400 }
      );
    }

    // Add leave entry
    doctorLeaves.push({ doctorId, date });

    // Bulk cancel all appointments on that date
    const affectedAppointments = appointments.filter(
      a =>
        a.doctorId === doctorId &&
        a.date === date &&
        a.status === "BOOKED"
    );

    affectedAppointments.forEach(a => {
      a.status = "CANCELLED";
    });

    return NextResponse.json({
      message: "Doctor leave applied. Appointments cancelled.",
      cancelledCount: affectedAppointments.length
    });

  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
