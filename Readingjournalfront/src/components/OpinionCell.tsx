import { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
} from "@mui/material";
import type { ReadingEntryRes } from "../types";
import { getOpinionStyle } from "../utils/OpinionStyle";
import type { OpinionVariant } from "../utils/OpinionStyle";

type OpinionCellProps = {
  row: ReadingEntryRes;
  onOpinionChange: (id: string, newOpinion: string) => void;
  variant?: OpinionVariant;
};

export default function OpinionCell({
  row,
  onOpinionChange,
  variant = "table",
}: OpinionCellProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(row.opinion || "");

  const handleSave = () => {
    onOpinionChange(row?._links?.self?.href || "", value);
    setValue("");
    setOpen(false);
  };

  return (
    <>
      <span
        style={getOpinionStyle(!!row.opinion, variant)}
        onClick={() => setOpen(true)}
      >
        {row.opinion || "Add opinion"}
      </span>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Edit Opinion</DialogTitle>
        <DialogContent>
          <TextField
            value={value}
            onChange={(e) => setValue(e.target.value)}
            multiline
            fullWidth
            minRows={4}
            autoFocus
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setValue("");
            setOpen(false);}
            }>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
