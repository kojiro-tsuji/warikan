"use client";

import { useMemo } from "react";
import { WarikanRepository } from "@/data/repository";
import { LocalStorageRepository } from "@/data/localStorageRepository";

export function useRepository(): WarikanRepository {
  return useMemo(() => new LocalStorageRepository(), []);
}
