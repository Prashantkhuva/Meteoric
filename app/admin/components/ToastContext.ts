"use client";

import { createContext, useContext } from "react";

export type AddToast = (message: string, type?: string) => void;

export const ToastContext = createContext<AddToast | null>(null);

export function useToast(): AddToast {
  return useContext(ToastContext) as AddToast;
}
