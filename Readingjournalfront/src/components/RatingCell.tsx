import { Rating as MuiRating } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { updateRating } from "../api/bookapi";
import type { ReadingEntryRes, RatingStatus } from "../types";

type RatingCellProps = {
  value: RatingStatus | null;
  row: ReadingEntryRes;
  onRatingChange: (id: string, newRating: RatingStatus) => void;
};

export default function RatingCell({ value, row, onRatingChange }: RatingCellProps) {
  const mutation = useMutation({
    mutationFn: updateRating,
    onSuccess: (updatedEntry: ReadingEntryRes) => {
      if (updatedEntry.rating != null) {
        onRatingChange(updatedEntry._links.self.href, updatedEntry.rating);
      }
    },
  });

  return (
    <MuiRating
      value={value ?? 0}
      onChange={(_, newValue) => {
        if (newValue != null) {
          const id = row._links?.self?.href;

          if (!id) {
            onRatingChange("", newValue as RatingStatus);
            return;
          }

          const updatedEntry: ReadingEntryRes = {
            ...row,
            rating: newValue as RatingStatus,
          };

          mutation.mutate(updatedEntry);
        }
      }}
    />
  );
}