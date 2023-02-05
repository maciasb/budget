import { EXPENSE_TYPE_ENUM } from "./enums";

export const GetAmount = (expenseType: EXPENSE_TYPE_ENUM, amount: number): number => {
  const sanitizedAmount = expenseType === EXPENSE_TYPE_ENUM.EXPENSE ? -amount: amount;
  return parseFloat(Number(sanitizedAmount).toFixed(2));
}; 
