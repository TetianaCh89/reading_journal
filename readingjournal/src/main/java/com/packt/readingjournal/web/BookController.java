package com.packt.readingjournal.web;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.packt.readingjournal.domain.Book;
import com.packt.readingjournal.domain.BookRepository;

@RestController
public class BookController {
	private final BookRepository bookRepository;
	
	public BookController(BookRepository bookRepository) {
		this.bookRepository = bookRepository;
	}
	@GetMapping("/books")
	public Iterable<Book> getBooks(){
		return bookRepository.findAll();
	}
    @GetMapping("/search")
    public ResponseEntity<List<Book>> searchBooks(@RequestParam String title) {
        List<Book> books = bookRepository.findByTitleContainingIgnoreCase(title);
        return ResponseEntity.ok(books);
    }

    @PostMapping
    public ResponseEntity<Book> addBook(@RequestBody Book newBook) {
        Book saved = bookRepository.save(newBook);
        return ResponseEntity.ok(saved);
    }

}
