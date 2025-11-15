export type RatingStatus = 0|1|2|3|4|5;
export type BookResponse = {
    // id?: { id: number };
    title: string;
    author: string;
    isbn: string;
    coverUrl: string;
    description: string;
    _links: {
          self: { href: string},
          readingEntry: { href: string },
          book: { href: string }
    };
}
export type ReadingEntryReq = {
  status: ReadingStatus | null;
  rating: RatingStatus | null;
  opinion: string | null;
  startDate: string | null;
  endDate: string | null;
  book: string; 
  user?: string; 
};

export type Book = {
    title: string;
    author: string;
    isbn: string;
    coverUrl: string;
    description: string;
}
export type ReadingEntry = {
    status: ReadingStatus|null| undefined;
    rating: RatingStatus|null;
    opinion: string|null;
    startDate: string|null;
    endDate: string|null;
    book: BookResponse;
}
export type ReadingEntryRes = {
    id: number;
    status: ReadingStatus;
    rating: RatingStatus|null;
    opinion: string|null;
    startDate: string|null;
    endDate: string|null;
        book: {
            title: string;
            author: string;
            isbn: string;
            coverUrl: string;
            description: string;
            _links: {
                self: { href: string},
                readingEntry: { href: string },
                book: { href: string }
            };
        };
        _links: {
          self: { href: string},
          readingEntry: { href: string },
          user: { href: string },
          book: { href: string }
    };
}
export type ReadingStatus = 'PLANNED' | 'READING' | 'COMPLETED';