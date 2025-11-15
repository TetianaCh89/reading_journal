import type { ReadingStatus } from "../types";

export const readingStatuses: ReadingStatus[] = ["PLANNED", "READING", "COMPLETED"];

export function formatReadingStatus(status: ReadingStatus) {
  return status
    .toLowerCase()
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}