import { Doctor, Appointment } from "@/types";
import { User } from "@/types";

export const users: User[] = [];


export const doctors: Doctor[] = [
  {
    id: "1",
    name: "Dr. Sharma",
    specialization: "Cardiologist",
    schedulingType: "STREAM"
  },
  {
    id: "2",
    name: "Dr. Mehta",
    specialization: "Dermatologist",
    schedulingType: "WAVE"
  }
];

export const appointments: Appointment[] = [];
export const doctorLeaves: {
  doctorId: string;
  date: string;
}[] = [];
