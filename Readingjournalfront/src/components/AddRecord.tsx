import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  CircularProgress,
  Box,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { searchBooksByTitle, addBook, addReadingEntry } from "../api/bookapi";
import type {
  Book,
  BookResponse,
  ReadingEntryRes,
  ReadingStatus,
  RatingStatus,
  ReadingEntryReq,
  ReadingEntry,
} from "../types";
import StatusCell from "./StatusCell";
import RatingCell from "./RatingCell";
import OpinionCell from "./OpinionCell";
import BookForm from "./AddBook";

interface AddRecordDialogProps {
  open: boolean;
  onClose: () => void;
  onRecordCreated?: () => void;
}

export const AddRecordDialog: React.FC<AddRecordDialogProps> = ({
  open,
  onClose,
  onRecordCreated,
}) => {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  const [record, setRecord] = useState<Partial<ReadingEntry>>({
    status: "PLANNED" as ReadingStatus,
    rating: null,
    opinion: "",
    startDate: null,
    endDate: null,
  });

  const [newBook, setNewBook] = useState<Partial<Book>>({ title: "" });
  const [showBookForm, setShowBookForm] = useState(false);

  const resetForm = () => {
    setQuery("");
    setDebouncedQuery("");
    setShowBookForm(false);
    setNewBook({ title: "" });
    setRecord({
      status: "PLANNED",
      rating: null,
      opinion: "",
      startDate: null,
      endDate: null,
    });
  };

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 350);
    return () => clearTimeout(t);
  }, [query]);

  const { data: foundBooks, isFetching } = useQuery({
    queryKey: ["books", debouncedQuery],
    queryFn: () => searchBooksByTitle(debouncedQuery),
    enabled: debouncedQuery.trim().length > 1,
  });

  const handleBookFieldChange = (field: keyof Book, value: string) => {
    setNewBook((prev) => ({ ...prev, [field]: value }));
  };

  const handleEntryChange = <K extends keyof ReadingEntryRes>(
    field: K,
    value: ReadingEntryRes[K]
  ) => {
    setRecord((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "status") {
        const newStatus = value as ReadingStatus;
        const today = new Date().toISOString().split("T")[0];
        if (newStatus === "READING" && !prev.startDate) next.startDate = today;
        if (newStatus === "COMPLETED") {
          if (!prev.startDate) next.startDate = today;
          next.endDate = today;
        }
      }
      return next;
    });
  };

  const queryClient = useQueryClient();
  const [selectedBookHref, setSelectedBookHref] = useState<string | null>(null);

  const handleQueryChange = (value: string) => {
    setQuery(value);
    setSelectedBookHref(null); 
  };

  const handleSelectBook = (book: BookResponse) => {
    setQuery(book.title || "");          
    setSelectedBookHref(book._links.self.href); 
    setRecord((prev) => ({ ...prev, book }));
  };
const addBookMutation = useMutation({
  mutationFn: addBook,
});

const addRecordMutation = useMutation({
  mutationFn: addReadingEntry,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["readingEntries"] });
    onRecordCreated?.();
  },
  onError: (err) => console.error(err),
});

const handleSaveRecord = async () => {
  console.log("Save record (todo: send to backend)", record);

  try {
    let bookToUse = record.book;

    if (showBookForm && newBook.title?.trim()) {
      bookToUse = await addBookMutation.mutateAsync(newBook as Book);
    }
    if (bookToUse) {
      const recordToSend: ReadingEntryReq = {
        status: record.status ?? null,
        rating: record.rating ?? null,
        opinion: record.opinion ?? null,
        startDate: record.startDate ?? null,
        endDate: record.endDate ?? null,
        book: bookToUse._links.self.href, 
        // user: currentUser._links.self.href 
      };

      console.log("Sending reading entry:", recordToSend);

      await addRecordMutation.mutateAsync(recordToSend);
      queryClient.invalidateQueries({ queryKey: ["books"] });
    }

    resetForm();
    onClose();
  } catch (err) {
    console.error("Error while saving record:", err);
  }
};
  const handleCancel = () => {
    resetForm(); 
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleCancel} fullWidth maxWidth="sm">
      <DialogTitle>Create reading record</DialogTitle>

      <DialogContent>
        {!showBookForm && (
          <TextField
            label="Book title or partial"
            fullWidth
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            size="small"
            sx={{ mt: 1, mb: 2 }}
          />
        )}

        {isFetching && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 1 }}>
            <CircularProgress size={20} />
          </Box>
        )}

        {!showBookForm && foundBooks && foundBooks.length > 0 && !selectedBookHref && (
          <List dense>
            {foundBooks.map((b) => (
              <ListItem key={b._links.self.href} disablePadding>
                <ListItemButton onClick={() => handleSelectBook(b)}>
                  <ListItemText primary={b.title || "(no title)"} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}

        <Box sx={{ mt: 2 }}>
          {!showBookForm && (
            <Button
              variant="outlined"
              onClick={() => setShowBookForm((prev) => !prev)}
            >
              Add new book
            </Button>
          )}

          {showBookForm && (
            <BookForm book={newBook} onChange={handleBookFieldChange} />
          )}
        </Box>

        <Box sx={{ mt: 3, display: "grid", gap: 2 }}>
          {(showBookForm || record.book) && (
            <>
              <StatusCell
                row={record as ReadingEntryRes}
                onStatusChange={(_, newStatus) =>
                  handleEntryChange("status", newStatus)
                }
              />

              <RatingCell
                value={record.rating as RatingStatus | null}
                row={record as ReadingEntryRes}
                onRatingChange={(_, newRating) =>
                  handleEntryChange("rating", newRating)
                }
              />

              <OpinionCell
                variant="form"
                row={record as ReadingEntryRes}
                onOpinionChange={(_, newOpinion) =>
                  handleEntryChange("opinion", newOpinion)
                }
              />
            </>
          )}

          <Box sx={{ display: "flex", gap: 1 }}>
            <TextField
              label="Start date"
              type="date"
              size="small"
              value={record.startDate ?? ""}
              onChange={(e) => handleEntryChange("startDate", e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="End date"
              type="date"
              size="small"
              value={record.endDate ?? ""}
              onChange={(e) => handleEntryChange("endDate", e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleCancel} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSaveRecord} variant="contained">
          Save record
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddRecordDialog;
