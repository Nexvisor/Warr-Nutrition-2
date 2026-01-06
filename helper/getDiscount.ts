export function getDiscount(number: number, discount: number) {
  return Math.floor((number * discount) / 100);
}
