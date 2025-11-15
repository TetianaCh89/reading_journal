import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Tooltip,
  Button,
  IconButton,
  Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import type { Book, BookResponse } from '../types';

type FormProps = {
  bookdata: BookResponse;
};

export default function Book({ bookdata }: FormProps) {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setSelectedBook({
      author: bookdata.author,
      title: bookdata.title,
      isbn: bookdata.isbn,
      description: bookdata.description,
      coverUrl: bookdata.coverUrl,
    });
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  return (
    <>
      <Tooltip title="Show book details">
        <Button
          variant="text"
          color="primary"
          onClick={handleOpen}
          sx={{ textTransform: 'none' }}
        >
          {bookdata.title || 'Untitled'}
        </Button>
      </Tooltip>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ m: 0, p: 2 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">{selectedBook?.title}</Typography>
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={{
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent dividers>
          {selectedBook ? (
            <>
              <Typography>
                <strong>Author:</strong> {selectedBook.author}
              </Typography>
              <Typography>
                <strong>ISBN:</strong> {selectedBook.isbn}
              </Typography>
              <Typography sx={{ mt: 1 }}>
                {selectedBook.description}
              </Typography>
              {selectedBook.coverUrl && (
                <img
                  src={selectedBook.coverUrl}
                  alt={selectedBook.title}
                  style={{
                    width: '50%',
                    marginTop: '10px',
                    borderRadius: 8,
                  }}
                />
              )}
            </>
          ) : (
            <Typography>No book data</Typography>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}