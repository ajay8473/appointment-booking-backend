import { NextResponse } from "next/server";
import { appointments, doctors } from "@/lib/data";

export async function POST(req: Request) {
  try {
    const { appointmentId, newSlot, newDate } = await req.json();

    if (!appointmentId || !newSlot || !newDate) {
      return NextResponse.json(
        { message: "Missing required fields" },
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
        { message: "Cannot reschedule cancelled appointment" },
        { status: 400 }
      );
    }

    const doctor = doctors.find(d => d.id === appointment.doctorId);

    if (!doctor) {
      return NextResponse.json(
        { message: "Doctor not found" },
        { status: 404 }
      );
    }

    // Check slot availability
    const existingBookings = appointments.filter(
      a =>
        a.doctorId === appointment.doctorId &&
        a.slot === newSlot &&
        a.date === newDate &&
        a.status === "BOOKED" &&
        a.id !== appointmentId
    );

    if (doctor.schedulingType === "STREAM") {
      if (existingBookings.length > 0) {
        return NextResponse.json(
          { message: "New slot already booked" },
          { status: 400 }
        );
      }
    }

    if (doctor.schedulingType === "WAVE") {
      if (existingBookings.length >= 3) {
        return NextResponse.json(
          { message: "New slot capacity full" },
          { status: 400 }
        );
      }
    }

    // Update appointment
    appointment.slot = newSlot;
    appointment.date = newDate;
    appointment.status = "RESCHEDULED";

    return NextResponse.json({
      message: "Appointment rescheduled successfully",
      data: appointment
    });

  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
