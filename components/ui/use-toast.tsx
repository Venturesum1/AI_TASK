"use client";

import * as React from "react";
import { Toaster } from "sonner";

export function useToast() {
  const toast = (message: string) => {
    alert(message); 
  };

  return { toast };
}

export function ToastProvider() {
  return <Toaster />;
}