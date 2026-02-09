export type SchedulingType = "WAVE" | "STREAM";

export type AppointmentStatus =
  | "BOOKED"
  | "CANCELLED"
  | "RESCHEDULED";

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  schedulingType: SchedulingType;
}

export interface Appointment {
  id: string;
  doctorId: string;
  slot: string;
  date: string;
  patients: string[];
  status: AppointmentStatus;
}
export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "PATIENT" | "DOCTOR";
}
