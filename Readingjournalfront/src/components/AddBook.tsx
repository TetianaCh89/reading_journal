import { useState} from "react";
import { TextField, Box, CircularProgress } from "@mui/material";
import type { Book } from "../types";
import { fetchBookFromGoogle } from "../api/googleBooksapi";

type BookFormProps = {
  book: Partial<Book>;
  onChange: (field: keyof Book, value: string) => void;
};

export default function BookForm({ book, onChange }: BookFormProps) {
  const [loading, setLoading] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<number | undefined>();

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    onChange("title", newTitle);

    if (typingTimeout) clearTimeout(typingTimeout);
    const timeout = window.setTimeout(async () => {
      if (newTitle.length > 3) {
        setLoading(true);
        const googleBook = await fetchBookFromGoogle(newTitle);
        setLoading(false);

        if (googleBook) {
          onChange("author", googleBook.author);
          onChange("isbn", googleBook.isbn);
          onChange("coverUrl", googleBook.coverUrl);
          onChange("description", googleBook.description);
        }
      }
    }, 800);

    setTypingTimeout(timeout);
  };

  return (
    <Box sx={{ display: "grid", gap: 2, mt: 2, position: "relative" }}>
      <TextField
        label="Title"
        value={book.title || ""}
        onChange={handleTitleChange}
        fullWidth
      />

      {loading && (
        <CircularProgress
          size={24}
          sx={{ position: "absolute", top: 16, right: 16 }}
        />
      )}

      <TextField
        label="Author"
        value={book.author || ""}
        onChange={(e) => onChange("author", e.target.value)}
        fullWidth
      />
      <TextField
        label="ISBN"
        value={book.isbn || ""}
        onChange={(e) => onChange("isbn", e.target.value)}
        fullWidth
      />
      <TextField
        label="Cover URL"
        value={book.coverUrl || ""}
        onChange={(e) => onChange("coverUrl", e.target.value)}
        fullWidth
      />
      <TextField
        label="Description"
        value={book.description || ""}
        onChange={(e) => onChange("description", e.target.value)}
        fullWidth
        multiline
        minRows={3}
      />
    </Box>
  );
}
