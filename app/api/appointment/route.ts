import { NextResponse } from "next/server";
import { appointments, doctors, doctorLeaves } from "@/lib/data";
import { Appointment } from "@/types";
import { randomUUID } from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { doctorId, slot, date, patients } = body;

    // Basic validation
    if (!doctorId || !slot || !date || !patients) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!Array.isArray(patients) || patients.length === 0) {
      return NextResponse.json(
        { message: "Patients must be a non-empty array" },
        { status: 400 }
      );
    }

    // Family booking rule
    if (patients.length > 3) {
      return NextResponse.json(
        { message: "Maximum 3 patients allowed per appointment" },
        { status: 400 }
      );
    }

    const doctor = doctors.find(d => d.id === doctorId);

    if (!doctor) {
      return NextResponse.json(
        { message: "Doctor not found" },
        { status: 404 }
      );
    }

    // Count existing bookings for that slot
    const existingBookings = appointments.filter(
      a =>
        a.doctorId === doctorId &&
        a.slot === slot &&
        a.date === date &&
        a.status === "BOOKED"
    );

    if (doctor.schedulingType === "STREAM") {
      // Only 1 booking allowed
      if (existingBookings.length > 0) {
        return NextResponse.json(
          { message: "Slot already booked" },
          { status: 400 }
        );
      }
    }

    if (doctor.schedulingType === "WAVE") {
      // Max 3 bookings allowed
      if (existingBookings.length >= 3) {
        return NextResponse.json(
          { message: "Slot capacity full" },
          { status: 400 }
        );
      }
    }

    const newAppointment: Appointment = {
      id: randomUUID(),
      doctorId,
      slot,
      date,
      patients,
      status: "BOOKED"
    };

    appointments.push(newAppointment);

    return NextResponse.json({
      message: "Appointment booked successfully",
      data: newAppointment
    });

  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
