export const getActualPrice = (price: number, discount: number) => {
  return Math.floor(price - (price * discount) / 100);
};
