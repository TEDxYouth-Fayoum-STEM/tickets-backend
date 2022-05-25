export interface ITicketPayment {
  // personal
  name: string;
  gender: "MALE" | "FEMALE";
  birthdate?: number;
  profile_img?: Record<string, unknown>;
  // reachability
  email: string;
  wa_nu: string;
  // status
  role: "STUDENT" | "STEM_STUDENT" | "UNDER_GRADUATE" | "GRADUATE";
  schoolOrUni: string;
  interests?: string;
  // payment
  charging_nu: string;
  receipt_img: Record<string, unknown>;
  // promocode?: string;
  // others
  governorate: number;
  question: string;
}
