import { PromoCodeInfoType } from "@/constant/PromoCode";
import { CartItems } from "@/utils/DataSlice";
import { getActualPrice } from "./getActualPrice";
import { getDiscount } from "./getDiscount";

export function getTotalAmount(
  cartProducts: CartItems[],
  promoApplied: PromoCodeInfoType
) {
  let subtotal = 0;
  for (const item of cartProducts) {
    // If promo code is applied
    if (promoApplied.discount !== 0 && cartProducts.length === 1) {
      // if the user add only one product in the cart
      // then apply promo code Discount on the discount percent of the product
      // ex: if promoCode discount is 10 and product discount is 30 then after applying promo discount
      // the net discount is 33%

      subtotal += getActualPrice(
        item.product.price,
        item.product.discountPercentage +
          getDiscount(item.product.discountPercentage, promoApplied.discount)
      );
    } else {
      // Applying basic discount when promo code is not applied
      subtotal += getActualPrice(
        item.product.price,
        item.product.discountPercentage
      );
    }
  }
  // apply promo on subtotal for multiple products
  if (cartProducts.length > 1 && promoApplied.discount !== 0) {
    console.log("Multipule products");
    subtotal = getActualPrice(subtotal, promoApplied.discount);
  }
  return Math.round(subtotal);
}
