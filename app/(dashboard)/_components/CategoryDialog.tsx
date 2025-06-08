"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TransactionType } from "@/lib/type";
import { cn } from "@/lib/utils";
import { CategorySchema, CategorySchemaType } from "@/schema/category";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleOff, Loader2, PlusSquare } from "lucide-react";
import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { ServerCategories } from "../_action/categories";
import { Category } from "@/lib/generated/prisma";
import { toast } from "sonner";
import { ServerCategories } from "../_action/categories";
import { useTheme } from "next-themes";

interface Props {
  type: TransactionType;
  onSuccessCallBack: (data: Category) => void;
}

function CategoryDialog({ type, onSuccessCallBack }: Props) {
  const [open, setOpen] = React.useState(false);
  const form = useForm<CategorySchemaType>({
    resolver: zodResolver(CategorySchema),
    defaultValues: {
      type: type,
      name: "", // <-- Make sure this exists and is a string from the start
      icon: "", // <-- Same here
    },
  });

  const queryClient = useQueryClient();
  const theme = useTheme();

  //   ! action on the save button
  const { mutate, isPending } = useMutation({
    mutationFn: ServerCategories,
    onSuccess: async (data: Category) => {
      form.reset({
        name: "",
        icon: "",
        type,
      });

      toast.success(`Category ${data.name} created successfully 💫`, {
        id: "category-create",
      });

      onSuccessCallBack(data);

      //? When ever the category section is used , we need to invalidate the cache
      await queryClient.invalidateQueries({
        queryKey: ["category"],
      });

      //*toggle the category dialog
      setOpen((prev) => !prev);
    },

    onError: () => {
      toast.error("Something went wrong", {
        id: "category-create",
      });
    },
  });

  //? on submit action nad to avoid rendering problem we wrap it with usecallback
  const onSubmit = useCallback(
    (val: CategorySchemaType) => {
      toast.loading("Creating category...", {
        id: "category-create",
      });

      mutate(val);
    },
    [mutate]
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={"ghost"}
          className="flex items-center justify-start rounded-none border-b px-3 py-3 text-muted-foreground "
        >
          <PlusSquare className="mr-2 h-4 w-4 " />
          Create a new category
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Create{" "}
            <span
              className={cn(
                "mt-1",
                type === "income" ? "text-emerald-500" : "text-rose-500"
              )}
            >
              {type}
            </span>{" "}
            category
          </DialogTitle>
          <DialogDescription>
            Categories are used to group your transaction
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 ">
            {/* //*Description input */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormItem>Name</FormItem>
                  <FormControl>
                    <Input
                      placeholder="Category"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Category name (required)</FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormItem>Icon</FormItem>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className="h-[100px] w-full "
                        >
                          {form.watch("icon") ? (
                            <div className="flex flex-col items-center gap-2 ">
                              <span className="text-5xl" role="img">
                                {field.value}
                              </span>
                              <p className="text-xs text-muted-foreground ">
                                Click to change
                              </p>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-2 ">
                              <CircleOff className="h-[52px] w-[52px]" />
                              <p className="text-xs text-muted-foreground ">
                                Click to select
                              </p>
                            </div>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full">
                        {/* //! icon picker */}
                        <Picker
                          data={data}
                          theme={theme.resolvedTheme}
                          //! to see the emoji and native as 'native' is the attribute that return the actual emoji
                          onEmojiSelect={(emoji: { native: string }) => {
                            // ?when ever the feild is changed
                            field.onChange(emoji.native);
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormDescription>
                    This is how your category will appear in the application
                  </FormDescription>
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant={"secondary"}
              onClick={() => form.reset()}
              className="cursor-pointer "
            >
              Cancel
            </Button>
          </DialogClose>

          <DialogClose asChild>
            <Button
              onClick={form.handleSubmit(onSubmit)}
              disabled={isPending}
              type="submit"
              className="cursor-pointer "
            >
              {!isPending && "Create"}
              {isPending && <Loader2 className="animate-spin" />}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CategoryDialog;
