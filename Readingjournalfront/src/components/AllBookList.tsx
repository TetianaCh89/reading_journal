import { useQuery } from "@tanstack/react-query";
import { getAllBooks } from "../api/bookapi";

export default function AllBookList() {
  const { data: books, isLoading, isError, error } = useQuery({
    queryKey: ["allBooks"],
    queryFn: getAllBooks,
  });

  if (isLoading)
    return <p className="text-center text-gray-500">Loading...</p>;

  if (isError)
    return (
      <p className="text-center text-red-500">
        {(error as Error).message || "Error loading books"}
      </p>
    );

  if (!books?.length)
    return <p className="text-center text-gray-500">No books found 📚</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold text-center mb-6">
        📚 All books
      </h2>

      {books.length === 0 ? (
        <p className="text-center text-gray-500">No books.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {books.map((book) => (
            <div
              key={book._links?.self?.href || book.title}
              className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              {book.coverUrl && (
                <img
                  src={book.coverUrl}
                  alt={book.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 truncate">
                  {book.title}
                </h3>
                <p className="text-sm text-gray-600 mb-2">{book.author}</p>
                {book.description && (
                  <p className="text-sm text-gray-500 line-clamp-3">
                    {book.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
