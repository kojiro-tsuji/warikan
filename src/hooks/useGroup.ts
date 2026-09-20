"use client";

import useSWR from "swr";
import { Group } from "@/domain/types";
import { useRepository } from "./useRepository";

export function useGroup(groupId: string) {
  const repository = useRepository();
  const { data, isLoading, mutate } = useSWR<Group | null>(
    ["group", groupId],
    () => repository.getGroup(groupId)
  );

  return { group: data ?? null, isLoading, refresh: mutate };
}
