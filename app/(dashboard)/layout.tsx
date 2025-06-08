import NavBar from "@/components/NavBar";
import React, { ReactNode } from "react";

function layout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen min-w-full flex flex-col ">
      <NavBar />
      <div className="w-full">{children}</div>
    </div>
  );
}

export default layout;
