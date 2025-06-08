"use client";

import React, { useState } from "react";
import Logo from "./Logo";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "./ui/button";
import { useClerk, UserButton } from "@clerk/nextjs";
import { ThemeSwitchBtn } from "./ThemeSwitchBtn";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Menu } from "lucide-react";
//we are going to have two version one for desktop and one for the mobile

function NavBar() {
  return (
    <>
      <DesktopNavBar />
      <MobileNavBar />
    </>
  );
}

//define our routes on the navbar
const items = [
  {
    label: "Dashboard",
    link: "/",
  },
  {
    label: "Transaction",
    link: "/transaction",
  },
  {
    label: "Manage",
    link: "/manage",
  },
];

function MobileNavBar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="block border-separate bg-background md:hidden ">
      <nav className="container flex items-center justify-between px-8 ">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant={"ghost"} size={"icon"}>
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[400px] sw:w-[540px] " side="left">
            <Logo />
            <div className="flex flex-col gap-1 pt-4 ">
              {items.map((item) => (
                <NavBarItem
                  key={item.label}
                  link={item.link}
                  label={item.label}
                  onClickCheck={() => setIsOpen((prev) => !prev)}
                />
              ))}
            </div>
          </SheetContent>
        </Sheet>
        <div className="flex h-[80px] min-h-[60px] items-center gap-x-4  ">
          <Logo />
        </div>
        <div className="flex items-center justify-between gap-2  ">
          <ThemeSwitchBtn />
          <UserButton />
        </div>
      </nav>
    </div>
  );
}

//make a desktop Nav bar
function DesktopNavBar() {
  const { signOut } = useClerk();
  const router = useRouter();

  return (
    <div className="hidden border-separate border-b bg-background md:block">
      <nav className="container flex items-center justify-between px-8 ">
        <div className="flex h-[80px] min-h-[60px] items-center  gap-x-4 ">
          <Logo />
          <div className="flex min-h-full ">
            {items.map((item) => (
              <NavBarItem
                key={item.label}
                link={item.link}
                label={item.label}
              />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 ">
          <ThemeSwitchBtn />
          <UserButton />
        </div>
      </nav>
    </div>
  );
}

function NavBarItem({
  link,
  label,
  onClickCheck,
}: {
  link: string;
  label: string;
  onClickCheck?: () => void;
}) {
  const pathname = usePathname();
  const isActive = pathname === link;

  return (
    <div className="relative flex items-center ">
      <Link
        href={link}
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "min-w-full justify-start text-lg text-muted-foreground hover:text-foreground",
          isActive && "text-foreground "
        )}
        onClick={() => {
          if (onClickCheck) onClickCheck();
        }}
      >
        {label}
      </Link>
      {isActive && (
        <div className="absolute -bottom-[2px] left-1/2 h-[2px] w-[80%] -translate-x-1/2 rounded-xl md:block bg-emerald-500 "></div>
      )}
    </div>
  );
}

export default NavBar;
