import {
  IsEmail,
  IsIn,
  IsInt,
  IsPhoneNumber,
  IsString,
  Length,
  Matches,
  Max,
  Min
} from "class-validator";
import { constraint, Transform } from "@v";

export class TicketPaymentDto {
  // personal
  @constraint(null, true, [Length, IsString], [[5, 32]])
  name!: string;
  @constraint(null, true, IsIn, ["MALE", "FEMALE"])
  gender!: "MALE" | "FEMALE";
  @constraint(null, false, IsString)
  birthdate?: string;

  // reachability
  @constraint(null, true, [IsEmail, IsString])
  email!: string;
  @constraint(null, true, [Matches, IsPhoneNumber, IsString], /^\+[0-9]+$/)
  wa_nu!: string;

  // status
  @constraint(null, true, IsIn, [
    ["STUDENT", "STEM_STUDENT", "UNDER_GRADUATE", "GRADUATE"]
  ])
  role!: "STUDENT" | "STEM_STUDENT" | "UNDER_GRADUATE" | "GRADUATE";
  @constraint(null, true, [Length, IsString], [[3, 128]])
  school_or_uni!: string;
  @constraint(null, false, IsString)
  interests?: string; // needs extra external validation (later)

  // payment
  @constraint(null, true, [Matches, IsString], /^01([0-2]|5)[0-9]{8}$/)
  charging_nu!: string;
  // @constraint(null, false, IsString)
  // promocode?: string; // needs extra external validation (later)

  // others
  @constraint(null, true, [Max, Min, IsInt], [27, 1])
  @Transform((v) => parseInt(v.value), { toClassOnly: true })
  governorate!: number;
  @constraint(null, true, [Length, IsString], [[5, 256]])
  question!: string;
}

export class TicketPaymentCheckDto {
  @constraint(null, true, IsIn, ["email", "wa_nu"])
  field!: string;
  @constraint(null, true, IsString)
  value!: string;
}
