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
import { Category } from "@/lib/generated/prisma";
import { TransactionType } from "@/lib/type";
import { useQuery } from "@tanstack/react-query";
import React, { useCallback, useEffect } from "react";
import CategoryDialog from "./CategoryDialog";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  type: TransactionType;
  onChange: (val: string) => void;
}

function CategoryPicker({ type, onChange }: Props) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  useEffect(() => {
    if (!value) return;
    //? when thecategory changes, onChange callback gets called
    onChange(value);
  }, [onChange, value]);

  const categoryQuery = useQuery({
    //! if the parameters change the query gets refetched so do that we gave the param tyoe in querykey
    queryKey: ["category", type],
    queryFn: () =>
      fetch(`/api/category?type=${type}`).then((res) => res.json()),
  });

  //? get the data from the categoryQuery and set it to the value state
  const selectedCategory = categoryQuery?.data?.find(
    (category: Category) => category.name === value
  );

  const successCallBack = useCallback(
    (category: Category) => {
      setValue(category.name);
      setOpen((prev) => !prev);
    },
    [setOpen, setValue]
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between "
        >
          {selectedCategory ? (
            <CategoryRow category={selectedCategory} />
          ) : (
            "Select Category"
          )}
          <ChevronsUpDown className="ml-2 w-4 h-4 shrink-0 opacity-50 " />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0 ">
        <Command onSubmit={(e) => e.preventDefault()}>
          <CommandInput placeholder="Search category..." />
          <CategoryDialog type={type} onSuccessCallBack={successCallBack} />
          <CommandEmpty>
            <p>Category not found</p>
            <p className="text-xs text-muted-foreground ">
              Tip: Create a new category
            </p>
          </CommandEmpty>
          <CommandGroup>
            <CommandList>
              {categoryQuery?.data &&
                categoryQuery?.data?.map((category: Category) => (
                  <CommandItem
                    key={category.name}
                    onSelect={() => {
                      setValue(category.name);
                      setOpen((prev) => !prev);
                    }}
                  >
                    <CategoryRow category={category} />
                    <Check
                      className={cn(
                        "mr-2 w-4 h-4 opacity-0 ",
                        value === category.name && "opacity-100"
                      )}
                    />
                  </CommandItem>
                ))}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default CategoryPicker;

function CategoryRow({ category }: { category: Category }) {
  return (
    <div className="flex items-center gap-2 ">
      <span role="img">{category.icon} </span>
      <span>{category.name} </span>
    </div>
  );
}
