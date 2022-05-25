import { isEmail, isPhoneNumber } from "class-validator";

export function checkEmail(email: string): boolean {
  return isEmail(email);
}

export function checkWaNu(waNu: string): boolean {
  return waNu.match(/^\+[0-9]+$/) !== null && isPhoneNumber(waNu);
}
