"use client";

import { useMemo } from "react";
import { WarikanRepository } from "@/data/repository";
import { ApiRepository } from "@/data/apiRepository";

export function useRepository(): WarikanRepository {
  return useMemo(() => new ApiRepository(), []);
}
