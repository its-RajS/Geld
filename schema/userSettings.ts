import { Currencies } from "@/lib/currencies";
import { error } from "console";
import { z } from "zod";

export const UpdateUserCurrencySchema = z.object({
  currency: z.custom((val) => {
    const found = Currencies.some((c) => c.value === val);
    if (!found) throw new Error(`invalid Currency: ${val}`);

    return val;
  }),
});
