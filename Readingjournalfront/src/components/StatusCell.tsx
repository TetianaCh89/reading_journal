import { Select, MenuItem} from "@mui/material";
import type { ReadingStatus, ReadingEntryRes } from "../types";
import { readingStatuses, formatReadingStatus } from "../utils/ReadingStatusUtils";

type StatusCellProps = {
  row: ReadingEntryRes;
  onStatusChange: (id: string, newStatus: ReadingStatus) => void;
};

export default function StatusCell({ row, onStatusChange }: StatusCellProps) {
  return (
<Select
  value={row.status || "PLANNED"}
  onChange={(e) => {
    const newStatus = e.target.value as ReadingStatus;
    const id = row._links?.self?.href || "";
    onStatusChange(id, newStatus);
  }}
  size="small"
>
  {readingStatuses.map((status) => (
    <MenuItem key={status} value={status}>
      {formatReadingStatus(status)}
    </MenuItem>
  ))}
</Select>
  );
}