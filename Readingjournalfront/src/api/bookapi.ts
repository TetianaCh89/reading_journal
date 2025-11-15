import type { ReadingEntryRes, BookResponse, Book, ReadingEntryReq } from "../types.ts";
import axios, { type AxiosRequestConfig } from "axios";
import { jwtDecode } from "jwt-decode";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("jwt");
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("JWT has expired or is invalid — performing logout");
      sessionStorage.removeItem("jwt");
      window.location.reload(); 
    }
    return Promise.reject(error);
  }
);

const getAxiosConfig = (): AxiosRequestConfig => {
  const token = sessionStorage.getItem("jwt");
  return {
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  };
};

export const updateRating = async (entry: ReadingEntryRes): Promise<ReadingEntryRes> => {
  const response = await api.put(entry._links.self.href, entry, getAxiosConfig());
  return response.data;
};

export const deleteReadingEntry = async (link: string): Promise<ReadingEntryRes> => {
  const response = await api.delete(link, getAxiosConfig());
  return response.data;
};

export const addReadingEntry = async (entry: ReadingEntryReq): Promise<ReadingEntryRes> => {
  console.log("Add reading entry:", entry);
  const response = await api.post(`/api/readingEntries`, entry, getAxiosConfig());
  return response.data;
};

export const searchBooksByTitle = async (title: string): Promise<BookResponse[]> => {
  const response = await api.get(`/api/books/search/findByTitleContainingIgnoreCase`, {
    ...getAxiosConfig(),
    params: { title },
  });
  console.log("Found books:", response.data._embedded?.books);
  return response.data._embedded?.books || [];
};

export const addBook = async (book: Book): Promise<BookResponse> => {
  const response = await api.post(`/api/books`, book, getAxiosConfig());
  console.log("Book added:", response.data);
  return response.data;
};

export const getUserBooks = async (): Promise<ReadingEntryRes[]> => {
  const token = sessionStorage.getItem("jwt");
  let username: string | null = null;

  if (token) {
    const pureToken = token.startsWith("Bearer ") ? token.slice(7) : token;
    const decoded = jwtDecode<{ sub: string }>(pureToken);
    username = decoded.sub;
    console.log("Username:", username);
  }

  const response = await api.get(
    `/api/readingEntries/search/findByUserUsername?username=${encodeURIComponent(username || "")}`,
    getAxiosConfig()
  );

  const entries = response.data._embedded.readingEntries;
  const entriesWithBooks = await Promise.all(
    entries.map(async (entry: ReadingEntryRes) => {
      const bookResponse = await api.get(entry._links.book.href, getAxiosConfig());
      return { ...entry, book: bookResponse.data };
    })
  );
  console.log("User reading entries:", entriesWithBooks);
  return entriesWithBooks;
};

export const getAllBooks = async (): Promise<BookResponse[]> => {
  const response = await api.get(`/api/books`, getAxiosConfig());
  console.log("All books:", response.data._embedded?.books || []);
  return response.data?._embedded?.books || [];
};
