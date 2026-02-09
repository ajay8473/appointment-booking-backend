import { NextResponse } from "next/server";
import { doctors, appointments } from "@/lib/data";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const doctor = doctors.find(d => d.id === id);

  if (!doctor) {
    return NextResponse.json(
      { message: "Doctor not found" },
      { status: 404 }
    );
  }

  const baseSlots = [
    "10:00-10:15",
    "10:15-10:30",
    "10:30-10:45",
    "10:45-11:00"
  ];

  const today = new Date().toISOString().split("T")[0];

  const slots = baseSlots.map(slot => {
    const bookedCount = appointments.filter(
      a =>
        a.doctorId === doctor.id &&
        a.slot === slot &&
        a.date === today &&
        a.status === "BOOKED"
    ).length;

    if (doctor.schedulingType === "STREAM") {
      return {
        slot,
        available: bookedCount === 0
      };
    }

    return {
      slot,
      available: bookedCount < 3,
      remainingCapacity: 3 - bookedCount
    };
  });

  return NextResponse.json({
    doctorId: doctor.id,
    schedulingType: doctor.schedulingType,
    date: today,
    slots
  });
}
