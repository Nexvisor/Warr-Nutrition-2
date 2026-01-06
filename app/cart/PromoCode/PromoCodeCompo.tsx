import { Input } from "@/components/ui/input";
import React, { useEffect, useTransition } from "react";

import { CustomToast } from "@/app/component/comman/customToast";
import { PromoCodeInfoType } from "@/constant/PromoCode";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/utils/store";
import { Spinner } from "@/app/component/Spinner/Spinner";
interface PromoCodeCompoProps {
  promoCode: string;
  setPromoCode: React.Dispatch<React.SetStateAction<string>>;
  promoApplied: PromoCodeInfoType;
  setPromoApplied: React.Dispatch<React.SetStateAction<PromoCodeInfoType>>;
}

function PromoCodeCompo({
  promoCode,
  setPromoCode,
  promoApplied,
  setPromoApplied,
}: PromoCodeCompoProps) {
  // Cleaning the promoApplied state beacuse if the use not add the promo code then and
  // PromoApplied state has data then this cause problem so, we have to clean the state
  useEffect(() => {
    if (promoCode.length !== 7 && promoApplied.discount !== 0) {
      setPromoApplied({ code: "", discount: 0 });
    }
  }, [promoCode]);
  const [isPending, startTransition] = useTransition();
  const user = useSelector((state: RootState) => state.dataSlice.userInfo);

  function applyPromoCode() {
    // if promo code is applied and user is clicking the apply button again and again ,
    // so to prevent it we check that if promo code is already applied then don't allow the user to apply promo code again
    if (promoApplied.discount !== 0) {
      return;
    }
    startTransition(async () => {
      const res = await axios.get(
        `/api/promo/validatePromoCode?code=${promoCode}&userId=${user.id}`
      );
      const { success, isPromoCodeUsed, promoCodeInfo, message } = res.data;
      if (!success) {
        CustomToast({ type: "error", message });
        return;
      }
      if (isPromoCodeUsed) {
        CustomToast({
          type: "error",
          message: `You already used ${promoCode} promo code`,
        });
        return;
      }
      setPromoApplied(promoCodeInfo);
      CustomToast({
        type: "success",
        message: `${promoCode} promo code applied successfully`,
      });
    });
  }
  return (
    <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3">
      <Input
        placeholder="Promo code"
        value={promoCode}
        onChange={(e) =>
          setPromoCode(String(e.target.value).toLocaleUpperCase())
        }
        className="
          h-10
          border-rose-300
          bg-white
          text-rose-900
          placeholder:text-rose-400
          focus-visible:ring-1
          focus-visible:ring-rose-400
          font-bold
        "
      />

      <button
        className="
    h-10
    px-4
    rounded-md
    bg-rose-500
    text-white
    text-sm
    font-medium
    transition
    hover:bg-rose-600
    active:scale-95
    disabled:bg-rose-300
    disabled:cursor-not-allowed
    disabled:active:scale-100
    flex items-center justify-center gap-2
  "
        disabled={promoCode.length < 7 || isPending}
        onClick={applyPromoCode}
      >
        {isPending ? (
          <>
            <Spinner size={14} />
            Applying
          </>
        ) : (
          "Apply"
        )}
      </button>
    </div>
  );
}

export default PromoCodeCompo;
