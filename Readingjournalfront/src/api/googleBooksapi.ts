import axios from "axios";

const GOOGLE_BOOKS_URL = "https://www.googleapis.com/books/v1/volumes";

export interface GoogleBook {
  title: string;
  authors?: string[];
  description?: string;
  imageLinks?: {
    thumbnail?: string;
  };
  industryIdentifiers?: { type: string; identifier: string }[];
}

export const fetchBookFromGoogle = async (title: string) => {
  if (!title.trim()) return null;

  const response = await axios.get(GOOGLE_BOOKS_URL, {
    params: {
      q: title,
      maxResults: 1,
      printType: "books",
    },
  });

  const book = response.data.items?.[0]?.volumeInfo as GoogleBook | undefined;

  if (!book) return null;

  return {
    title: book.title,
    author: book.authors?.join(", ") || "",
    isbn:
      book.industryIdentifiers?.find((id) => id.type.includes("ISBN"))
        ?.identifier || "",
    coverUrl: book.imageLinks?.thumbnail || "",
    description: book.description || "",
  };
};
