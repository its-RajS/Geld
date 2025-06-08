// components/Logo.tsx
"use client";

import { HandCoins } from "lucide-react";

export default function Logo() {
  return (
    <a href="/" className="flex items-center gap-2">
      <HandCoins className="h-11 w-11 stroke-emerald-600 stroke-[1.5]" />
      <p className="bg-gradient-to-r from-emerald-400 to-green-700 bg-clip-text text-3xl font-bold text-transparent leading-tight tracking-tighter">
        Geld
      </p>
    </a>
  );
}
