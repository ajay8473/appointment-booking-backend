import { NextResponse } from "next/server";
import { appointments } from "@/lib/data";

export async function POST(req: Request) {
  try {
    const { appointmentId } = await req.json();

    if (!appointmentId) {
      return NextResponse.json(
        { message: "Appointment ID required" },
        { status: 400 }
      );
    }

    const appointment = appointments.find(
      a => a.id === appointmentId
    );

    if (!appointment) {
      return NextResponse.json(
        { message: "Appointment not found" },
        { status: 404 }
      );
    }

    if (appointment.status === "CANCELLED") {
      return NextResponse.json(
        { message: "Appointment already cancelled" },
        { status: 400 }
      );
    }

    appointment.status = "CANCELLED";

    return NextResponse.json({
      message: "Appointment cancelled successfully",
      data: appointment
    });

  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
