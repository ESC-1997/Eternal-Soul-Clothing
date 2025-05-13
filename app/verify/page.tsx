"use client";
import { Suspense } from "react";
import VerifyPageInner from "./VerifyPageInner";

export default function VerifyPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyPageInner />
    </Suspense>
  );
} 