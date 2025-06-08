"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Currencies, Currency } from "@/lib/currencies";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import SkeletonWrapper from "./SkeletonWrapper";
import { UserSetting } from "@/lib/generated/prisma";
import { toast } from "sonner";
////import { useUserSettingQuery } from "@/lib/react-query/QueryMutation";

export function CurrencyComboBox() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  ////const { data: userSetting } = useUserSettingQuery();

  const queryClient = useQueryClient();

  //? Tanstack query
  const userSetting = useQuery<UserSetting>({
    queryKey: ["userSetting"],
    queryFn: () => fetch("/api/user-settings").then((res) => res.json()),
  });

  React.useEffect(() => {
    if (!userSetting.data) return;
    const userCurrency = Currencies.find(
      (currency) => currency.value === userSetting.data.currency
    );
    if (userCurrency) setValue(userCurrency.label);
  }, [userSetting.data]);

  const mutation = useMutation({
    mutationFn: async (currency: string) => {
      console.log("PATCH request starting with", currency);

      const res = await fetch("/api/user-settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currency }),
      });

      const data = await res.json();

      console.log("PATCH response:", res.status, data);

      if (!res.ok) {
        throw new Error(data.message || "Failed to update currency");
      }

      return data;
    },

    onSuccess: (data: UserSetting) => {
      toast.success(`Currency updated to ${data.currency} 🎉`, {
        id: "update-currency",
      });
      queryClient.invalidateQueries({ queryKey: ["userSetting"] });
      setValue(data.currency);
    },
    onError: (e) => {
      toast.error(`Error updating currency: ${e.message}`, {
        id: "update-currency",
      });
    },
  });

  const selectoption = React.useCallback(
    (currency: Currency | null) => {
      if (!currency) {
        toast.error("Please select a currency");
        return;
      }
      toast.loading("Updating the currency...", {
        id: "update-currency",
      });

      mutation.mutate(currency.value);
    },
    [mutation]
  );

  return (
    <SkeletonWrapper isLoading={userSetting.isFetching}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={mutation.isPending}
          >
            {value
              ? Currencies.find((currency) => currency.value === value)?.label
              : "Select Currency"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search Currency..." />
            <CommandList>
              <CommandEmpty>Not Supported</CommandEmpty>
              <CommandGroup>
                {Currencies.map((currency) => (
                  <CommandItem
                    key={currency.value}
                    value={currency.value}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue);
                      setOpen(false);
                      const selectedCurrency =
                        Currencies.find((c) => c.value === currentValue) ||
                        null;
                      selectoption(selectedCurrency);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === currency.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {currency.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </SkeletonWrapper>
  );
}
